"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useFavorites } from "@/context/FavoritesContext";
import ChannelCard from "@/components/ChannelCard";

import type { Channel } from "@/types/channel";

export default function FavoritenPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteChannels = async () => {
      if (favorites.length === 0) {
        setChannels([]);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .in("id", favorites)
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "Favoriten konnten nicht geladen werden:",
          error
        );

        setChannels([]);
        setLoading(false);
        return;
      }

      const mappedChannels: Channel[] = (data ?? []).map(
        (channel) => ({
          id: channel.id,
          slug: channel.slug,
          title: channel.title,
          description: channel.description,
          longDescription: channel.long_description,
          image: channel.image,
          streamUrl: channel.stream_url,
          duration: channel.duration,
          tracks: channel.tracks,
          featured: channel.featured,
          perfectFor: channel.perfect_for ?? [],
          tags: channel.tags ?? [],
        })
      );

      setChannels(mappedChannels);
      setLoading(false);
    };

    loadFavoriteChannels();
  }, [favorites]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0908]">
        <p className="text-lg text-[#BFAE98]">
          Favoriten werden geladen...
        </p>
      </main>
    );
  }

  return (
    <main className="pb-36">
      <section className="px-12 pt-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Deine Sammlung
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Favoriten
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Alle Atmosphären, die du gespeichert hast.
        </p>
      </section>

      {channels.length === 0 ? (
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-12 text-center">
          <div className="max-w-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D89A3C]/30 bg-[#211A17]">
              <Heart
                size={34}
                className="text-[#D89A3C]"
              />
            </div>

            <h2 className="mt-8 text-4xl font-bold text-[#F5E9D8]">
              Noch keine Favoriten
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#BFAE98]">
              Speichere deine Lieblingskanäle und finde sie
              hier jederzeit wieder.
            </p>

            <Link
              href="/dashboard"
              className="mt-10 inline-flex rounded-2xl bg-[#D89A3C] px-8 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
            >
              Atmosphären entdecken
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-12 px-12">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#F5E9D8]">
              Gespeicherte Kanäle
            </h2>

            <span className="rounded-full border border-[#D89A3C]/30 bg-[#211A17] px-5 py-2 text-sm text-[#D89A3C]">
              {channels.length}{" "}
              {channels.length === 1
                ? "Favorit"
                : "Favoriten"}
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="relative"
              >
                <ChannelCard channel={channel} />

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleFavorite(channel.id);
                  }}
                  aria-label={`${channel.title} aus Favoriten entfernen`}
                  className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#D89A3C]/40 bg-[#0B0908]/85 text-[#D89A3C] backdrop-blur transition hover:scale-110 hover:bg-[#D89A3C] hover:text-[#120D09]"
                >
                  <Heart
                    size={20}
                    fill="currentColor"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}