"use client";

import Link from "next/link";

import HeroPlayer from "./HeroPlayer";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Hintergrundbild */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/landing/hero.png')",
        }}
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-black/55" />

      {/* Linke Seite dunkler */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0908] via-[#0B0908]/75 to-transparent" />

      {/* Verlauf nach unten */}

      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#0B0908] to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-20 px-8">

        {/* Linke Seite */}

        <div className="max-w-3xl">

          <span className="rounded-full border border-[#D89A3C]/30 bg-[#D89A3C]/10 px-6 py-3 text-sm font-semibold tracking-[0.35em] text-[#D89A3C] backdrop-blur">
            MUSIC FOR BUSINESSES
          </span>

          <h1 className="mt-10 text-6xl font-black leading-[0.9] text-[#F5E9D8] md:text-7xl xl:text-[7rem]">

            Die passende
            <br />
            Musik für
            <br />
            dein Business.

          </h1>

          <p className="mt-10 max-w-2xl text-xl leading-10 text-[#D6C6B4]">

            Professionelle LoFi und Afro LoFi Musik
            für Cafés, Restaurants, Hotels und moderne
            Arbeitsplätze.

            <br />
            <br />

            Werbefrei. Rund um die Uhr.
            Ein Abo. 20 € pro Monat.

          </p>

          <div className="mt-14 flex flex-wrap gap-6">

            <Link
              href="/dashboard"
              className="rounded-2xl bg-[#D89A3C] px-10 py-5 text-lg font-bold text-[#120D09] transition-all duration-300 hover:scale-105 hover:bg-[#E9B65A]"
            >
              Musik entdecken
            </Link>

            <Link
              href="#pricing"
              className="rounded-2xl border border-[#D89A3C]/30 bg-[#171311]/60 px-10 py-5 text-lg font-semibold text-[#F5E9D8] backdrop-blur transition-all duration-300 hover:border-[#D89A3C] hover:bg-[#171311]/80"
            >
              20 € / Monat
            </Link>

          </div>

        </div>

        {/* Rechte Seite */}

        <div className="hidden xl:flex xl:justify-end">

          <HeroPlayer />

        </div>

      </div>

    </section>
  );
}