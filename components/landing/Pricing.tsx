import Link from "next/link";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl px-8 py-28"
    >
      <div className="text-center">

        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Preis
        </p>

        <h2 className="mt-4 text-5xl font-black text-[#F5E9D8]">
          Ein Preis. Alles inklusive.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#BFAE98]">
          Keine verschiedenen Pakete. Keine versteckten Kosten.
          Einfach hochwertige Hintergrundmusik für dein Unternehmen.
        </p>

      </div>

      <div className="mx-auto mt-20 max-w-3xl rounded-[40px] border border-[#D89A3C]/30 bg-[#171311] p-12 shadow-[0_0_80px_rgba(216,154,60,.08)]">

        <div className="text-center">

          <span className="rounded-full border border-[#D89A3C]/30 bg-[#D89A3C]/10 px-5 py-2 text-sm font-semibold tracking-[0.25em] text-[#D89A3C]">
            SAMJAH
          </span>

          <div className="mt-10">

            <span className="text-7xl font-black text-[#F5E9D8]">
              20€
            </span>

            <span className="ml-2 text-2xl text-[#BFAE98]">
              / Monat
            </span>

          </div>

          <p className="mt-8 text-lg leading-8 text-[#BFAE98]">
            Zugriff auf alle Musikwelten.
            Neue Musik wird regelmäßig ergänzt.
          </p>

        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ Alle Musikwelten
          </div>

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ LoFi & Afro LoFi
          </div>

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ Werbefreie Wiedergabe
          </div>

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ Regelmäßig neue Musik
          </div>

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ Einfache Bedienung
          </div>

          <div className="rounded-2xl bg-[#211A17] p-5 text-[#F5E9D8]">
            ✓ Sofort verfügbar
          </div>

        </div>

        <div className="mt-14 text-center">

          <Link
            href="/dashboard"
            className="inline-flex rounded-2xl bg-[#D89A3C] px-10 py-5 text-lg font-bold text-[#120D09] transition hover:scale-105 hover:bg-[#E9B65A]"
          >
            Jetzt starten
          </Link>

        </div>

      </div>

    </section>
  );
}