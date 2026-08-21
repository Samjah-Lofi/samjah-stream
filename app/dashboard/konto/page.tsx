"use client";

import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type UserData = {
  email: string;
  name: string;
};

type Subscription = {
  plan: "free" | "premium";
  status: "active" | "cancelled" | "expired";
};

export default function KontoPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Samjah";

      setUser({
        email: user.email || "",
        name,
      });

      const {
        data: subscriptionData,
        error,
      } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "Abo konnte nicht geladen werden:",
          error
        );
      }

      if (subscriptionData) {
        setSubscription(subscriptionData);
      } else {
        setSubscription({
          plan: "free",
          status: "active",
        });
      }

      setLoading(false);
    };

    loadAccount();
  }, [router]);

  const handleManageSubscription = async () => {
    if (openingPortal) return;

    setOpeningPortal(true);

    try {
      const response = await fetch(
        "/api/stripe/create-portal-session",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Aboverwaltung konnte nicht geöffnet werden."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe hat keine Portal-URL zurückgegeben."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(
        "ABO VERWALTUNG FEHLER:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Aboverwaltung konnte nicht geöffnet werden."
      );

      setOpeningPortal(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-[#BFAE98]">
          Konto wird geladen...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const planName =
    subscription?.plan === "premium"
      ? "Premium"
      : "Free";

  const hasActiveSubscription =
    subscription?.status === "active";

  return (
    <main className="min-h-screen pb-40">
      <section className="px-12 pt-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Dein Profil
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Konto
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Verwalte dein Profil, deinen Zugang und dein
          Abonnement.
        </p>
      </section>

      <section className="mt-12 grid gap-8 px-12 xl:grid-cols-3">
        <div className="rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8 xl:col-span-2">
          <div className="flex items-center gap-5 border-b border-[#3A2B22] pb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D89A3C]/30 bg-[#211A17]">
              <span className="text-3xl font-bold text-[#D89A3C]">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#F5E9D8]">
                {user.name}
              </h2>

              <p className="mt-1 text-[#BFAE98]">
                Crafted Soundscapes
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#211A17]">
                <User
                  size={20}
                  className="text-[#D89A3C]"
                />
              </div>

              <div>
                <p className="text-sm text-[#8D7B68]">
                  Name
                </p>

                <p className="mt-1 font-medium text-[#F5E9D8]">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#211A17]">
                <Mail
                  size={20}
                  className="text-[#D89A3C]"
                />
              </div>

              <div>
                <p className="text-sm text-[#8D7B68]">
                  E-Mail
                </p>

                <p className="mt-1 font-medium text-[#F5E9D8]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#211A17]">
              <CreditCard
                size={22}
                className="text-[#D89A3C]"
              />
            </div>

            <div>
              <p className="text-sm text-[#8D7B68]">
                Aktuelles Abo
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#F5E9D8]">
                {planName}
              </h2>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#D89A3C]/20 bg-[#211A17] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={21}
                className="text-[#D89A3C]"
              />

              <span className="font-semibold text-[#F5E9D8]">
                {hasActiveSubscription
                  ? "Aktiver Zugang"
                  : "Zugang nicht aktiv"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#BFAE98]">
              {subscription?.plan === "premium"
                ? "Du hast Zugriff auf alle Premium Inhalte und Funktionen."
                : "Du kannst deine gespeicherten Atmosphären jederzeit anhören und verwalten."}
            </p>
          </div>

          {subscription?.plan === "premium" &&
            hasActiveSubscription && (
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={openingPortal}
                className="mt-6 w-full rounded-2xl border border-[#5A4637] bg-[#0F0C0A] px-6 py-4 font-semibold text-[#F5E9D8] transition hover:border-[#D89A3C] hover:text-[#D89A3C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {openingPortal
                  ? "Aboverwaltung wird geöffnet..."
                  : "Abo verwalten"}
              </button>
            )}
        </div>
      </section>

      <section className="mt-8 px-12">
        <div className="rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">
          <h2 className="text-2xl font-bold text-[#F5E9D8]">
            Kontoaktionen
          </h2>

          <p className="mt-2 text-[#BFAE98]">
            Verwalte hier deinen Zugang.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-red-900/40 bg-red-950/20 px-6 py-4 font-semibold text-red-300 transition hover:border-red-500/60 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={20} />

            {loggingOut
              ? "Abmeldung läuft..."
              : "Abmelden"}
          </button>
        </div>
      </section>
    </main>
  );
}