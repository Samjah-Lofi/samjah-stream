import { redirect } from "next/navigation";

import Sidebar from "../../components/Sidebar";
import Player from "../../components/Player";

import { PlayerProvider } from "../../context/PlayerContext";
import { AudioPlayerProvider } from "../../context/AudioPlayerContext";
import { PreviewProvider } from "../../context/PreviewContext";
import { SearchProvider } from "../../context/SearchContext";
import { FavoritesProvider } from "../../context/FavoritesContext";

import { createClient } from "../../lib/supabase/server";

const SUPERUSER_ID = "837b76e4-db6a-4bb6-a37f-9ed7e438900e";

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

  const isSuperuser = session.user.id === SUPERUSER_ID;

  if (!isSuperuser) {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "ABO KANN NICHT GEPRÜFT WERDEN:",
        error
      );

      redirect("/abo");
    }

    const hasPremium =
      subscription?.plan === "premium" &&
      subscription?.status === "active";

    if (!hasPremium) {
      redirect("/abo");
    }
  }

  return (
    <PlayerProvider>
      <FavoritesProvider>
        <SearchProvider>
          <PreviewProvider>
            <AudioPlayerProvider>
              <main className="min-h-screen overflow-x-hidden bg-[#0B0908] text-[#F5E9D8]">
                <Sidebar />

                <div className="ml-0 md:ml-72">
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