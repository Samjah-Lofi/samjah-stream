"use client";

import { Volume2 } from "lucide-react";

import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function VolumeControl() {
  const {
    volume,
    setVolume,
  } = useAudioPlayer();

  return (
    <div className="flex min-w-[260px] items-center justify-end gap-5">

      <Volume2
        size={22}
        className="text-[#D89A3C]"
      />

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) =>
          setVolume(Number(e.target.value))
        }
        className="w-36 accent-[#D89A3C]"
      />

    </div>
  );
}