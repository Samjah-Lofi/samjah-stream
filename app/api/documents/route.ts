import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Subscription = {
  plan: "free" | "premium";
  status: "active" | "cancelled" | "canceled" | "expired" | "past_due";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
};

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

function getDocumentNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `SMJ-N-${year}-${randomPart}`;
}

async function getOrCreateLicenseDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<
  | {
      document: LicenseDocument;
      error: null;
    }
  | {
      document: null;
      error: NextResponse;
    }
> {
  const {
    data: subscriptionData,
    error: subscriptionError,
  } = await supabase
    .from("subscriptions")
    .select(
      "plan, status, current_period_start, current_period_end, cancel_at, canceled_at"
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (subscriptionError) {
    console.error(
      "ABO DATEN KONNTEN NICHT GELADEN WERDEN:",
      subscriptionError
    );

    return {
      document: null,
      error: NextResponse.json(
        {
          error: "Abo-Daten konnten nicht geladen werden.",
        },
        { status: 500 }
      ),
    };
  }

  const subscription =
    subscriptionData as Subscription | null;

  const hasActiveSubscription =
    subscription?.plan === "premium" &&
    subscription?.status === "active";

  if (!hasActiveSubscription) {
    return {
      document: null,
      error: NextResponse.json(
        {
          error:
            "Ein Nutzungsnachweis ist nur bei einem aktiven Premium-Abo verfügbar.",
        },
        { status: 403 }
      ),
    };
  }

  if (!subscription.current_period_start) {
    return {
      document: null,
      error: NextResponse.json(
        {
          error:
            "Für das aktuelle Abo ist noch kein Startdatum verfügbar.",
        },
        { status: 409 }
      ),
    };
  }

  const validFrom = subscription.current_period_start;

  const validUntil =
    subscription.cancel_at ||
    subscription.current_period_end ||
    null;

  const calculatedStatus =
    validUntil &&
    new Date(validUntil).getTime() < Date.now()
      ? "expired"
      : "active";

  const {
    data: documentData,
    error: documentError,
  } = await supabase
    .from("license_documents")
    .select(
      "id, document_number, valid_from, valid_until, status"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (documentError) {
    console.error(
      "NUTZUNGSDOKUMENT KONNTE NICHT GELADEN WERDEN:",
      documentError
    );

    return {
      document: null,
      error: NextResponse.json(
        {
          error:
            "Nutzungsdokument konnte nicht geladen werden.",
        },
        { status: 500 }
      ),
    };
  }

  let document =
    documentData as LicenseDocument | null;

  if (!document) {
    const {
      data: createdDocument,
      error: createError,
    } = await supabase
      .from("license_documents")
      .insert({
        document_number: getDocumentNumber(),
        user_id: userId,
        valid_from: validFrom,
        valid_until: validUntil,
        status: calculatedStatus,
      })
      .select(
        "id, document_number, valid_from, valid_until, status"
      )
      .single();

    if (createError) {
      console.error(
        "NUTZUNGSDOKUMENT KONNTE NICHT ERSTELLT WERDEN:",
        createError
      );

      return {
        document: null,
        error: NextResponse.json(
          {
            error:
              "Nutzungsdokument konnte nicht erstellt werden.",
          },
          { status: 500 }
        ),
      };
    }

    document = createdDocument as LicenseDocument;
  } else {
    const needsUpdate =
      document.valid_from !== validFrom ||
      document.valid_until !== validUntil ||
      document.status !== calculatedStatus;

    if (needsUpdate) {
      const {
        data: updatedDocument,
        error: updateError,
      } = await supabase
        .from("license_documents")
        .update({
          valid_from: validFrom,
          valid_until: validUntil,
          status: calculatedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", document.id)
        .eq("user_id", userId)
        .select(
          "id, document_number, valid_from, valid_until, status"
        )
        .single();

      if (updateError) {
        console.error(
          "NUTZUNGSDOKUMENT KONNTE NICHT AKTUALISIERT WERDEN:",
          updateError
        );

        return {
          document: null,
          error: NextResponse.json(
            {
              error:
                "Nutzungsdokument konnte nicht aktualisiert werden.",
            },
            { status: 500 }
          ),
        };
      }

      document =
        updatedDocument as LicenseDocument;
    }
  }

  return {
    document,
    error: null,
  };
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("AUTH FEHLER:", userError);

      return NextResponse.json(
        {
          error:
            "Authentifizierung konnte nicht geprüft werden.",
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "Nicht angemeldet.",
        },
        { status: 401 }
      );
    }

    const requestUrl = new URL(request.url);
    const format = requestUrl.searchParams.get("format");

    const result =
      await getOrCreateLicenseDocument(
        supabase,
        user.id
      );

    if (result.error) {
      return result.error;
    }

    const document = result.document;

    if (format === "json") {
      return NextResponse.json({
        id: document.id,
        document_number: document.document_number,
        valid_from: document.valid_from,
        valid_until: document.valid_until,
        status: document.status,
      });
    }

    const verificationUrl =
      `${requestUrl.origin}/verify/${document.id}`;

    const qrDataUrl =
      await QRCode.toDataURL(
        verificationUrl,
        {
          type: "image/png",
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        }
      );

    const base64Qr =
      qrDataUrl.replace(
        /^data:image\/png;base64,/,
        ""
      );

    const qrBytes =
      Buffer.from(base64Qr, "base64");

    const pdfDoc =
      await PDFDocument.create();

    const page =
      pdfDoc.addPage([595.28, 841.89]);

    const regularFont =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const backgroundColor =
      rgb(0.059, 0.047, 0.039);

    const cardColor =
      rgb(0.09, 0.075, 0.067);

    const textColor =
      rgb(0.96, 0.914, 0.847);

    const mutedColor =
      rgb(0.75, 0.682, 0.596);

    const accentColor =
      rgb(0.847, 0.604, 0.235);

    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: backgroundColor,
    });

    page.drawText("SAMJAH MUSIC", {
      x: 55,
      y: 770,
      size: 22,
      font: boldFont,
      color: accentColor,
    });

    page.drawText(
      "Nutzungsnachweis",
      {
        x: 55,
        y: 720,
        size: 30,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Nachweis über den bestehenden Nutzungszugang",
      {
        x: 55,
        y: 690,
        size: 12,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawRectangle({
      x: 45,
      y: 425,
      width: 505,
      height: 215,
      color: cardColor,
    });

    page.drawText("Kunde", {
      x: 70,
      y: 600,
      size: 10,
      font: regularFont,
      color: mutedColor,
    });

    page.drawText(
      user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Samjah Music Kunde",
      {
        x: 70,
        y: 578,
        size: 16,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText("E-Mail", {
      x: 70,
      y: 548,
      size: 10,
      font: regularFont,
      color: mutedColor,
    });

    page.drawText(
      user.email || "",
      {
        x: 70,
        y: 528,
        size: 12,
        font: regularFont,
        color: textColor,
      }
    );

    page.drawText(
      "Dokumentnummer",
      {
        x: 70,
        y: 495,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      document.document_number,
      {
        x: 70,
        y: 475,
        size: 12,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Gültig von",
      {
        x: 330,
        y: 600,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      formatDate(document.valid_from),
      {
        x: 330,
        y: 578,
        size: 14,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Gültig bis",
      {
        x: 330,
        y: 548,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      formatDate(document.valid_until),
      {
        x: 330,
        y: 528,
        size: 14,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Status",
      {
        x: 330,
        y: 495,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      document.status === "active"
        ? "Aktiv"
        : document.status === "expired"
          ? "Abgelaufen"
          : "Storniert",
      {
        x: 330,
        y: 475,
        size: 14,
        font: boldFont,
        color:
          document.status === "active"
            ? accentColor
            : textColor,
      }
    );

    page.drawText(
      "Nutzungsberechtigung",
      {
        x: 55,
        y: 375,
        size: 16,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Dieser Nachweis bestätigt den bestehenden Zugang",
      {
        x: 55,
        y: 347,
        size: 11,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      "des oben genannten Kunden zur Samjah Music Library",
      {
        x: 55,
        y: 329,
        size: 11,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      "im Rahmen des gebuchten Premium-Abonnements.",
      {
        x: 55,
        y: 311,
        size: 11,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      "Der Nachweis stellt keine behördliche oder sonstige",
      {
        x: 55,
        y: 276,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      "Lizenzbestätigung Dritter dar.",
      {
        x: 55,
        y: 260,
        size: 10,
        font: regularFont,
        color: mutedColor,
      }
    );

    const qrImage =
      await pdfDoc.embedPng(qrBytes);

    page.drawImage(qrImage, {
      x: 405,
      y: 80,
      width: 115,
      height: 115,
    });

    page.drawText(
      "Dokument online prüfen",
      {
        x: 405,
        y: 62,
        size: 9,
        font: regularFont,
        color: mutedColor,
      }
    );

    page.drawText(
      "Samjah Music",
      {
        x: 55,
        y: 100,
        size: 11,
        font: boldFont,
        color: textColor,
      }
    );

    page.drawText(
      "Dieser Nachweis wurde digital erstellt.",
      {
        x: 55,
        y: 82,
        size: 9,
        font: regularFont,
        color: mutedColor,
      }
    );

    const pdfBytes =
      await pdfDoc.save();

    return new NextResponse(
      Buffer.from(pdfBytes),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/pdf",
          "Content-Disposition":
            `attachment; filename="Samjah-Nutzungsnachweis-${document.document_number}.pdf"`,
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "NUTZUNGSNACHWEIS FEHLER:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Der Nutzungsnachweis konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}