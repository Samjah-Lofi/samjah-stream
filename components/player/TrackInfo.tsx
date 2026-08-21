"use client";

import Image from "next/image";

import { usePlayer } from "@/context/PlayerContext";

import Badge from "../ui/Badge";

export default function TrackInfo() {
  const { currentChannel } = usePlayer();

  return (
    <div className="flex min-w-[360px] items-center gap-5">

      <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-lg">

        <Image
          src={currentChannel.image}
          alt={currentChannel.title}
          fill
          sizes="64px"
          className="object-cover"
        />

      </div>

      <div>

        <div className="flex items-center gap-3">

          <h3 className="text-lg font-bold text-[#F5E9D8]">
            {currentChannel.title}
          </h3>

          <Badge>
            ON AIR
          </Badge>

        </div>

        <p className="mt-1 text-sm text-[#BFAE98]">
          {currentChannel.description}
        </p>

      </div>

    </div>
  );
}