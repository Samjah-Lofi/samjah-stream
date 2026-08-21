"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { usePlayer } from "@/context/PlayerContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Badge from "@/components/ui/Badge";

import type { Channel } from "@/types/channel";

export default function AtmosphaereDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    currentChannel,
    setCurrentChannel,
  } = usePlayer();

  const { play } = useAudioPlayer();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannel = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(
          "Atmosphäre konnte nicht geladen werden:",
          error
        );

        setChannel(null);
        setLoading(false);
        return;
      }

      const mappedChannel: Channel = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        longDescription: data.long_description,
        image: data.image,
        streamUrl: data.stream_url,
        duration: data.duration,
        tracks: data.tracks,
        featured: data.featured,
        perfectFor: data.perfect_for ?? [],
        tags: data.tags ?? [],
      };

      setChannel(mappedChannel);
      setLoading(false);
    };

    loadChannel();
  }, [slug]);

  const handlePlay = async () => {
    if (!channel) return;

    setCurrentChannel(channel);
    await play();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0908]">
        <p className="text-lg text-[#BFAE98]">
          Atmosphäre wird geladen...
        </p>
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="min-h-screen px-12 py-16">
        <Link
          href="/dashboard/atmosphaeren"
          className="text-[#D89A3C]"
        >
          ← Zurück zu den Atmosphären
        </Link>

        <h1 className="mt-12 text-5xl font-black text-[#F5E9D8]">
          Atmosphäre nicht gefunden
        </h1>
      </main>
    );
  }

  const isActive = currentChannel?.id === channel.id;

  return (
    <main className="min-h-screen pb-40">
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
                src={channel.image}
                alt={channel.title}
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
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {channel.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="dark"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mt-6 text-6xl font-black leading-tight text-[#F5E9D8]">
              {channel.title}
            </h1>

            <p className="mt-6 text-xl leading-9 text-[#BFAE98]">
              {channel.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#3A2B22] bg-[#171311] p-5">
                <p className="text-sm text-[#8D7B68]">
                  Länge
                </p>

                <p className="mt-2 text-xl font-bold text-[#F5E9D8]">
                  {channel.duration}
                </p>
              </div>

              <div className="rounded-2xl border border-[#3A2B22] bg-[#171311] p-5">
                <p className="text-sm text-[#8D7B68]">
                  Tracks
                </p>

                <p className="mt-2 text-xl font-bold text-[#F5E9D8]">
                  {channel.tracks}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlay}
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
            {channel.longDescription}
          </p>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.25em] text-[#8D7B68]">
              Perfekt für
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {channel.perfectFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#3A2B22] bg-[#171311] px-5 py-2 text-[#BFAE98]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}