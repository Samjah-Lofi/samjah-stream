"use client";

import { useEffect } from "react";

import { usePlayer } from "@/context/PlayerContext";
import type { Channel } from "@/types/channel";

type Props = {
  channel: Channel;
};

export default function SyncPlayer({ channel }: Props) {
  const { currentChannel, setCurrentChannel } = usePlayer();

  useEffect(() => {
    if (!currentChannel || currentChannel.id !== channel.id) {
      setCurrentChannel(channel);
    }
  }, [channel, currentChannel, setCurrentChannel]);

  return null;
}