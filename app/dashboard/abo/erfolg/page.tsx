"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function AboErfolgPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0908] px-6 pb-36 text-[#F5E9D8]">
      <section className="w-full max-w-2xl rounded-[32px] border border-[#3A2B22] bg-[#171311] p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D89A3C]/40 bg-[#D89A3C]/10">
          <CheckCircle
            size={42}
            className="text-[#D89A3C]"
          />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-[#D89A3C]">
          Zahlung erfolgreich
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Willkommen bei Samjah Premium
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#BFAE98]">
          Deine Zahlung war erfolgreich.
          Dein Premium-Abo wird jetzt für
          deinen Account aktiviert.
        </p>

        <div className="mt-10 rounded-2xl border border-[#3A2B22] bg-[#0F0D0C] p-6 text-left">
          <div className="flex items-center justify-between border-b border-[#2A201A] pb-4">
            <span className="text-[#BFAE98]">
              Samjah Premium
            </span>

            <span className="font-bold text-[#D9A441]">
              19,90 € / Monat
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[#F5E9D8]">
            <CheckCircle
              size={20}
              className="text-[#D89A3C]"
            />

            <span>
              Zahlung erfolgreich
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-[#F5E9D8]">
            <CheckCircle
              size={20}
              className="text-[#D89A3C]"
            />

            <span>
              Monatliches Abo abgeschlossen
            </span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#D89A3C] px-8 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
        >
          Zum Dashboard
          <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}