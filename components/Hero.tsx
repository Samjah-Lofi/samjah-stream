"use client";

import Image from "next/image";
import { Play, Heart } from "lucide-react";

import { usePlayer } from "@/context/PlayerContext";
import { usePreview } from "@/context/PreviewContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function Hero() {
  const {
    currentChannel,
    setCurrentChannel,
  } = usePlayer();

  const { previewChannel } = usePreview();
  const { play } = useAudioPlayer();
  const { isFavorite, toggleFavorite } =
    useFavorites();

  const channel =
    previewChannel ?? currentChannel;

  if (!channel) {
    return (
      <section className="relative overflow-hidden rounded-[32px] border border-[#3A2B22] bg-[#171311]">
        <div className="flex min-h-[420px] items-center justify-center px-12">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
              Samjah
            </p>

            <h1 className="mt-4 text-5xl font-black text-[#F5E9D8]">
              Wähle eine Atmosphäre
            </h1>

            <p className="mt-4 text-lg text-[#BFAE98]">
              Wähle eine Atmosphäre aus, um sie abzuspielen.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const favorite = isFavorite(channel.id);

  const handlePlay = async () => {
    setCurrentChannel(channel);
    await play(channel);
  };

  const handleFavorite = async () => {
    await toggleFavorite(channel.id);
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#3A2B22]">
      <div className="relative min-h-[420px]">
        <Image
          src={channel.image}
          alt={channel.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0908] via-[#0B0908]/75 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl px-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
              Featured Atmosphere
            </p>

            <h1 className="mt-4 text-6xl font-black leading-tight text-[#F5E9D8]">
              {channel.title}
            </h1>

            <p className="mt-5 text-xl leading-8 text-[#BFAE98]">
              {channel.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-3 rounded-2xl bg-[#D89A3C] px-7 py-4 font-bold text-[#120D09] transition hover:scale-105 hover:bg-[#E9B65A]"
              >
                <Play
                  size={21}
                  fill="currentColor"
                />

                Abspielen
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                  favorite
                    ? "border-[#D89A3C] bg-[#D89A3C] text-[#120D09]"
                    : "border-[#D89A3C]/40 bg-[#0B0908]/70 text-[#F5E9D8] hover:border-[#D89A3C] hover:text-[#D89A3C]"
                }`}
                aria-label={
                  favorite
                    ? "Aus Favoriten entfernen"
                    : "Zu Favoriten hinzufügen"
                }
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
        </div>
      </div>
    </section>
  );
}