"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
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

    if (!audio || !currentChannel) {
      return;
    }

    const wasPlaying = !audio.paused;

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    audio.src = currentChannel.streamUrl;
    audio.volume = volume;
    audio.load();

    if (wasPlaying) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio konnte nicht gestartet werden:", error);
          setIsPlaying(false);
        });
    }
  }, [currentChannel]);

  const play = async () => {
    const audio = audioRef.current;

    if (!audio || !currentChannel) {
      return;
    }

    try {
      if (audio.src !== new URL(currentChannel.streamUrl, window.location.href).href) {
        audio.src = currentChannel.streamUrl;
        audio.load();
      }

      audio.volume = volume;

      await audio.play();

      setIsPlaying(true);
    } catch (error) {
      console.error("Audio konnte nicht gestartet werden:", error);
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
    } else {
      await play();
    }
  };

  const setVolume = (value: number) => {
    const nextVolume = Math.min(1, Math.max(0, value));

    setVolumeState(nextVolume);

    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.min(
      Math.max(0, time),
      audio.duration || duration || 0
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration) ? audio.duration : 0
      );
    };

    const onDurationChange = () => {
      setDuration(
        Number.isFinite(audio.duration) ? audio.duration : 0
      );
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onError = () => {
      console.error(
        "Fehler beim Laden der Audiodatei:",
        audio.error
      );

      setIsPlaying(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener(
      "loadedmetadata",
      onLoadedMetadata
    );
    audio.addEventListener(
      "durationchange",
      onDurationChange
    );
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );
      audio.removeEventListener(
        "durationchange",
        onDurationChange
      );
      audio.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const progress =
    duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
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
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used inside AudioPlayerProvider."
    );
  }

  return context;
}