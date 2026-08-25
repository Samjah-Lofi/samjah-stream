"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  House,
  Music2,
  Heart,
  User,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import Logo from "./ui/Logo";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Samjah");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Samjah";

      setUserName(name);
      setUserEmail(user.email || "");
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    setOpen(false);
    router.replace("/login");
    router.refresh();
  };

  const navigation = (
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
            onClick={() => setOpen(false)}
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
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3A2B22] bg-[#171311] text-[#F5E9D8] shadow-lg md:hidden"
        aria-label="Menü öffnen"
      >
        <Menu size={24} />
      </button>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-label="Menü schließen"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-72 flex-col border-r border-[#3A2B22] bg-[#0B0908] transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#3A2B22] p-8">
          <Logo />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#BFAE98] hover:bg-[#211A17] hover:text-[#F5E9D8] md:hidden"
            aria-label="Menü schließen"
          >
            <X size={22} />
          </button>
        </div>

        {navigation}

        <div className="border-t border-[#3A2B22] p-6">
          <div className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D89A3C]/30 bg-[#211A17]">
                <span className="text-lg font-bold text-[#D89A3C]">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-[#F5E9D8]">
                  {userName}
                </h3>

                <p className="truncate text-sm text-[#8D7B68]">
                  {userEmail}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#8D7B68] transition hover:bg-red-950/30 hover:text-red-300"
                aria-label="Abmelden"
                title="Abmelden"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}