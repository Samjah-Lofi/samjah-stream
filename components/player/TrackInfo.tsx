"use client";

import Image from "next/image";

import { usePlayer } from "@/context/PlayerContext";

export default function TrackInfo() {
  const { currentChannel } = usePlayer();

  if (!currentChannel) {
    return (
      <div className="flex w-72 items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#3A2B22] bg-[#171311]" />

        <div className="min-w-0">
          <p className="text-sm text-[#8D7B68]">
            Keine Atmosphäre ausgewählt
          </p>

          <p className="mt-1 truncate text-sm text-[#BFAE98]">
            Wähle eine Atmosphäre aus
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-72 items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#3A2B22]">
        <Image
          src={currentChannel.image}
          alt={currentChannel.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#F5E9D8]">
          {currentChannel.title}
        </p>

        <p className="mt-1 truncate text-xs text-[#8D7B68]">
          Atmosphären
        </p>
      </div>
    </div>
  );
}