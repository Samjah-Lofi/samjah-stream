import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

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
  title: {
    default: "Samjah Stream | Hintergrundmusik für Locations",
    template: "%s | Samjah Stream",
  },

  description:
    "Professionelle Hintergrundmusik für Cafés, Restaurants, Hotels und andere Locations. Entspannte Atmosphären von Samjah Stream.",

  applicationName: "Samjah Stream",

  keywords: [
    "Hintergrundmusik",
    "Musik für Cafés",
    "Musik für Restaurants",
    "Musik für Hotels",
    "Lounge Musik",
    "LoFi",
    "Samjah Stream",
  ],

  authors: [
    {
      name: "Samjah",
    },
  ],

  creator: "Samjah",

  metadataBase: new URL(
    "https://samjah-stream.vercel.app"
  ),

  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Samjah Stream",
    title:
      "Samjah Stream | Hintergrundmusik für Locations",
    description:
      "Professionelle Hintergrundmusik für Cafés, Restaurants, Hotels und andere Locations.",
    url: "https://samjah-stream.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samjah Stream | Hintergrundmusik für Locations",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Samjah Stream | Hintergrundmusik für Locations",
    description:
      "Professionelle Hintergrundmusik für Cafés, Restaurants, Hotels und andere Locations.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}