import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Der Abschluss eines Premium-Abonnements ist derzeit vorübergehend deaktiviert.",
    },
    {
      status: 503,
    }
  );
}