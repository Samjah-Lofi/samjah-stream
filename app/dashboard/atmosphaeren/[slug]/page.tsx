"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { usePlayer } from "@/context/PlayerContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useFavorites } from "@/context/FavoritesContext";

import { createClient } from "@/lib/supabase/client";

import Badge from "@/components/ui/Badge";

import type { Channel } from "@/types/channel";

type Track = {
  id: number;
  duration_seconds: number;
};

type TrackChannelRow = {
  sort_order: number;
  track_id: number;
};

export default function AtmosphaereDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    currentChannel,
    setCurrentChannel,
  } = usePlayer();

  const { play } = useAudioPlayer();

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const [trackCount, setTrackCount] =
    useState<number | null>(null);

  const [totalDuration, setTotalDuration] =
    useState<number | null>(null);

  const [loadedChannel, setLoadedChannel] =
    useState<Channel | null>(null);

  useEffect(() => {
    async function loadChannel() {
      const supabase = createClient();

      const { data, error } =
        await supabase
          .from("channels")
          .select("*")
          .eq("slug", slug)
          .single();

      if (error || !data) {
        console.error(
          "ATMOSPHÄRE LADEN FEHLER:",
          error
        );

        setLoadedChannel(null);
        return;
      }

      const mappedChannel: Channel = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        longDescription:
          data.long_description,
        image: data.image,
        streamUrl: data.stream_url,
        duration: data.duration,
        tracks: data.tracks,
        featured: data.featured,
        perfectFor:
          data.perfect_for ?? [],
        tags: data.tags ?? [],
      };

      setLoadedChannel(mappedChannel);

      const {
        data: trackChannelData,
        error: trackChannelError,
      } = await supabase
        .from("track_channels")
        .select("sort_order, track_id")
        .eq(
          "channel_id",
          data.id
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        );

      if (trackChannelError) {
        console.error(
          "TRACK CHANNELS LADEN FEHLER:",
          trackChannelError
        );

        return;
      }

      const relations =
        (trackChannelData ??
          []) as TrackChannelRow[];

      if (!relations.length) {
        setTrackCount(0);
        setTotalDuration(0);
        return;
      }

      const trackIds =
        relations.map(
          (relation) =>
            relation.track_id
        );

      const {
        data: tracksData,
        error: tracksError,
      } = await supabase
        .from("tracks")
        .select(
          "id, duration_seconds"
        )
        .in(
          "id",
          trackIds
        );

      if (tracksError) {
        console.error(
          "TRACKS LADEN FEHLER:",
          tracksError
        );

        return;
      }

      const tracks =
        (tracksData ??
          []) as Track[];

      const durationById =
        new Map<number, number>();

      for (const track of tracks) {
        durationById.set(
          track.id,
          track.duration_seconds ?? 0
        );
      }

      const totalSeconds =
        relations.reduce(
          (
            total,
            relation
          ) =>
            total +
            (durationById.get(
              relation.track_id
            ) ?? 0),
          0
        );

      setTrackCount(
        relations.length
      );

      setTotalDuration(
        totalSeconds
      );
    }

    loadChannel();
  }, [slug]);

  const handlePlay = async () => {
    if (!loadedChannel) {
      return;
    }

    setCurrentChannel(
      loadedChannel
    );

    await play(
      loadedChannel
    );
  };

  const handleFavorite = async () => {
    if (!loadedChannel) {
      return;
    }

    await toggleFavorite(
      loadedChannel.id
    );
  };

  if (!loadedChannel) {
    return (
      <main className="min-h-screen bg-[#0B0908] px-12 py-16">
        <Link
          href="/dashboard/atmosphaeren"
          className="inline-flex items-center gap-2 text-[#D89A3C] transition hover:text-[#E9B65A]"
        >
          <ArrowLeft size={18} />
          Zurück zu den Atmosphären
        </Link>

        <h1 className="mt-12 text-5xl font-black text-[#F5E9D8]">
          Atmosphären werden geladen...
        </h1>
      </main>
    );
  }

  const isActive =
    currentChannel?.id ===
    loadedChannel.id;

  const favorite =
    isFavorite(
      loadedChannel.id
    );

  const formatDuration = (
    seconds: number
  ) => {
    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    if (hours > 0) {
      return `${hours} Std. ${minutes} Min.`;
    }

    return `${minutes} Min.`;
  };

  return (
    <main className="min-h-screen bg-[#0B0908] pb-40">
      <div className="px-12 pt-10">
        <Link
          href="/dashboard/atmosphaeren"
          className="inline-flex items-center gap-2 text-[#BFAE98] transition hover:text-[#D89A3C]"
        >
          <ArrowLeft size={18} />
          Alle Atmosphären
        </Link>
      </div>

      <section className="mx-auto mt-10 max-w-7xl px-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[32px] border border-[#3A2B22]">
            <div className="relative aspect-[4/3]">
              <Image
                src={
                  loadedChannel.image
                }
                alt={
                  loadedChannel.title
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-transparent" />

              <div className="absolute left-6 top-6">
                <Badge>
                  ON AIR
                </Badge>
              </div>

              <button
                type="button"
                onClick={
                  handleFavorite
                }
                aria-label={
                  favorite
                    ? `${loadedChannel.title} aus Favoriten entfernen`
                    : `${loadedChannel.title} zu Favoriten hinzufügen`
                }
                className={`absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur transition-all duration-300 hover:scale-110 ${
                  favorite
                    ? "border-[#D89A3C]/60 bg-[#D89A3C] text-[#120D09]"
                    : "border-[#D89A3C]/40 bg-[#0B0908]/80 text-[#F5E9D8] hover:bg-[#D89A3C] hover:text-[#120D09]"
                }`}
              >
                <Heart
                  size={21}
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {loadedChannel.tags.map(
                (tag) => (
                  <Badge
                    key={tag}
                    variant="dark"
                  >
                    {tag}
                  </Badge>
                )
              )}
            </div>

            <h1 className="mt-6 text-6xl font-black leading-tight text-[#F5E9D8]">
              {
                loadedChannel.title
              }
            </h1>

            <p className="mt-6 text-xl leading-9 text-[#BFAE98]">
              {
                loadedChannel.description
              }
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#3A2B22] bg-[#171311] p-5">
                <p className="text-sm text-[#8D7B68]">
                  Länge
                </p>

                <p className="mt-2 text-xl font-bold text-[#F5E9D8]">
                  {totalDuration ===
                  null
                    ? "..."
                    : formatDuration(
                        totalDuration
                      )}
                </p>
              </div>

              <div className="rounded-2xl border border-[#3A2B22] bg-[#171311] p-5">
                <p className="text-sm text-[#8D7B68]">
                  Tracks
                </p>

                <p className="mt-2 text-xl font-bold text-[#F5E9D8]">
                  {trackCount ===
                  null
                    ? "..."
                    : trackCount}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handlePlay
              }
              className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-[#D89A3C] px-8 py-5 text-lg font-bold text-[#120D09] transition hover:scale-[1.02] hover:bg-[#E9B65A]"
            >
              <Play
                size={22}
                fill="currentColor"
              />

              {isActive
                ? "Jetzt läuft"
                : "Jetzt abspielen"}
            </button>
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#F5E9D8]">
            Über diese Atmosphäre
          </h2>

          <p className="mt-6 text-lg leading-9 text-[#BFAE98]">
            {
              loadedChannel.longDescription
            }
          </p>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.25em] text-[#8D7B68]">
              Perfekt für
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {loadedChannel.perfectFor.map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#3A2B22] bg-[#171311] px-5 py-2 text-[#BFAE98]"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}