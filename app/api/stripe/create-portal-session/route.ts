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

    console.log(
      "STRIPE PORTAL USER:",
      user ? "EINGELOGGT" : "NICHT EINGELOGGT"
    );

    if (userError) {
      console.error(
        "STRIPE PORTAL USER FEHLER:",
        userError
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

    const {
      data: subscription,
      error: subscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error(
        "ABO KANN NICHT GELADEN WERDEN:",
        subscriptionError
      );

      return NextResponse.json(
        {
          error: subscriptionError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "STRIPE CUSTOMER ID:",
      subscription?.stripe_customer_id || "FEHLT"
    );

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        {
          error:
            "Keine Stripe Kunden-ID für diesen Account gefunden.",
        },
        {
          status: 400,
        }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer:
          subscription.stripe_customer_id,

        return_url:
          `${origin}/dashboard/konto`,
      });

    console.log(
      "STRIPE PORTAL ERSTELLT"
    );

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error(
      "STRIPE PORTAL FEHLER:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Aboverwaltung konnte nicht geöffnet werden.",
      },
      {
        status: 500,
      }
    );
  }
}