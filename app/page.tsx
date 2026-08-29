import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Headphones,
  Hotel,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const STREAM_URL = "https://samjah-stream.vercel.app";

const atmospheres = [
  {
    title: "Coffee Morning",
    description: "Warme LoFi Klänge für einen entspannten Start in den Tag.",
    image: "/covers/coffee-morning.png",
  },
  {
    title: "Lunch Lounge",
    description: "Sanfte Lounge Sounds für stilvolle Mittagspausen und Gespräche.",
    image: "/covers/lunch-lounge.png",
  },
  {
    title: "Afro Lounge",
    description: "Warme Afro Grooves mit entspannter Lounge Atmosphäre.",
    image: "/covers/afro-lounge.png",
  },
  {
    title: "Sunset Lounge",
    description: "Goldene Abendstimmung für Bars, Rooftops und Terrassen.",
    image: "/covers/sunset-lounge.png",
  },
  {
    title: "Late Night",
    description: "Elegante Jazz und LoFi Sounds für lange Abende.",
    image: "/covers/late-night.png",
  },
  {
    title: "Rainy Day",
    description: "Ruhige Klänge für gemütliche Cafés und entspannte Räume.",
    image: "/covers/rainy-day.png",
  },
];

const locations = [
  {
    title: "Cafés",
    description: "Warme Atmosphären für Kaffee, Frühstück und gute Gespräche.",
    icon: Store,
  },
  {
    title: "Restaurants",
    description:
      "Stilvolle Musik, die dein Essen begleitet, ohne Gespräche zu überdecken.",
    icon: UtensilsCrossed,
  },
  {
    title: "Hotels",
    description:
      "Hochwertige Soundscapes für Lobby, Bar, Lounge und Empfang.",
    icon: Hotel,
  },
  {
    title: "Lounges & Bars",
    description:
      "Entspannte Grooves für Abendstimmung, Drinks und besondere Momente.",
    icon: Headphones,
  },
];

