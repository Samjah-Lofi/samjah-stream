"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  Music2,
  Heart,
  User,
  Settings,
} from "lucide-react";

import Logo from "./ui/Logo";

const links = [
  {
    href: "/dashboard",
    icon: House,
    text: "Home",
  },
  {
    href: "/dashboard/atmosphaeren",
    icon: Music2,
    text: "Atmosphären",
  },
  {
    href: "/dashboard/favoriten",
    icon: Heart,
    text: "Favoriten",
  },
  {
    href: "/dashboard/konto",
    icon: User,
    text: "Konto",
  },
  {
    href: "/dashboard/einstellungen",
    icon: Settings,
    text: "Einstellungen",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-[#3A2B22] bg-[#0B0908]">

      <div className="border-b border-[#3A2B22] p-8">
        <Logo />
      </div>

      <nav className="flex-1 space-y-3 p-6">

        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(link.href));

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                active
                  ? "border border-[#D89A3C]/30 bg-[#211A17] text-[#F5E9D8] shadow-[0_0_25px_rgba(216,154,60,.08)]"
                  : "text-[#BFAE98] hover:bg-[#171311] hover:text-[#F5E9D8]"
              }`}
            >
              <Icon
                size={21}
                strokeWidth={2.2}
                className={`transition ${
                  active
                    ? "text-[#D89A3C]"
                    : "text-[#8D7B68] group-hover:text-[#D89A3C]"
                }`}
              />

              <span className="font-medium tracking-wide">
                {link.text}
              </span>
            </Link>
          );
        })}

      </nav>

      <div className="border-t border-[#3A2B22] p-6">

        <div className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D89A3C]/30 bg-[#211A17]">
              <span className="text-lg font-bold text-[#D89A3C]">
                S
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-[#F5E9D8]">
                Samjah
              </h3>

              <p className="text-sm text-[#BFAE98]">
                Crafted Soundscapes
              </p>
            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}