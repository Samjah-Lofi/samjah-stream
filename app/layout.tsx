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
  title: "Samjah Music | Hintergrundmusik für deine Location",
  description:
    "Professionelle Hintergrundmusik und Atmosphären für Cafés, Restaurants, Hotels, Bars und Lounges.",
  metadataBase: new URL("https://samjah-music.com"),
  openGraph: {
    title: "Samjah Music | Hintergrundmusik für deine Location",
    description:
      "Professionelle Hintergrundmusik und Atmosphären für Cafés, Restaurants, Hotels, Bars und Lounges.",
    url: "https://samjah-music.com",
    siteName: "Samjah Music",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samjah Music",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samjah Music | Hintergrundmusik für deine Location",
    description:
      "Professionelle Hintergrundmusik und Atmosphären für Cafés, Restaurants, Hotels, Bars und Lounges.",
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