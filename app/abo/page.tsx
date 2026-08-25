"use client";

import {
  Check,
  CreditCard,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import Footer from "@/components/Footer";

const premiumFeatures = [
  "Alle Atmosphären",
  "Unbegrenztes Anhören",
  "Premium Musikwelten",
  "Für Cafés, Restaurants und Hotels",
  "Neue Atmosphären zuerst",
];

export default function AboPage() {
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
            Premium
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

          <Link
            href="/abo/premium"
            className="mt-10 flex w-full items-center justify-center rounded-2xl bg-[#D89A3C] px-6 py-5 text-lg font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
          >
            Premium abonnieren
          </Link>

          <p className="mt-5 text-center text-sm text-[#6F6257]">
            19,90 € pro Monat. Jederzeit kündbar.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}