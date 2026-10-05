
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.samjah-music.com"),

  title: "GEMA-freie Hintergrundmusik für Gastronomie | Samjah Music",

  description:
    "Entdecke selbst produzierte Hintergrundmusik für Cafés, Restaurants, Bars und Hotels. Sechs Atmosphären für 19,90 € im Monat. Jetzt 30 Sekunden reinhören.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "GEMA-freie Hintergrundmusik für Gastronomie | Samjah Music",
    description:
      "Selbst produzierte Hintergrundmusik für Cafés, Restaurants, Bars und Hotels. Entdecke sechs Atmosphären für 19,90 € im Monat.",
    url: "https://www.samjah-music.com/",
    siteName: "Samjah Music",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samjah Music – Hintergrundmusik für Gastronomie",
      },
    ],
    locale: "de_DE",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GEMA-freie Hintergrundmusik für Gastronomie | Samjah Music",
    description:
      "Selbst produzierte Hintergrundmusik für Cafés, Restaurants, Bars und Hotels. Sechs Atmosphären für 19,90 € im Monat.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
