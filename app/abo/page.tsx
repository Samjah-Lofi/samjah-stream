"use client";

import {
  Check,
  CreditCard,
  Sparkles,
  Settings,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const premiumFeatures = [
  "Alle Atmosphären",
  "Unbegrenztes Anhören",
  "Premium Musikwelten",
  "Für Cafés, Restaurants und Hotels",
  "Neue Atmosphären zuerst",
];

type Subscription = {
  plan: "free" | "premium";
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "cancelled"
    | "canceled"
    | "expired";
  cancel_at_period_end: boolean | null;
};

export default function AboPage() {
  const router = useRouter();

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [openingPortal, setOpeningPortal] =
    useState(false);
  const [portalError, setPortalError] = useState("");

  useEffect(() => {
    const loadSubscription = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("subscriptions")
        .select(
          "plan, status, cancel_at_period_end"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "ABO STATUS FEHLER:",
          error
        );
      }

      if (data) {
        setSubscription(data);
      } else {
        setSubscription({
          plan: "free",
          status: "active",
          cancel_at_period_end: false,
        });
      }

      setLoading(false);
    };

    loadSubscription();
  }, [router]);

  const isPremium =
    subscription?.plan === "premium" &&
    (
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due"
    );

  const handleManageSubscription = async () => {
    if (openingPortal) {
      return;
    }

    setOpeningPortal(true);
    setPortalError("");

    try {
      const response = await fetch(
        "/api/stripe/create-portal-session",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Die Aboverwaltung konnte nicht geöffnet werden."
        );
      }

      if (!data?.url) {
        throw new Error(
          "Stripe hat keine Portal URL zurückgegeben."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(
        "ABO VERWALTUNG FEHLER:",
        error
      );

      setPortalError(
        error instanceof Error
          ? error.message
          : "Die Aboverwaltung konnte nicht geöffnet werden."
      );

      setOpeningPortal(false);
    }
  };

  return (
    <main className="min-h-screen pb-40">
      <section className="px-12 pt-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Samjah Membership
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Dein Abo
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Professionelle Hintergrundmusik für Cafés,
          Restaurants, Hotels und andere Locations.
        </p>
      </section>

      <section className="mt-12 px-12">
        <div className="relative mx-auto max-w-3xl rounded-[32px] border border-[#D89A3C]/60 bg-[#211A17] p-10 shadow-[0_30px_80px_rgba(216,154,60,.08)]">

          <div className="absolute right-10 top-10 flex items-center gap-2 rounded-full border border-[#D89A3C]/30 bg-[#D89A3C]/10 px-4 py-2 text-sm font-semibold text-[#D89A3C]">
            <Sparkles size={16} />
            {isPremium ? "Aktiv" : "Premium"}
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2A201A]">
            <CreditCard
              size={25}
              className="text-[#D89A3C]"
            />
          </div>

          <h2 className="mt-8 text-4xl font-bold text-[#F5E9D8]">
            Samjah Premium
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#BFAE98]">
            Der komplette Samjah Katalog für professionelle
            Umgebungen. Hochwertige Atmosphären, die deine
            Location musikalisch begleiten.
          </p>

          <div className="mt-10">
            <span className="text-6xl font-black text-[#F5E9D8]">
              19,90 €
            </span>

            <span className="ml-3 text-lg text-[#8D7B68]">
              pro Monat
            </span>
          </div>

          {loading ? (
            <div className="mt-10 flex items-center justify-center border-t border-[#3A2B22] pt-8 text-[#8D7B68]">
              <Loader2
                size={20}
                className="mr-3 animate-spin"
              />
              Abo Status wird geladen...
            </div>
          ) : (
            <>
              {isPremium && (
                <div className="mt-8 rounded-2xl border border-[#D89A3C]/30 bg-[#D89A3C]/10 px-5 py-4">
                  <p className="font-semibold text-[#D89A3C]">
                    Dein Premium Abo ist aktiv.
                  </p>

                  {subscription?.cancel_at_period_end && (
                    <p className="mt-1 text-sm leading-6 text-[#BFAE98]">
                      Dein Abo läuft zum Ende des aktuellen
                      Abrechnungszeitraums aus.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-10 border-t border-[#3A2B22] pt-8">
                <p className="text-sm uppercase tracking-[0.2em] text-[#8D7B68]">
                  Enthalten
                </p>

                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {premiumFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[#D6C6B4]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D89A3C]/15">
                        <Check
                          size={14}
                          className="text-[#D89A3C]"
                        />
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {portalError && (
                <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm leading-6 text-red-300">
                  {portalError}
                </div>
              )}

              {isPremium ? (
                <>
                  <button
                    type="button"
                    onClick={handleManageSubscription}
                    disabled={openingPortal}
                    className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D89A3C] px-6 py-5 text-lg font-bold text-[#120D09] transition hover:bg-[#E9B65A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {openingPortal ? (
                      <>
                        <Loader2
                          size={20}
                          className="animate-spin"
                        />
                        Aboverwaltung wird geöffnet...
                      </>
                    ) : (
                      <>
                        <Settings size={20} />
                        Abo verwalten
                      </>
                    )}
                  </button>

                  <p className="mt-5 text-center text-sm text-[#6F6257]">
                    Verwalte dein Abo, deine Zahlungsmethode
                    oder deine Kündigung über Stripe.
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href="/abo/premium"
                    className="mt-10 flex w-full items-center justify-center rounded-2xl bg-[#D89A3C] px-6 py-5 text-lg font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
                  >
                    Premium abonnieren
                  </Link>

                  <p className="mt-5 text-center text-sm text-[#6F6257]">
                    19,90 € pro Monat. Jederzeit kündbar.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}