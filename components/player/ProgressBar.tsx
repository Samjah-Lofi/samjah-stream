"use client";

import { useAudioPlayer } from "@/context/AudioPlayerContext";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) {
    return "00:00";
  }

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ProgressBar() {
  const {
    currentTime,
    duration,
    progress,
    seek,
  } = useAudioPlayer();

  return (
    <>
      <div className="hidden w-full items-center gap-4 md:flex">
        <span className="w-12 text-right text-xs text-[#8D7B68]">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) =>
            seek(Number(e.target.value))
          }
          className="h-2 flex-1 cursor-pointer accent-[#D89A3C]"
        />

        <span className="w-12 text-xs text-[#8D7B68]">
          {formatTime(duration)}
        </span>
      </div>

      <div className="hidden text-center text-xs text-[#D89A3C] md:block">
        {Math.round(progress)}%
      </div>

      <div className="md:hidden">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) =>
            seek(Number(e.target.value))
          }
          aria-label="Wiedergabefortschritt"
          className="block h-1 w-full cursor-pointer accent-[#D89A3C]"
        />
      </div>
    </>
  );
}