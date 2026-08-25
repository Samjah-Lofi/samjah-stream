"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { usePlayer } from "@/context/PlayerContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function PlayerControls() {
  const router = useRouter();

  const {
    nextChannel,
    previousChannel,
  } = usePlayer();

  const {
    isPlaying,
    toggle,
    play,
  } = useAudioPlayer();

  const handleNext = async () => {
    const next = nextChannel();

    if (!next) {
      return;
    }

    await play(next);

    router.push(
      `/dashboard/atmosphaeren/${next.slug}`
    );
  };

  const handlePrevious = async () => {
    const previous = previousChannel();

    if (!previous) {
      return;
    }

    await play(previous);

    router.push(
      `/dashboard/atmosphaeren/${previous.slug}`
    );
  };

  return (
    <div className="flex items-center justify-center gap-3 md:mb-5 md:gap-8">
      <button
        type="button"
        onClick={handlePrevious}
        aria-label="Vorherige Atmosphäre"
        className="text-[#8D7B68] transition hover:scale-110 hover:text-[#D89A3C]"
      >
        <SkipBack
          size={20}
          className="md:h-[26px] md:w-[26px]"
        />
      </button>

      <button
        type="button"
        onClick={toggle}
        aria-label={
          isPlaying
            ? "Pause"
            : "Abspielen"
        }
        className="pulse-glow flex h-11 w-11 items-center justify-center rounded-full bg-[#D89A3C] text-[#120D09] transition-all duration-300 hover:scale-110 hover:bg-[#E9B65A] md:h-16 md:w-16"
      >
        {isPlaying ? (
          <Pause
            size={21}
            className="md:h-[30px] md:w-[30px]"
          />
        ) : (
          <Play
            size={21}
            fill="currentColor"
            className="ml-0.5 md:ml-1 md:h-[30px] md:w-[30px]"
          />
        )}
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Nächste Atmosphäre"
        className="text-[#8D7B68] transition hover:scale-110 hover:text-[#D89A3C]"
      >
        <SkipForward
          size={20}
          className="md:h-[26px] md:w-[26px]"
        />
      </button>
    </div>
  );
}