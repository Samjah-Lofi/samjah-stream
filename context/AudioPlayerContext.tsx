"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePlayer } from "./PlayerContext";

type AudioPlayerContextType = {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  play: () => Promise<void>;
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
  const { currentChannel } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
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
      const error = audio.error;

      console.error("AUDIO FEHLER:", {
        code: error?.code,
        message: error?.message,
        src: audio.currentSrc || audio.src,
      });

      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
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
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
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
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!currentChannel) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      return;
    }

    const streamUrl = currentChannel.streamUrl;

    if (!streamUrl) {
      console.error(
        "Keine streamUrl für Atmosphäre vorhanden:",
        currentChannel
      );

      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      return;
    }

    console.log(
      "AUDIO STREAM WIRD GELADEN:",
      streamUrl
    );

    audio.pause();

    audio.src = streamUrl;
    audio.volume = volume;
    audio.currentTime = 0;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    audio.load();
  }, [currentChannel, volume]);

  const play = async () => {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio Element nicht verfügbar.");
      return;
    }

    if (!currentChannel) {
      console.error("Kein Kanal ausgewählt.");
      return;
    }

    if (!currentChannel.streamUrl) {
      console.error(
        "Der aktuelle Kanal besitzt keine streamUrl:",
        currentChannel
      );
      return;
    }

    try {
      if (
        audio.src !==
        new URL(
          currentChannel.streamUrl,
          window.location.href
        ).href
      ) {
        console.log(
          "Audio URL setzen:",
          currentChannel.streamUrl
        );

        audio.src = currentChannel.streamUrl;
        audio.load();
      }

      audio.volume = volume;

      console.log(
        "AUDIO PLAY:",
        audio.currentSrc || audio.src
      );

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
    const audio = audioRef.current;

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

  const setVolume = (value: number) => {
    const nextVolume = Math.min(
      1,
      Math.max(0, value)
    );

    setVolumeState(nextVolume);

    const audio = audioRef.current;

    if (audio) {
      audio.volume = nextVolume;
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const maxTime =
      Number.isFinite(audio.duration) &&
      audio.duration > 0
        ? audio.duration
        : duration;

    const nextTime = Math.min(
      Math.max(0, time),
      maxTime || 0
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progress =
    duration > 0
      ? Math.min(
          100,
          (currentTime / duration) * 100
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
  const context = useContext(
    AudioPlayerContext
  );

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used inside AudioPlayerProvider."
    );
  }

  return context;
}