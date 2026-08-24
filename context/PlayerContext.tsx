"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import type { Channel } from "@/types/channel";

type PlayerContextType = {
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  nextChannel: () => Channel | null;
  previousChannel: () => Channel | null;
};

const PlayerContext =
  createContext<PlayerContextType | null>(null);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannelState] =
    useState<Channel | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "Channels konnten nicht geladen werden:",
          error
        );

        setLoading(false);
        return;
      }

      const mappedChannels: Channel[] = (data ?? []).map(
        (channel) => ({
          id: channel.id,
          slug: channel.slug,
          title: channel.title,
          description: channel.description,
          longDescription: channel.long_description,
          image: channel.image,
          streamUrl: channel.stream_url,
          duration: channel.duration,
          tracks: channel.tracks,
          featured: channel.featured,
          perfectFor: channel.perfect_for ?? [],
          tags: channel.tags ?? [],
        })
      );

      setChannels(mappedChannels);
      setLoading(false);
    };

    loadChannels();
  }, []);

  const setCurrentChannel = (channel: Channel) => {
    setCurrentChannelState(channel);
  };

  const nextChannel = (): Channel | null => {
    if (channels.length === 0) {
      return null;
    }

    if (!currentChannel) {
      const channel = channels[0];
      setCurrentChannelState(channel);
      return channel;
    }

    const currentIndex = channels.findIndex(
      (channel) => channel.id === currentChannel.id
    );

    const nextIndex =
      currentIndex === -1 ||
      currentIndex === channels.length - 1
        ? 0
        : currentIndex + 1;

    const channel = channels[nextIndex];

    setCurrentChannelState(channel);

    return channel;
  };

  const previousChannel = (): Channel | null => {
    if (channels.length === 0) {
      return null;
    }

    if (!currentChannel) {
      const channel = channels[0];
      setCurrentChannelState(channel);
      return channel;
    }

    const currentIndex = channels.findIndex(
      (channel) => channel.id === currentChannel.id
    );

    const previousIndex =
      currentIndex <= 0
        ? channels.length - 1
        : currentIndex - 1;

    const channel = channels[previousIndex];

    setCurrentChannelState(channel);

    return channel;
  };

  if (loading) {
    return null;
  }

  return (
    <PlayerContext.Provider
      value={{
        currentChannel,
        setCurrentChannel,
        nextChannel,
        previousChannel,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider."
    );
  }

  return context;
}