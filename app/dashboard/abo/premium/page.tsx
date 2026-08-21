"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

const features = [
  "Alle Samjah Atmosphären",
  "Unbegrenztes Anhören",
  "Premium Musikwelten",
  "Nutzung für Cafés, Restaurants und Hotels",
  "Neue Atmosphären zuerst",
];

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Der Checkout konnte nicht gestartet werden."
        );
      }

      if (!data?.url) {
        throw new Error(
          "Stripe hat keine Checkout URL zurückgegeben."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(
        "Checkout Fehler:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Der Checkout konnte nicht gestartet werden."
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-40">
      <section className="px-12 pt-10">
        <Link
          href="/dashboard/abo"
          className="inline-flex items-center gap-2 text-[#BFAE98] transition hover:text-[#D89A3C]"
        >
          <ArrowLeft size={18} />
          Zurück zum Abo
        </Link>
      </section>

      <section className="mx-auto mt-10 max-w-5xl px-12">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="rounded-[32px] border border-[#D89A3C]/40 bg-[#211A17] p-10 lg:col-span-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2A201A]">
              <CreditCard
                size={26}
                className="text-[#D89A3C]"
              />
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[#D89A3C]">
              Premium
            </p>

            <h1 className="mt-3 text-5xl font-black text-[#F5E9D8]">
              Samjah Premium
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#BFAE98]">
              Professionelle Hintergrundmusik für deine
              Location. Der komplette Samjah Katalog an
              einem Ort.
            </p>

            <div className="mt-10">
              <span className="text-5xl font-black text-[#F5E9D8]">
                19,90 €
              </span>

              <span className="ml-3 text-[#8D7B68]">
                pro Monat
              </span>
            </div>

            <div className="mt-10 border-t border-[#3A2B22] pt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-[#8D7B68]">
                Dein Premium Zugang
              </p>

              <ul className="mt-6 space-y-4">
                {features.map((feature) => (
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
          </div>

          <div className="rounded-[32px] border border-[#3A2B22] bg-[#171311] p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#F5E9D8]">
              Bestellung
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#3A2B22] pb-5">
                <span className="text-[#BFAE98]">
                  Samjah Premium
                </span>

                <span className="font-semibold text-[#F5E9D8]">
                  19,90 €
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#BFAE98]">
                  Abrechnung
                </span>

                <span className="font-semibold text-[#F5E9D8]">
                  monatlich
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#3A2B22] pt-5">
                <span className="text-lg font-bold text-[#F5E9D8]">
                  Gesamt
                </span>

                <span className="text-2xl font-black text-[#D89A3C]">
                  19,90 €
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D89A3C] px-6 py-5 font-bold text-[#120D09] transition hover:bg-[#E9B65A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={20} />

              {loading
                ? "Checkout wird geöffnet..."
                : "Jetzt abonnieren"}
            </button>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#D89A3C]"
              />

              <p className="text-sm leading-6 text-[#8D7B68]">
                Du wirst zur sicheren Stripe Zahlungsseite
                weitergeleitet. Die Zahlung wird dort
                durchgeführt.
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#6F6257]">
              19,90 € pro Monat. Jederzeit kündbar.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}