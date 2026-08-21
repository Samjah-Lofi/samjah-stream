"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/context/FavoritesContext";

type Props = {
  channelId: number;
};

export default function FavoriteButton({
  channelId,
}: Props) {
  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const favorite = isFavorite(channelId);

  return (
    <button
      onClick={() => toggleFavorite(channelId)}
      className={`flex items-center gap-3 rounded-2xl border px-8 py-4 font-semibold transition-all duration-300 ${
        favorite
          ? "border-[#D89A3C] bg-[#D89A3C] text-[#120D09]"
          : "border-[#5A4637] bg-[#171311]/70 text-[#F5E9D8] hover:border-[#D89A3C]"
      }`}
    >
      <Heart
        size={20}
        fill={favorite ? "currentColor" : "none"}
      />

      {favorite ? "Favorisiert" : "Favorit"}
    </button>
  );
}