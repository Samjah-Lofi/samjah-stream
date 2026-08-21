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
  } = useAudioPlayer();

  const handleNext = () => {
    nextChannel();

    const currentIndex = currentChannel
      ? currentChannel.id
      : 1;

    const nextId =
      currentIndex >= 6
        ? 1
        : currentIndex + 1;

    const nextSlugs: Record<number, string> = {
      1: "coffee-morning",
      2: "lunch-lounge",
      3: "afro-lounge",
      4: "sunset-lounge",
      5: "late-night",
      6: "rainy-day",
    };

    router.push(
      `/dashboard/atmosphaeren/${nextSlugs[nextId]}`
    );
  };

  const handlePrevious = () => {
    previousChannel();

    const currentIndex = currentChannel
      ? currentChannel.id
      : 1;

    const previousId =
      currentIndex <= 1
        ? 6
        : currentIndex - 1;

    const previousSlugs: Record<number, string> = {
      1: "coffee-morning",
      2: "lunch-lounge",
      3: "afro-lounge",
      4: "sunset-lounge",
      5: "late-night",
      6: "rainy-day",
    };

    router.push(
      `/dashboard/atmosphaeren/${previousSlugs[previousId]}`
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
        aria-label={isPlaying ? "Pause" : "Abspielen"}
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