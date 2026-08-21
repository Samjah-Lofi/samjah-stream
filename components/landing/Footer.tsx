import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2A201A] bg-[#090706]">

      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-20 md:grid-cols-4">

        <div>

          <h3 className="text-2xl font-black text-[#F5E9D8]">
            SAMJAH
          </h3>

          <p className="mt-5 leading-8 text-[#BFAE98]">
            LoFi und Afro LoFi Musik
            für Cafés, Restaurants,
            Hotels und moderne Arbeitsplätze.
          </p>

        </div>

        <div>

          <h4 className="font-bold text-[#F5E9D8]">
            Plattform
          </h4>

          <div className="mt-5 space-y-3">

            <Link
              href="/dashboard"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Dashboard
            </Link>

            <Link
              href="/atmosphaeren"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Musikwelten
            </Link>

            <Link
              href="/favoriten"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Favoriten
            </Link>

          </div>

        </div>

        <div>

          <h4 className="font-bold text-[#F5E9D8]">
            Unternehmen
          </h4>

          <div className="mt-5 space-y-3">

            <a
              href="#pricing"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Preis
            </a>

            <a
              href="#faq"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              FAQ
            </a>

          </div>

        </div>

        <div>

          <h4 className="font-bold text-[#F5E9D8]">
            Rechtliches
          </h4>

          <div className="mt-5 space-y-3">

            <Link
              href="/impressum"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Impressum
            </Link>

            <Link
              href="/datenschutz"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Datenschutz
            </Link>

            <Link
              href="/agb"
              className="block text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              AGB
            </Link>

          </div>

        </div>

      </div>

      <div className="border-t border-[#2A201A] py-8 text-center text-sm text-[#7F7266]">

        © {new Date().getFullYear()} Samjah. Alle Rechte vorbehalten.

      </div>

    </footer>
  );
}