const benefits = [
  "Professionelle Hintergrundmusik",
  "Verschiedene Atmosphären für unterschiedliche Tageszeiten",
  "Unbegrenztes Anhören",
  "Für Cafés, Restaurants, Hotels und Lounges",
  "Neue Atmosphären werden laufend ergänzt",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0908] text-[#F5E9D8]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0908]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="text-xl font-black tracking-[0.18em] text-[#F5E9D8]"
          >
            SAMJAH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#atmosphaeren"
              className="text-sm text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Atmosphären
            </a>

            <a
              href="#locations"
              className="text-sm text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Für Locations
            </a>

            <a
              href="#premium"
              className="text-sm text-[#BFAE98] transition hover:text-[#F5E9D8]"
            >
              Premium
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={`${STREAM_URL}/login`}
              className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#BFAE98] transition hover:text-[#F5E9D8] sm:block"
            >
              Anmelden
            </Link>

            <Link
              href={`${STREAM_URL}/register`}
              className="rounded-full bg-[#D89A3C] px-5 py-2.5 text-sm font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
            >
              Stream starten
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen">
        <Image
          src="/images/landing/hero.png"
          alt="Samjah Music"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0908] via-[#0B0908]/75 to-[#0B0908]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-[#0B0908]/30" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#D89A3C]">
              Samjah Music
            </p>

            <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">
              Hintergrundmusik
              <span className="block text-[#D89A3C]">
                für deine Location.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#D6C6B4] sm:text-xl">
              Professionelle Atmosphären für Cafés, Restaurants, Hotels, Bars
              und Lounges. Entspannt, stilvoll und gemacht, um Räume
              musikalisch zu begleiten.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`${STREAM_URL}/register`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D89A3C] px-7 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
              >
                Samjah Stream entdecken
                <ArrowRight size={19} />
              </Link>

              <a
                href="#atmosphaeren"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/20 px-7 py-4 font-semibold text-[#F5E9D8] backdrop-blur-sm transition hover:border-[#D89A3C]/50 hover:bg-white/5"
              >
                Atmosphären ansehen
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#BFAE98]">
              <span>GEMA freie Musik</span>
              <span>Professionelle Nutzung</span>
              <span>19,90 € / Monat</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#3A2B22] bg-[#0F0C0A] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D89A3C]">
            Musik, die sich einfügt
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Deine Location steht im Mittelpunkt.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#BFAE98]">
            Gute Hintergrundmusik drängt sich nicht auf. Sie schafft
            Atmosphäre, unterstützt die Stimmung und lässt deinen Gästen Raum
            für Gespräche, Essen und besondere Momente.
          </p>
        </div>
      </section>

      <section
        id="atmosphaeren"
        className="scroll-mt-20 px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D89A3C]">
                Samjah Atmosphären
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Für jeden Moment der passende Sound.
              </h2>
            </div>

            <Link
              href={`${STREAM_URL}/register`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D89A3C] transition hover:text-[#E9B65A]"
            >
              Alle Atmosphären entdecken
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {atmospheres.map((atmosphere) => (
              <Link
                key={atmosphere.title}
                href={`${STREAM_URL}/register`}
                className="group overflow-hidden rounded-[28px] border border-[#3A2B22] bg-[#171311] transition duration-300 hover:-translate-y-1 hover:border-[#D89A3C]/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={atmosphere.image}
                    alt={atmosphere.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-2xl font-bold">
                      {atmosphere.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="leading-7 text-[#BFAE98]">
                    {atmosphere.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="locations"
        className="scroll-mt-20 border-y border-[#3A2B22] bg-[#171311] px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D89A3C]">
              Für deine Location
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Musik für Räume, in denen Menschen bleiben.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#BFAE98]">
              Egal ob Kaffee am Morgen, Mittagessen mit Freunden oder ein
              langer Abend an der Bar. Samjah passt sich der Stimmung deiner
              Location an.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => {
              const Icon = location.icon;

              return (
                <div
                  key={location.title}
                  className="rounded-[26px] border border-[#3A2B22] bg-[#0F0C0A] p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D89A3C]/10">
                    <Icon size={23} className="text-[#D89A3C]" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {location.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8D7B68]">
                    {location.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="premium"
        className="scroll-mt-20 px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-[#D89A3C]/30 bg-[#211A17] p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D89A3C]">
                Samjah Stream
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Deine Musik.
                <span className="block text-[#D89A3C]">
                  Deine Atmosphäre.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#BFAE98]">
                Mit Samjah Stream bekommst du den kompletten Samjah Katalog an
                einem Ort. Wähle deine Atmosphäre und lass die Musik deine
                Location begleiten.
              </p>

              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-[#D6C6B4]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D89A3C]/15">
                      <Check size={14} className="text-[#D89A3C]" />
                    </span>

                    {benefit}
                  </li>
                ))}
              </ul>

              <Link
                href={`${STREAM_URL}/register`}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#D89A3C] px-7 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
              >
                Stream starten
                <ArrowRight size={19} />
              </Link>
            </div>

            <div className="lg:min-w-56 lg:text-right">
              <div className="text-sm uppercase tracking-[0.2em] text-[#8D7B68]">
                Premium
              </div>

              <div className="mt-2 text-5xl font-black text-[#F5E9D8]">
                19,90 €
              </div>

              <div className="mt-2 text-[#8D7B68]">
                pro Monat
              </div>

              <p className="mt-5 text-sm text-[#6F6257]">
                Jederzeit kündbar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#3A2B22] bg-[#0B0908] px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-black tracking-[0.18em]">
              SAMJAH
            </div>

            <p className="mt-2 text-sm text-[#6F6257]">
              Crafted Soundscapes for real spaces.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#8D7B68]">
            <a
              href="#atmosphaeren"
              className="transition hover:text-[#D89A3C]"
            >
              Atmosphären
            </a>

            <a
              href="#locations"
              className="transition hover:text-[#D89A3C]"
            >
              Für Locations
            </a>

            <a
              href="#premium"
              className="transition hover:text-[#D89A3C]"
            >
              Premium
            </a>

            <Link
              href={`${STREAM_URL}/login`}
              className="transition hover:text-[#D89A3C]"
            >
              Login
            </Link>

            <a
              href="https://samjah-music.com/impressum/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#D89A3C]"
            >
              Impressum
            </a>

            <a
              href="https://samjah-music.com/datenschutzerklaerung/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#D89A3C]"
            >
              Datenschutz
            </a>

            <a
              href="https://samjah-music.com/agb/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#D89A3C]"
            >
              AGB
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#3A2B22] pt-6 text-xs text-[#5F5349]">
          © {new Date().getFullYear()} Samjah Music. Alle Rechte vorbehalten.
        </div>
      </footer>
    </main>
  );
}