"use client";

import Link from "next/link";

import Logo from "../ui/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2A201A] bg-[#0B0908]/80 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <Logo />

        <nav className="hidden items-center gap-10 text-[#BFAE98] md:flex">

          <a
            href="#features"
            className="transition hover:text-[#F5E9D8]"
          >
            Features
          </a>

          <a
            href="#atmospheres"
            className="transition hover:text-[#F5E9D8]"
          >
            Atmospheres
          </a>

          <a
            href="#pricing"
            className="transition hover:text-[#F5E9D8]"
          >
            Pricing
          </a>

          <a
            href="#faq"
            className="transition hover:text-[#F5E9D8]"
          >
            FAQ
          </a>

        </nav>

        <div className="flex items-center gap-4">

          <Link
            href="/dashboard"
            className="rounded-xl border border-[#3A2B22] px-5 py-2 text-[#F5E9D8] transition hover:border-[#D89A3C]"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl bg-[#D89A3C] px-5 py-2 font-semibold text-[#120D09] transition hover:bg-[#E9B65A]"
          >
            Kostenlos testen
          </Link>

        </div>

      </div>

    </header>
  );
}