import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function toIsoDate(
  timestamp: number | null | undefined
): string | null {
  return typeof timestamp === "number"
    ? new Date(timestamp * 1000).toISOString()
    : null;
}

function getSubscriptionPeriod(
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & {
        current_period_start?: number;
        current_period_end?: number;
      })
    | undefined;

  return {
    periodStart: toIsoDate(item?.current_period_start),
    periodEnd: toIsoDate(item?.current_period_end),
  };
}

export async function POST(request: Request) {
  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Stripe Signatur fehlt." },
      { status: 400 }
    );
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error:
          "STRIPE_WEBHOOK_SECRET fehlt.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();

    const event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );

    console.log(
      "STRIPE WEBHOOK:",
      event.type
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession =
          event.data.object as Stripe.Checkout.Session;

        const userId =
          checkoutSession.metadata?.user_id;

        if (!userId) {
          console.error(
            "Keine user_id in Checkout Session:",
            checkoutSession.id
          );

          return NextResponse.json(
            { error: "user_id fehlt." },
            { status: 400 }
          );
        }

        const customerId =
          typeof checkoutSession.customer ===
          "string"
            ? checkoutSession.customer
            : null;

        const subscriptionId =
          typeof checkoutSession.subscription ===
          "string"
            ? checkoutSession.subscription
            : null;

        let periodStart: string | null = null;
        let periodEnd: string | null = null;

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(
              subscriptionId
            );

          const period =
            getSubscriptionPeriod(subscription);

          periodStart = period.periodStart;
          periodEnd = period.periodEnd;

          console.log(
            "STRIPE SUBSCRIPTION ZEITRAUM:",
            {
              subscriptionId,
              periodStart,
              periodEnd,
            }
          );
        }

        const { data, error } =
          await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                plan: "premium",
                status: "active",
                stripe_customer_id: customerId,
                stripe_subscription_id:
                  subscriptionId,
                price_id:
                  process.env
                    .STRIPE_PREMIUM_PRICE_ID,
                current_period_start:
                  periodStart,
                current_period_end:
                  periodEnd,
                cancel_at_period_end: false,
                cancel_at: null,
                canceled_at: null,
                updated_at:
                  new Date().toISOString(),
              },
              {
                onConflict: "user_id",
              }
            )
            .select();

        if (error) {
          console.error(
            "SUPABASE SUBSCRIPTION FEHLER:",
            error
          );

          return NextResponse.json(
            {
              error: error.message,
            },
            {
              status: 500,
            }
          );
        }

        console.log(
          "PREMIUM AKTIV:",
          data
        );

        break;
      }

      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        let userId =
          subscription.metadata?.user_id ??
          null;

        if (!userId) {
          const {
            data: existingSubscription,
            error: lookupError,
          } = await supabaseAdmin
            .from("subscriptions")
            .select("user_id")
            .eq(
              "stripe_subscription_id",
              subscription.id
            )
            .maybeSingle();

          if (lookupError) {
            console.error(
              "SUPABASE USER LOOKUP FEHLER:",
              lookupError
            );

            return NextResponse.json(
              {
                error: lookupError.message,
              },
              {
                status: 500,
              }
            );
          }

          userId =
            existingSubscription?.user_id ??
            null;
        }

        if (!userId) {
          console.error(
            "Keine user_id für Subscription gefunden:",
            subscription.id
          );

          return NextResponse.json(
            {
              error:
                "user_id für Subscription nicht gefunden.",
            },
            {
              status: 400,
            }
          );
        }

        const priceId =
          subscription.items.data[0]?.price?.id ??
          null;

        const {
          periodStart,
          periodEnd,
        } =
          getSubscriptionPeriod(subscription);

        const cancelAt =
          typeof subscription.cancel_at ===
          "number"
            ? new Date(
                subscription.cancel_at * 1000
              ).toISOString()
            : null;

        const canceledAt =
          typeof subscription.canceled_at ===
          "number"
            ? new Date(
                subscription.canceled_at * 1000
              ).toISOString()
            : null;

        const { error } =
          await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                plan: "premium",
                status: subscription.status,
                stripe_customer_id:
                  typeof subscription.customer ===
                  "string"
                    ? subscription.customer
                    : null,
                stripe_subscription_id:
                  subscription.id,
                price_id: priceId,
                current_period_start:
                  periodStart,
                current_period_end:
                  periodEnd,
                cancel_at_period_end:
                  subscription.cancel_at_period_end,
                cancel_at: cancelAt,
                canceled_at: canceledAt,
                updated_at:
                  new Date().toISOString(),
              },
              {
                onConflict: "user_id",
              }
            );

        if (error) {
          console.error(
            "SUPABASE UPDATE FEHLER:",
            error
          );

          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        console.log(
          "SUBSCRIPTION AKTUALISIERT:",
          userId,
          subscription.status,
          "period_start:",
          periodStart,
          "period_end:",
          periodEnd,
          "cancel_at:",
          cancelAt,
          "canceled_at:",
          canceledAt
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        let userId =
          subscription.metadata?.user_id ??
          null;

        if (!userId) {
          const {
            data: existingSubscription,
            error: lookupError,
          } = await supabaseAdmin
            .from("subscriptions")
            .select("user_id")
            .eq(
              "stripe_subscription_id",
              subscription.id
            )
            .maybeSingle();

          if (lookupError) {
            console.error(
              "SUPABASE USER LOOKUP FEHLER:",
              lookupError
            );

            return NextResponse.json(
              {
                error: lookupError.message,
              },
              {
                status: 500,
              }
            );
          }

          userId =
            existingSubscription?.user_id ??
            null;
        }

        if (!userId) {
          console.error(
            "Keine user_id für gelöschte Subscription gefunden:",
            subscription.id
          );

          return NextResponse.json(
            {
              error:
                "user_id für gelöschte Subscription nicht gefunden.",
            },
            {
              status: 400,
            }
          );
        }

        const cancelAt =
          typeof subscription.cancel_at ===
          "number"
            ? new Date(
                subscription.cancel_at * 1000
              ).toISOString()
            : null;

        const canceledAt =
          typeof subscription.canceled_at ===
          "number"
            ? new Date(
                subscription.canceled_at * 1000
              ).toISOString()
            : null;

        const { error } =
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "canceled",
              plan: "free",
              cancel_at_period_end: false,
              cancel_at: cancelAt,
              canceled_at: canceledAt,
              current_period_start: null,
              current_period_end: null,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "user_id",
              userId
            );

        if (error) {
          console.error(
            "SUPABASE KÜNDIGUNG FEHLER:",
            error
          );

          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        console.log(
          "PREMIUM BEENDET:",
          userId
        );

        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        let subscriptionId: string | null =
          null;

        if (
          invoice.parent?.type ===
          "subscription_details"
        ) {
          const subscription =
            invoice.parent
              .subscription_details
              ?.subscription;

          if (
            typeof subscription ===
            "string"
          ) {
            subscriptionId =
              subscription;
          }
        }

        if (subscriptionId) {
          const { error } =
            await supabaseAdmin
              .from("subscriptions")
              .update({
                status: "past_due",
                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                "stripe_subscription_id",
                subscriptionId
              );

          if (error) {
            console.error(
              "SUPABASE PAYMENT FAILED FEHLER:",
              error
            );
          }
        }

        break;
      }

      default:
        console.log(
          "Stripe Event nicht verarbeitet:",
          event.type
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "STRIPE WEBHOOK FEHLER:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook konnte nicht verarbeitet werden.",
      },
      {
        status: 400,
      }
    );
  }
}