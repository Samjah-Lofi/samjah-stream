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
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "CHECKOUT USER FEHLER:",
        userError
      );

      return NextResponse.json(
        {
          error: userError.message,
        },
        {
          status: 401,
        }
      );
    }

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
          `${origin}/dashboard/abo/erfolg?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/dashboard/abo`,

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