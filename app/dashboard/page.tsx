"use client";

import { useEffect, useState } from "react";

import Hero from "../../components/Hero";
import ChannelRow from "../../components/ChannelRow";

import { createClient } from "../../lib/supabase/client";

import type { Channel } from "../../types/channel";

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChannels() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Fehler beim Laden der Channels:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      const mappedChannels: Channel[] = (data ?? []).map((channel) => ({
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
      }));

      setChannels(mappedChannels);
      setLoading(false);
    }

    loadChannels();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0908] text-[#F5E9D8]">
        <p className="text-lg text-[#BFAE98]">
          Atmosphären werden geladen...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 pb-36">
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <h1 className="text-2xl font-bold text-red-300">
            Atmosphären konnten nicht geladen werden
          </h1>

          <p className="mt-3 text-red-200">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 pb-36">
      <Hero />

      <ChannelRow
        title="Beliebte Atmosphären"
        channels={channels.filter((channel) => channel.featured)}
      />

      <ChannelRow
        title="Neu hinzugefügt"
        channels={channels}
      />

      <ChannelRow
        title="Für Cafés"
        channels={channels.filter((channel) =>
          channel.perfectFor.includes("Cafés")
        )}
      />

      <ChannelRow
        title="Für Restaurants"
        channels={channels.filter((channel) =>
          channel.perfectFor.includes("Restaurants")
        )}
      />
    </div>
  );
}