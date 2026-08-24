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

type AudioPlayerContextType = {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  play: (channel?: Channel) => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
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

  const [currentChannel, setCurrentChannel] =
    useState<Channel | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [volume, setVolumeState] =
    useState(0.75);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.trace(
        "!!! AUDIO ELEMENT PAUSE EVENT !!!"
      );

      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleError = () => {
      console.error("AUDIO FEHLER:", {
        code: audio.error?.code,
        message: audio.error?.message,
        src:
          audio.currentSrc ||
          audio.src,
      });

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
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  const changeChannel = async (
    channel: Channel
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    currentChannelRef.current =
      channel;

    setCurrentChannel(channel);

    if (!channel.streamUrl) {
      return;
    }

    try {
      audio.pause();

      audio.src =
        channel.streamUrl;

      audio.volume = volume;
      audio.currentTime = 0;

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      audio.load();

      await new Promise<void>(
        (resolve) => {
          if (audio.readyState >= 2) {
            resolve();
            return;
          }

          const handleCanPlay = () => {
            audio.removeEventListener(
              "canplay",
              handleCanPlay
            );

            resolve();
          };

          audio.addEventListener(
            "canplay",
            handleCanPlay,
            {
              once: true,
            }
          );
        }
      );

      await audio.play();

      setIsPlaying(true);
    } catch (error) {
      console.error(
        "AUDIO KANALWECHSEL FEHLER:",
        error
      );

      setIsPlaying(false);
    }
  };

  const play = async (
    channel?: Channel
  ) => {
    const audio = audioRef.current;

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

    if (!target.streamUrl) {
      console.error(
        "Keine streamUrl vorhanden:",
        target
      );
      return;
    }

    const expectedUrl =
      new URL(
        target.streamUrl,
        window.location.href
      ).href;

    if (
      audio.currentSrc !==
      expectedUrl
    ) {
      await changeChannel(target);
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
    console.trace(
      "!!! AUDIO PAUSE WIRD AUFGERUFEN !!!"
    );

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