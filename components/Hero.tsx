"use client";

import Image from "next/image";
import { Search, Heart } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { usePreview } from "../context/PreviewContext";
import { useSearch } from "../context/SearchContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";

export default function Hero() {
  const { currentChannel, setCurrentChannel } = usePlayer();

  const { previewChannel } = usePreview();

  const { searchTerm, setSearchTerm } = useSearch();

  const { isFavorite, toggleFavorite } = useFavorites();

  const { play } = useAudioPlayer();

  const channel = previewChannel ?? currentChannel;

  const favorite = isFavorite(channel.id);

  const handlePlay = () => {
    setCurrentChannel(channel);

    setTimeout(() => {
      play();
    }, 150);
  };

  return (
    <section className="mb-14">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">
            WELCOME BACK
          </p>

          <h1 className="mt-3 text-6xl font-black leading-none text-[#F5E9D8]">
            Deine Musik.
            <br />
            Deine Atmosphäre.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#BFAE98]">
            Handverlesene LoFi- und Afro-LoFi-Musik für Cafés,
            Restaurants, Hotels und moderne Arbeitsplätze.
          </p>
        </div>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8F7B67]"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Atmosphäre suchen..."
            className="w-96 rounded-2xl border border-[#3A2B22] bg-[#171311]/80 py-4 pl-14 pr-6 text-[#F5E9D8] outline-none backdrop-blur transition placeholder:text-[#8F7B67] focus:border-[#D89A3C]"
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-[#3A2B22]">
        <div className="relative h-[470px]">
          <Image
            key={channel.id}
            src={channel.image}
            alt={channel.title}
            fill
            priority
            className="hero-image object-cover transition-all duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0908] via-[#0B0908]/75 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-[#3D220C]/20" />

          <div className="absolute left-[-150px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#D89A3C]/10 blur-[120px]" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl px-14">
              <span className="rounded-full border border-[#D89A3C]/40 bg-[#D89A3C]/15 px-5 py-2 text-sm font-semibold tracking-wider text-[#E9B65A]">
                ● ON AIR
              </span>

              <h2 className="mt-8 text-7xl font-black leading-none text-[#F5E9D8]">
                {channel.title}
              </h2>

              <p className="mt-6 max-w-xl text-xl leading-9 text-[#D6C6B4]">
                {channel.description}
              </p>

              <div className="mt-10 flex gap-5">
                <button
                  type="button"
                  onClick={handlePlay}
                  className="rounded-2xl bg-[#D89A3C] px-8 py-4 text-lg font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
                >
                  ▶ Jetzt hören
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(channel.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-8 py-4 text-lg font-semibold backdrop-blur transition ${
                    favorite
                      ? "border-[#D89A3C] bg-[#D89A3C]/15 text-[#D89A3C]"
                      : "border-[#5A4637] bg-[#171311]/60 text-[#F5E9D8] hover:border-[#D89A3C]"
                  }`}
                >
                  <Heart
                    size={21}
                    fill={favorite ? "currentColor" : "none"}
                  />

                  {favorite
                    ? "Favorit gespeichert"
                    : "Favorit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}