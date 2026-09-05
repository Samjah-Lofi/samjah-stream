"use client";

import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

type LicenseDocument = {
  id: string;
  document_number: string;
  valid_from: string;
  valid_until: string | null;
  status: "active" | "expired" | "cancelled";
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Unbefristet";
  }

  return new Date(value).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DokumentePage() {
  const [licenseDocument, setLicenseDocument] =
    useState<LicenseDocument | null>(null);

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(
          "/api/documents?format=json",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Der Nutzungsnachweis konnte nicht geladen werden."
          );
        }

        setLicenseDocument(data as LicenseDocument);
      } catch (loadError) {
        console.error(
          "DOKUMENTE SEITE FEHLER:",
          loadError
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Der Nutzungsnachweis konnte nicht geladen werden."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, []);

  const handleDownload = async () => {
    if (downloading) {
      return;
    }

    setDownloading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/documents",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        let message =
          "Der Nutzungsnachweis konnte nicht erstellt werden.";

        try {
          const data = await response.json();

          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Die Standardfehlermeldung bleibt bestehen.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = url;

      const documentNumber =
        licenseDocument?.document_number ||
        "Nutzungsnachweis";

      link.download =
        `Samjah-Nutzungsnachweis-${documentNumber}.pdf`;

      window.document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error(
        "NUTZUNGSNACHWEIS DOWNLOAD FEHLER:",
        downloadError
      );

      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Der Nutzungsnachweis konnte nicht erstellt werden."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pb-40">
        <section className="px-12 pt-12">
          <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            Deine Dokumente
          </p>

          <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
            Dokumente
          </h1>

          <div className="mt-12 flex items-center gap-3 text-[#BFAE98]">
            <Loader2
              size={20}
              className="animate-spin text-[#D89A3C]"
            />

            <span>
              Nutzungsnachweis wird geladen...
            </span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40">
      <section className="px-12 pt-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Deine Dokumente
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Dokumente
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Hier findest du deinen aktuellen
          Nutzungsnachweis für die Samjah Music
          Library.
        </p>
      </section>

      <section className="mt-12 px-12">
        <div className="rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D89A3C]/30 bg-[#211A17]">
                <FileText
                  size={25}
                  className="text-[#D89A3C]"
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#8D7B68]">
                  Nutzungsnachweis
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#F5E9D8]">
                  Samjah Music Library
                </h2>

                <p className="mt-2 max-w-xl leading-7 text-[#BFAE98]">
                  Der Nachweis bestätigt deinen
                  aktuellen Nutzungszugang zur Samjah
                  Music Library im Rahmen deines
                  Premium-Abonnements.
                </p>
              </div>
            </div>

            {licenseDocument?.status === "active" && (
              <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#D89A3C]/25 bg-[#211A17] px-4 py-2 text-sm font-semibold text-[#D89A3C]">
                <CheckCircle2 size={17} />
                Aktiv
              </div>
            )}
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-900/40 bg-red-950/20 p-5 text-sm leading-6 text-red-300">
              {error}
            </div>
          )}

          {licenseDocument ? (
            <>
              <div className="mt-10 grid gap-4 border-t border-[#3A2B22] pt-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
                  <p className="text-sm text-[#8D7B68]">
                    Dokumentnummer
                  </p>

                  <p className="mt-2 font-semibold text-[#F5E9D8]">
                    {licenseDocument.document_number}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
                  <p className="text-sm text-[#8D7B68]">
                    Gültig von
                  </p>

                  <p className="mt-2 font-semibold text-[#F5E9D8]">
                    {formatDate(
                      licenseDocument.valid_from
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
                  <p className="text-sm text-[#8D7B68]">
                    Gültig bis
                  </p>

                  <p className="mt-2 font-semibold text-[#F5E9D8]">
                    {formatDate(
                      licenseDocument.valid_until
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
                  <p className="text-sm text-[#8D7B68]">
                    Status
                  </p>

                  <p
                    className={`mt-2 font-semibold ${
                      licenseDocument.status === "active"
                        ? "text-[#D89A3C]"
                        : "text-[#F5E9D8]"
                    }`}
                  >
                    {licenseDocument.status === "active"
                      ? "Aktiv"
                      : licenseDocument.status === "expired"
                        ? "Abgelaufen"
                        : "Storniert"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-[#D89A3C]"
                  />

                  <div>
                    <p className="font-semibold text-[#F5E9D8]">
                      Digital verifizierbarer Nachweis
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#BFAE98]">
                      Der PDF-Nachweis enthält einen
                      QR-Code, über den die Echtheit des
                      Dokuments online geprüft werden kann.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#D89A3C] px-6 py-4 font-semibold text-[#0F0C0A] transition hover:bg-[#E7AD55] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      PDF wird erstellt...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      PDF herunterladen
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
              <p className="font-semibold text-[#F5E9D8]">
                Kein Nutzungsnachweis verfügbar
              </p>

              <p className="mt-2 text-sm leading-6 text-[#BFAE98]">
                Für deinen aktuellen Zugang konnte kein
                Nutzungsnachweis erstellt werden.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
