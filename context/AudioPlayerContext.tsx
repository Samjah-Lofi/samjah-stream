"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Channel } from "../types/channel";
import { createClient } from "../lib/supabase/client";

type Track = {
  id: number;
  catalog_number: number;
  title: string;
  duration_seconds: number;
  audio_path: string;
};

type TrackChannelRow = {
  sort_order: number;
  track_id: number;
};

type TrackRow = {
  id: number;
  catalog_number: number;
  title: string;
  duration_seconds: number;
  audio_path: string;
};

type AudioPlayerContextType = {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  play: (channel?: Channel) => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const AudioPlayerContext =
  createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentChannelRef =
    useRef<Channel | null>(null);

  const tracksRef =
    useRef<Track[]>([]);

  const trackIndexRef =
    useRef(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [volume, setVolumeState] =
    useState(0.75);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const supabase = createClient();

  const getTrackUrl = async (
    audioPath: string
  ): Promise<string | null> => {
    const { data, error } =
      await supabase.storage
        .from("audio")
        .createSignedUrl(
          audioPath,
          3600
        );

    if (error) {
      console.error(
        "SIGNED URL FEHLER:",
        error
      );

      return null;
    }

    return data.signedUrl;
  };

  const playTrack = async (
    track: Track,
    shouldPlay = true
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const url =
      await getTrackUrl(
        track.audio_path
      );

    if (!url) {
      setIsPlaying(false);
      return;
    }

    try {
      audio.pause();

      audio.src = url;
      audio.volume = volume;
      audio.currentTime = 0;

      setCurrentTime(0);

      setDuration(
        track.duration_seconds || 0
      );

      setIsPlaying(false);

      audio.load();

      await new Promise<void>(
        (
          resolve,
          reject
        ) => {
          const handleCanPlay =
            () => {
              cleanup();
              resolve();
            };

          const handleError =
            () => {
              cleanup();

              reject(
                new Error(
                  "Audio konnte nicht geladen werden."
                )
              );
            };

          const cleanup = () => {
            audio.removeEventListener(
              "canplay",
              handleCanPlay
            );

            audio.removeEventListener(
              "error",
              handleError
            );
          };

          audio.addEventListener(
            "canplay",
            handleCanPlay,
            {
              once: true,
            }
          );

          audio.addEventListener(
            "error",
            handleError,
            {
              once: true,
            }
          );
        }
      );

      if (shouldPlay) {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(
        "AUDIO TRACK FEHLER:",
        error
      );

      setIsPlaying(false);
    }
  };

  const loadChannelTracks =
    async (
      channel: Channel
    ): Promise<Track[]> => {
      const {
        data: relationData,
        error: relationError,
      } = await supabase
        .from("track_channels")
        .select(
          "sort_order, track_id"
        )
        .eq(
          "channel_id",
          channel.id
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        );

      if (relationError) {
        console.error(
          "TRACK CHANNELS LADEN FEHLER:",
          relationError
        );

        return [];
      }

      const relations =
        (relationData ??
          []) as TrackChannelRow[];

      if (!relations.length) {
        return [];
      }

      const trackIds =
        relations.map(
          (item) =>
            item.track_id
        );

      const {
        data: trackData,
        error: trackError,
      } = await supabase
        .from("tracks")
        .select(
          "id, catalog_number, title, duration_seconds, audio_path"
        )
        .in(
          "id",
          trackIds
        );

      if (trackError) {
        console.error(
          "TRACKS LADEN FEHLER:",
          trackError
        );

        return [];
      }

      const rows =
        (trackData ??
          []) as TrackRow[];

      const trackMap =
        new Map<number, Track>();

      for (const row of rows) {
        trackMap.set(
          row.id,
          {
            id: row.id,
            catalog_number:
              row.catalog_number,
            title: row.title,
            duration_seconds:
              row.duration_seconds,
            audio_path:
              row.audio_path,
          }
        );
      }

      const tracks: Track[] = [];

      for (const relation of relations) {
        const track =
          trackMap.get(
            relation.track_id
          );

        if (!track) {
          continue;
        }

        tracks.push(track);
      }

      console.log(
        `CHANNEL "${channel.title}": ${tracks.length} TRACKS GELADEN`
      );

      return tracks;
    };

  const nextTrack = async () => {
    const tracks =
      tracksRef.current;

    if (!tracks.length) {
      return;
    }

    trackIndexRef.current =
      (trackIndexRef.current + 1) %
      tracks.length;

    await playTrack(
      tracks[
        trackIndexRef.current
      ],
      true
    );
  };

  const previousTrack =
    async () => {
      const tracks =
        tracksRef.current;

      if (!tracks.length) {
        return;
      }

      trackIndexRef.current =
        trackIndexRef.current <= 0
          ? tracks.length - 1
          : trackIndexRef.current - 1;

      await playTrack(
        tracks[
          trackIndexRef.current
        ],
        true
      );
    };

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded =
      async () => {
        await nextTrack();
      };

    const handleLoadedMetadata =
      () => {
        if (
          Number.isFinite(
            audio.duration
          )
        ) {
          setDuration(
            audio.duration
          );
        }
      };

    const handleDurationChange =
      () => {
        if (
          Number.isFinite(
            audio.duration
          )
        ) {
          setDuration(
            audio.duration
          );
        }
      };

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          audio.currentTime
        );
      };

    const handleError = () => {
      console.error(
        "AUDIO FEHLER:",
        {
          code:
            audio.error?.code,
          message:
            audio.error?.message,
          src:
            audio.currentSrc ||
            audio.src,
        }
      );

      setIsPlaying(false);
    };

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "durationchange",
      handleDurationChange
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "durationchange",
        handleDurationChange
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };
  }, []);

  useEffect(() => {
    const audio =
      audioRef.current;

    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const changeChannel =
    async (
      channel: Channel
    ) => {
      currentChannelRef.current =
        channel;

      const tracks =
        await loadChannelTracks(
          channel
        );

      if (!tracks.length) {
        console.error(
          "Keine Tracks für Atmosphäre gefunden:",
          channel.title
        );

        setIsPlaying(false);
        return;
      }

      tracksRef.current =
        tracks;

      trackIndexRef.current =
        0;

      await playTrack(
        tracks[0],
        true
      );
    };

  const play = async (
    channel?: Channel
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      console.error(
        "Audio Element nicht verfügbar."
      );

      return;
    }

    const target =
      channel ??
      currentChannelRef.current;

    if (!target) {
      console.error(
        "Kein Kanal ausgewählt."
      );

      return;
    }

    if (
      currentChannelRef.current
        ?.id !== target.id
    ) {
      await changeChannel(
        target
      );

      return;
    }

    if (
      !tracksRef.current.length
    ) {
      await changeChannel(
        target
      );

      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error(
        "AUDIO PLAY FEHLER:",
        error
      );

      setIsPlaying(false);
    }
  };

  const pause = () => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const toggle = async () => {
    if (isPlaying) {
      pause();
      return;
    }

    await play();
  };

  const setVolume = (
    value: number
  ) => {
    const nextVolume =
      Math.min(
        1,
        Math.max(0, value)
      );

    setVolumeState(
      nextVolume
    );

    const audio =
      audioRef.current;

    if (audio) {
      audio.volume =
        nextVolume;
    }
  };

  const seek = (
    time: number
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const maxTime =
      Number.isFinite(
        audio.duration
      ) &&
      audio.duration > 0
        ? audio.duration
        : duration;

    const nextTime =
      Math.min(
        Math.max(0, time),
        maxTime || 0
      );

    audio.currentTime =
      nextTime;

    setCurrentTime(
      nextTime
    );
  };

  const progress =
    duration > 0
      ? Math.min(
          100,
          (currentTime /
            duration) *
            100
        )
      : 0;

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        volume,
        currentTime,
        duration,
        progress,
        play,
        pause,
        toggle,
        nextTrack,
        previousTrack,
        setVolume,
        seek,
        audioRef,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        preload="auto"
        playsInline
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context =
    useContext(
      AudioPlayerContext
    );

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used inside AudioPlayerProvider."
    );
  }

  return context;
}