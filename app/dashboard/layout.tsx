import { redirect } from "next/navigation";

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