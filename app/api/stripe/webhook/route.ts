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
      { error: "STRIPE_WEBHOOK_SECRET fehlt." },
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
          typeof checkoutSession.customer === "string"
            ? checkoutSession.customer
            : null;

        const subscriptionId =
          typeof checkoutSession.subscription === "string"
            ? checkoutSession.subscription
            : null;

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
                  process.env.STRIPE_PREMIUM_PRICE_ID,
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

        const userId =
          subscription.metadata?.user_id;

        if (!userId) {
          console.error(
            "Keine user_id in Subscription:",
            subscription.id
          );
          break;
        }

        const priceId =
          subscription.items.data[0]?.price?.id ?? null;

        const { error } =
          await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                plan: "premium",
                status: subscription.status,
                stripe_customer_id:
                  typeof subscription.customer === "string"
                    ? subscription.customer
                    : null,
                stripe_subscription_id:
                  subscription.id,
                price_id: priceId,
                cancel_at_period_end:
                  subscription.cancel_at_period_end,
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
          subscription.status
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const userId =
          subscription.metadata?.user_id;

        if (!userId) {
          break;
        }

        const { error } =
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "canceled",
              plan: "free",
              updated_at:
                new Date().toISOString(),
            })
            .eq("user_id", userId);

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

        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : null;

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