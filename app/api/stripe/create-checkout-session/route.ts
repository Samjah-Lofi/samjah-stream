import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "CHECKOUT SESSION FEHLER:",
        sessionError
      );

      return NextResponse.json(
        {
          error: sessionError.message,
        },
        {
          status: 401,
        }
      );
    }

    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        {
          error: "Nicht eingeloggt.",
        },
        {
          status: 401,
        }
      );
    }

    const { data: existingSubscription, error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .select(
          "status, plan, stripe_customer_id, stripe_subscription_id, cancel_at_period_end"
        )
        .eq("user_id", user.id)
        .maybeSingle();

    if (subscriptionError) {
      console.error(
        "SUBSCRIPTION PRÜFUNG FEHLER:",
        subscriptionError
      );

      return NextResponse.json(
        {
          error:
            "Der aktuelle Abo-Status konnte nicht geprüft werden.",
        },
        {
          status: 500,
        }
      );
    }

    const hasActivePremium =
      existingSubscription?.plan === "premium" &&
      (
        existingSubscription.status === "active" ||
        existingSubscription.status === "trialing" ||
        existingSubscription.status === "past_due"
      );

    if (hasActivePremium) {
      return NextResponse.json(
        {
          error:
            "Du hast bereits ein aktives Premium-Abo.",
        },
        {
          status: 409,
        }
      );
    }

    const priceId =
      process.env.STRIPE_PREMIUM_PRICE_ID;

    if (!priceId) {
      console.error(
        "STRIPE_PREMIUM_PRICE_ID fehlt."
      );

      return NextResponse.json(
        {
          error:
            "STRIPE_PREMIUM_PRICE_ID fehlt.",
        },
        {
          status: 500,
        }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://samjah-stream.vercel.app";

    console.log(
      "STRIPE CHECKOUT USER:",
      user.id
    );

    console.log(
      "STRIPE CHECKOUT EMAIL:",
      user.email || "keine E-Mail"
    );

    console.log(
      "STRIPE CHECKOUT PRICE:",
      priceId
    );

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email:
          user.email || undefined,

        client_reference_id: user.id,

        metadata: {
          user_id: user.id,
        },

        subscription_data: {
          metadata: {
            user_id: user.id,
          },
        },

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        success_url:
          `${origin}/abo/erfolg?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/abo`,

        allow_promotion_codes: true,
      });

    console.log(
      "STRIPE CHECKOUT ERSTELLT:",
      checkoutSession.id
    );

    if (!checkoutSession.url) {
      return NextResponse.json(
        {
          error:
            "Stripe hat keine Checkout URL zurückgegeben.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error(
      "STRIPE CHECKOUT FEHLER:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout konnte nicht erstellt werden.",
      },
      {
        status: 500,
      }
    );
  }
}