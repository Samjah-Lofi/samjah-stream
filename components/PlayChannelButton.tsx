"use client";

import { Play } from "lucide-react";

import { usePlayer } from "@/context/PlayerContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import type { Channel } from "@/types/channel";

type Props = {
  channel: Channel;
};

export default function PlayChannelButton({ channel }: Props) {
  const { setCurrentChannel } = usePlayer();
  const { play } = useAudioPlayer();

  const handleClick = async () => {
    setCurrentChannel(channel);

    // Einen Tick warten, damit der AudioPlayer
    // die neue streamUrl übernehmen kann.
    requestAnimationFrame(async () => {
      await play();
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 rounded-2xl bg-[#D89A3C] px-8 py-4 font-bold text-[#120D09] transition hover:scale-105 hover:bg-[#E9B65A]"
    >
      <Play
        size={22}
        fill="currentColor"
      />

      Jetzt hören
    </button>
  );
}