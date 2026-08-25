"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess(false);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Bitte gib deinen Namen ein.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Das Passwort muss mindestens 6 Zeichen lang sein."
      );
      return;
    }

    if (password !== passwordRepeat) {
      setError(
        "Die Passwörter stimmen nicht überein."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: registerError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
            },
          },
        });

      if (registerError) {
        setError(registerError.message);
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "Registrierung Fehler:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Bei der Registrierung ist ein unbekannter Fehler aufgetreten."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0908] px-6 py-12 text-[#F5E9D8]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight text-[#F5E9D8]"
          >
            SAMJAH
          </Link>

          <p className="mt-3 text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            Crafted Soundscapes
          </p>
        </div>

        <div className="rounded-[32px] border border-[#3A2B22] bg-[#171311] p-8 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
          {!success ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black">
                  Konto erstellen
                </h1>

                <p className="mt-3 leading-7 text-[#BFAE98]">
                  Erstelle dein Samjah Konto und entdecke
                  unsere Musikwelten.
                </p>
              </div>

              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#D6C6B4]"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                    autoComplete="name"
                    placeholder="Dein Name"
                    className="w-full rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] px-5 py-4 text-[#F5E9D8] outline-none transition placeholder:text-[#6F6257] focus:border-[#D89A3C]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#D6C6B4]"
                  >
                    E-Mail
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    autoComplete="email"
                    placeholder="deine@email.de"
                    className="w-full rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] px-5 py-4 text-[#F5E9D8] outline-none transition placeholder:text-[#6F6257] focus:border-[#D89A3C]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#D6C6B4]"
                  >
                    Passwort
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    autoComplete="new-password"
                    placeholder="Mindestens 6 Zeichen"
                    className="w-full rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] px-5 py-4 text-[#F5E9D8] outline-none transition placeholder:text-[#6F6257] focus:border-[#D89A3C]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passwordRepeat"
                    className="mb-2 block text-sm font-semibold text-[#D6C6B4]"
                  >
                    Passwort wiederholen
                  </label>

                  <input
                    id="passwordRepeat"
                    type="password"
                    value={passwordRepeat}
                    onChange={(event) =>
                      setPasswordRepeat(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="new-password"
                    placeholder="Passwort wiederholen"
                    className="w-full rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] px-5 py-4 text-[#F5E9D8] outline-none transition placeholder:text-[#6F6257] focus:border-[#D89A3C]"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm leading-6 text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#D89A3C] px-6 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Konto wird erstellt..."
                    : "Konto erstellen"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#2A201A]" />

                <span className="text-sm text-[#6F6257]">
                  oder
                </span>

                <div className="h-px flex-1 bg-[#2A201A]" />
              </div>

              <p className="text-center text-[#BFAE98]">
                Du hast bereits ein Konto?

                <Link
                  href="/login"
                  className="ml-2 font-semibold text-[#D89A3C] transition hover:text-[#E9B65A]"
                >
                  Anmelden
                </Link>
              </p>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D89A3C]/15 text-3xl text-[#D89A3C]">
                ✓
              </div>

              <h1 className="mt-6 text-3xl font-black">
                Fast geschafft
              </h1>

              <p className="mt-4 leading-7 text-[#BFAE98]">
                Wir haben dir eine E-Mail geschickt.
                Bestätige deine E-Mail-Adresse, um dein
                Konto zu aktivieren.
              </p>

              <Link
                href="/login"
                className="mt-8 inline-flex rounded-2xl bg-[#D89A3C] px-8 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
              >
                Zum Login
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs leading-6 text-[#6F6257]">
          <p>
            <a
              href="https://samjah-music.com/impressum/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8D7B68] hover:text-[#D89A3C]"
            >
              Impressum
            </a>

            <span className="mx-2">|</span>

            <a
              href="https://samjah-music.com/datenschutzerklaerung/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8D7B68] hover:text-[#D89A3C]"
            >
              Datenschutzerklärung
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}