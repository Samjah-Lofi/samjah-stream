import { redirect } from "next/navigation";
import { headers } from "next/headers";

import Sidebar from "../../components/Sidebar";
import Player from "../../components/Player";

import { PlayerProvider } from "../../context/PlayerContext";
import { AudioPlayerProvider } from "../../context/AudioPlayerContext";
import { PreviewProvider } from "../../context/PreviewContext";
import { SearchProvider } from "../../context/SearchContext";
import { FavoritesProvider } from "../../context/FavoritesContext";

import { createClient } from "../../lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const headersList = await headers();

  const pathname =
    headersList.get("x-pathname") || "/dashboard";

  const { data: subscription, error } =
    await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", session.user.id)
      .maybeSingle();

  if (error) {
    console.error(
      "ABO STATUS KANN NICHT GELADEN WERDEN:",
      error
    );
  }

  const hasActiveSubscription =
    subscription?.status === "active" ||
    subscription?.status === "trialing";

  /*
   * Nutzer ohne aktives Abo dürfen ausschließlich
   * die Abo-Seite sehen.
   */
  if (!hasActiveSubscription) {
    if (pathname !== "/dashboard/abo") {
      redirect("/dashboard/abo");
    }

    /*
     * Wichtig:
     * Keine Sidebar, kein Player und keine
     * Dashboard-Provider auf der Abo-Seite.
     */
    return children;
  }

  /*
   * Nutzer mit aktivem Abo brauchen die Abo-Seite
   * nicht mehr. Sie gehen direkt ins Dashboard.
   */
  if (pathname === "/dashboard/abo") {
    redirect("/dashboard");
  }

  return (
    <PlayerProvider>
      <FavoritesProvider>
        <SearchProvider>
          <PreviewProvider>
            <AudioPlayerProvider>
              <main className="min-h-screen bg-[#0B0908] text-[#F5E9D8]">
                <Sidebar />

                <div className="ml-72">
                  {children}
                </div>

                <Player />
              </main>
            </AudioPlayerProvider>
          </PreviewProvider>
        </SearchProvider>
      </FavoritesProvider>
    </PlayerProvider>
  );
}