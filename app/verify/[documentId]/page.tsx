import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function formatDate(
  value: string | null
): string {
  if (!value) {
    return "Unbefristet";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Berlin",
    }
  ).format(new Date(value));
}

export default async function VerifyDocumentPage({
  params,
}: PageProps) {
  const { documentId } = await params;

  const { data: document, error } =
    await supabaseAdmin
      .from("license_documents")
      .select(
        "id, document_number, valid_from, valid_until, status"
      )
      .eq("id", documentId)
      .maybeSingle();

  if (error) {
    console.error(
      "DOKUMENT VERIFIZIERUNG FEHLER:",
      error
    );

    notFound();
  }

  if (!document) {
    notFound();
  }

  const now = new Date();

  const validUntil = document.valid_until
    ? new Date(document.valid_until)
    : null;

  const isActive =
    document.status === "active" &&
    (!validUntil || validUntil >= now);

  const statusLabel = isActive
    ? "Aktiv"
    : document.status === "cancelled"
      ? "Storniert"
      : "Abgelaufen";

  return (
    <main className="min-h-screen bg-[#0B0908] px-6 py-16 text-[#F5E9D8]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight"
          >
            SAMJAH
          </Link>

          <p className="mt-3 text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            Music Library
          </p>
        </div>

        <section className="rounded-[32px] border border-[#3A2B22] bg-[#171311] p-8 shadow-[0_30px_80px_rgba(0,0,0,.35)] md:p-12">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6B4A20] bg-[#211A15] text-[#D89A3C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3 4.5 6v5.25c0 4.73 3.18 8.94 7.5 10.25 4.32-1.31 7.5-5.52 7.5-10.25V6L12 3Z"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#BFAE98]">
              Dokumentenprüfung
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Nutzungsnachweis
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#BFAE98]">
              Dieser Nachweis wurde über das
              offizielle Samjah Music
              Verifizierungssystem geprüft.
            </p>
          </div>

          <div
            className={`mb-8 rounded-2xl border px-6 py-5 ${
              isActive
                ? "border-[#6B4A20] bg-[#211A15]"
                : "border-red-900/50 bg-red-950/20"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8D7B68]">
                  Status
                </p>

                <p
                  className={`mt-2 text-2xl font-black ${
                    isActive
                      ? "text-[#D89A3C]"
                      : "text-red-300"
                  }`}
                >
                  {statusLabel}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                  isActive
                    ? "border-[#6B4A20] text-[#D89A3C]"
                    : "border-red-900/50 text-red-300"
                }`}
              >
                {isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6l12 12M18 6 6 18"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
              <p className="text-sm text-[#8D7B68]">
                Dokumentnummer
              </p>

              <p className="mt-2 break-all text-lg font-bold text-[#F5E9D8]">
                {document.document_number}
              </p>
            </div>

            <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
              <p className="text-sm text-[#8D7B68]">
                Gültig von
              </p>

              <p className="mt-2 text-lg font-bold text-[#F5E9D8]">
                {formatDate(document.valid_from)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
              <p className="text-sm text-[#8D7B68]">
                Gültig bis
              </p>

              <p className="mt-2 text-lg font-bold text-[#F5E9D8]">
                {formatDate(document.valid_until)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
              <p className="text-sm text-[#8D7B68]">
                Anbieter
              </p>

              <p className="mt-2 text-lg font-bold text-[#F5E9D8]">
                Samjah Music
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">
            <h2 className="text-lg font-bold">
              Samjah Music Library
            </h2>

            <p className="mt-3 leading-7 text-[#BFAE98]">
              Der geprüfte Nachweis bestätigt einen
              Nutzungszugang zur Samjah Music Library
              im Rahmen des jeweiligen Premium
              Abonnements.
            </p>

            <p className="mt-4 text-sm leading-6 text-[#8D7B68]">
              Diese Seite bestätigt die Echtheit und
              den gespeicherten Status des
              Samjah Music Nutzungsdokuments. Sie
              stellt keine behördliche oder sonstige
              Lizenzbestätigung Dritter dar.
            </p>
          </div>

          <div className="mt-8 border-t border-[#3A2B22] pt-6 text-center">
            <p className="text-xs text-[#6F6257]">
              Digital verifiziertes Dokument
            </p>

            <p className="mt-2 text-xs text-[#6F6257]">
              Samjah Music
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
