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
    currentChannel,
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
    <div className="mb-5 flex items-center justify-center gap-8">
      <button
        type="button"
        onClick={handlePrevious}
        aria-label="Vorherige Atmosphäre"
        className="text-[#8D7B68] transition hover:scale-110 hover:text-[#D89A3C]"
      >
        <SkipBack size={26} />
      </button>

      <button
        type="button"
        onClick={toggle}
        aria-label={
          isPlaying
            ? "Pause"
            : "Abspielen"
        }
        className="pulse-glow flex h-16 w-16 items-center justify-center rounded-full bg-[#D89A3C] text-[#120D09] transition-all duration-300 hover:scale-110 hover:bg-[#E9B65A]"
      >
        {isPlaying ? (
          <Pause size={30} />
        ) : (
          <Play
            size={30}
            fill="currentColor"
            className="ml-1"
          />
        )}
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Nächste Atmosphäre"
        className="text-[#8D7B68] transition hover:scale-110 hover:text-[#D89A3C]"
      >
        <SkipForward size={26} />
      </button>
    </div>
  );
}