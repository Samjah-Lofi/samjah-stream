
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import type { Channel } from "../types/channel";
import { createClient } from "../lib/supabase/client";
import { usePlayer } from "./PlayerContext";

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
  audioRef: RefObject<HTMLAudioElement | null>;
};

const AudioPlayerContext =
  createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentChannelRef = useRef<Channel | null>(null);
  const tracksRef = useRef<Track[]>([]);
  const trackIndexRef = useRef(0);

  // Verhindert parallele Trackwechsel.
  const advancingRef = useRef(false);

  // Verhindert, dass ältere Ladeanfragen neuere Wiedergaben überschreiben.
  const playRequestRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { setCurrentChannel } = usePlayer();
  const supabase = createClient();

  const getTrackUrl = async (
    audioPath: string
  ): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("audio")
      .createSignedUrl(audioPath, 3600);

    if (error) {
      console.error("SIGNED URL FEHLER:", error);
      return null;
    }

    return data.signedUrl;
  };

  const playTrack = async (
    track: Track,
    shouldPlay = true
  ): Promise<void> => {
    console.trace("PLAY_TRACK AUFRUF:", {
      catalog: track.catalog_number,
      id: track.id,
      title: track.title,
      shouldPlay,
      currentTimeBefore: audioRef.current?.currentTime,
      currentSrcBefore: audioRef.current?.currentSrc,
      trackIndex: trackIndexRef.current,
      channel: currentChannelRef.current?.title,
    });

    const audio = audioRef.current;

    if (!audio) return;

    const requestId = ++playRequestRef.current;
    const url = await getTrackUrl(track.audio_path);

    if (requestId !== playRequestRef.current) return;

    if (!url) {
      console.error("TRACK OHNE AUDIO-URL:", {
        catalog: track.catalog_number,
        id: track.id,
        title: track.title,
        audio_path: track.audio_path,
      });
      setIsPlaying(false);
      return;
    }

    console.log("TRACK AUDIO-PFAD:", {
      catalog: track.catalog_number,
      id: track.id,
      title: track.title,
      audio_path: track.audio_path,
    });

    try {
      audio.pause();
      audio.src = url;
      audio.volume = volume;
      audio.currentTime = 0;

      setCurrentTime(0);
      setDuration(track.duration_seconds || 0);
      setIsPlaying(false);

      // Listener vor load() registrieren, damit ein sehr schnelles canplay
      // nicht zwischen load() und addEventListener verloren geht.
      await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          audio.removeEventListener("canplay", handleCanPlay);
          audio.removeEventListener("error", handleError);
        };

        const handleCanPlay = () => {
          cleanup();
          resolve();
        };

        const handleError = () => {
          cleanup();
          reject(new Error("Audio konnte nicht geladen werden."));
        };

        audio.addEventListener("canplay", handleCanPlay, {
          once: true,
        });
        audio.addEventListener("error", handleError, {
          once: true,
        });
        audio.load();
      });

      // Während des Ladens könnte ein anderer Track angefordert worden sein.
      if (requestId !== playRequestRef.current) return;

      if (shouldPlay) {
        await audio.play();

        if (requestId === playRequestRef.current) {
          setIsPlaying(true);
          console.log("TRACK WIEDERGABE GESTARTET:", {
            catalog: track.catalog_number,
            id: track.id,
            title: track.title,
            audio_path: track.audio_path,
            currentSrc: audio.currentSrc,
            duration: audio.duration,
            paused: audio.paused,
          });
        }
      }
    } catch (error) {
      if (requestId === playRequestRef.current) {
        console.error("AUDIO TRACK FEHLER:", error);
        setIsPlaying(false);
      }
    }
  };

  const loadChannelTracks = async (
    channel: Channel
  ): Promise<Track[]> => {
    const { data: relationData, error: relationError } =
      await supabase
        .from("track_channels")
        .select("sort_order, track_id")
        .eq("channel_id", channel.id)
        .order("sort_order", { ascending: true });

    if (relationError) {
      console.error("TRACK CHANNELS LADEN FEHLER:", relationError);
      return [];
    }

    const relations = (relationData ?? []) as TrackChannelRow[];

    if (!relations.length) return [];

    const trackIds = relations.map((item) => item.track_id);

    const { data: trackData, error: trackError } = await supabase
      .from("tracks")
      .select(
        "id, catalog_number, title, duration_seconds, audio_path"
      )
      .in("id", trackIds);

    if (trackError) {
      console.error("TRACKS LADEN FEHLER:", trackError);
      return [];
    }

    const rows = (trackData ?? []) as TrackRow[];
    const trackMap = new Map<number, Track>();

    for (const row of rows) {
      trackMap.set(row.id, {
        id: row.id,
        catalog_number: row.catalog_number,
        title: row.title,
        duration_seconds: row.duration_seconds,
        audio_path: row.audio_path,
      });
    }

    // Die Reihenfolge kommt aus track_channels.sort_order.
    // Jeder Eintrag wird entsprechend seiner Zuordnung übernommen.
    const tracks: Track[] = [];

    for (const relation of relations) {
      const track = trackMap.get(relation.track_id);

      if (track) {
        tracks.push(track);
      }
    }

    console.log(
      `CHANNEL "${channel.title}": ${tracks.length} TRACKS GELADEN`,
      tracks.map((track, index) => ({
        position: index + 1,
        catalog: track.catalog_number,
        id: track.id,
        title: track.title,
        audio_path: track.audio_path,
      }))
    );

    return tracks;
  };

  const loadChannels = async (): Promise<Channel[]> => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("CHANNELS LADEN FEHLER:", error);
      return [];
    }

    return (data ?? []).map((channel) => ({
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
    }));
  };

  const nextChannel = async (): Promise<void> => {
    const currentChannel = currentChannelRef.current;

    if (!currentChannel) {
      console.log("NEXT CHANNEL: KEIN AKTUELLER CHANNEL");
      return;
    }

    const availableChannels = await loadChannels();

    if (!availableChannels.length) {
      console.error("NEXT CHANNEL: KEINE CHANNELS GELADEN");
      setIsPlaying(false);
      return;
    }

    const currentChannelIndex = availableChannels.findIndex(
      (channel) => channel.id === currentChannel.id
    );

    if (currentChannelIndex === -1) {
      console.error(
        "AKTUELLER CHANNEL NICHT IN SUPABASE GEFUNDEN:",
        currentChannel
      );
      setIsPlaying(false);
      return;
    }

    const nextChannelIndex =
      (currentChannelIndex + 1) % availableChannels.length;

    const channel = availableChannels[nextChannelIndex];

    console.log(
      `CHANNEL ENDE: "${currentChannel.title}" → "${channel.title}"`
    );

    const tracks = await loadChannelTracks(channel);

    if (!tracks.length) {
      console.error(
        `Keine Tracks für nächsten Channel gefunden: ${channel.title}`
      );
      setIsPlaying(false);
      return;
    }

    currentChannelRef.current = channel;
    setCurrentChannel(channel);
    tracksRef.current = tracks;
    trackIndexRef.current = 0;

    console.log(
      "NEXT CHANNEL GELADEN:",
      channel.title,
      "TRACKS:",
      tracks.length
    );

    await playTrack(tracks[0], true);
  };

  const nextTrack = async (): Promise<void> => {
    // Nur ein Trackwechsel darf gleichzeitig laufen.
    if (advancingRef.current) {
      console.log("NEXT TRACK ÜBERSPRUNGEN: WECHSEL LÄUFT BEREITS");
      return;
    }

    advancingRef.current = true;

    try {
      const tracks = tracksRef.current;

      console.log(
        "NEXT TRACK:",
        currentChannelRef.current?.title,
        "INDEX:",
        trackIndexRef.current,
        "VON:",
        tracks.length
      );

      if (!tracks.length) {
        console.log("NEXT TRACK: KEINE TRACKS GELADEN");
        return;
      }

      if (trackIndexRef.current >= tracks.length - 1) {
        console.log(
          "LETZTER TRACK ERREICHT:",
          currentChannelRef.current?.title
        );

        await nextChannel();
        return;
      }

      trackIndexRef.current += 1;

      const next = tracks[trackIndexRef.current];
      console.log("NÄCHSTER TRACK WIRD GESTARTET:", {
        position: trackIndexRef.current + 1,
        total: tracks.length,
        catalog: next.catalog_number,
        id: next.id,
        title: next.title,
        audio_path: next.audio_path,
      });

      await playTrack(next, true);
    } finally {
      advancingRef.current = false;
    }
  };

  const previousTrack = async (): Promise<void> => {
    if (advancingRef.current) {
      console.log("PREVIOUS TRACK ÜBERSPRUNGEN: WECHSEL LÄUFT BEREITS");
      return;
    }

    advancingRef.current = true;

    try {
      const tracks = tracksRef.current;

      if (!tracks.length) return;

      trackIndexRef.current =
        trackIndexRef.current <= 0
          ? tracks.length - 1
          : trackIndexRef.current - 1;

      await playTrack(tracks[trackIndexRef.current], true);
    } finally {
      advancingRef.current = false;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = async () => {
      console.log("AUDIO ENDED EVENT:", {
        currentTime: audio.currentTime,
        duration: audio.duration,
        ended: audio.ended,
        catalogIndex: trackIndexRef.current,
        currentTrack: tracksRef.current[trackIndexRef.current]?.catalog_number,
        channel: currentChannelRef.current?.title,
        timestamp: new Date().toISOString(),
      });
      await nextTrack();
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

      // Diagnose: tatsächliches Audio-Ende mit Browser-Zeit erfassen.
      if (
        Number.isFinite(audio.duration) &&
        audio.duration > 0 &&
        audio.duration - audio.currentTime <= 2 &&
        audio.duration - audio.currentTime >= 0
      ) {
        console.log("AUDIO NAHE DATEIENDE:", {
          currentTime: audio.currentTime,
          duration: audio.duration,
          remaining: audio.duration - audio.currentTime,
          paused: audio.paused,
          ended: audio.ended,
          currentSrc: audio.currentSrc,
        });
      }
    };

    const handleError = () => {
      console.error("AUDIO FEHLER:", {
        code: audio.error?.code,
        message: audio.error?.message,
        src: audio.currentSrc || audio.src,
      });

      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const changeChannel = async (channel: Channel): Promise<void> => {
    currentChannelRef.current = channel;
    setCurrentChannel(channel);

    const tracks = await loadChannelTracks(channel);

    if (!tracks.length) {
      console.error(
        "Keine Tracks für Atmosphäre gefunden:",
        channel.title
      );
      setIsPlaying(false);
      return;
    }

    tracksRef.current = tracks;
    trackIndexRef.current = 0;

    await playTrack(tracks[0], true);
  };

  const play = async (channel?: Channel): Promise<void> => {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio Element nicht verfügbar.");
      return;
    }

    const target = channel ?? currentChannelRef.current;

    if (!target) {
      console.error("Kein Kanal ausgewählt.");
      return;
    }

    if (currentChannelRef.current?.id !== target.id) {
      await changeChannel(target);
      return;
    }

    if (!tracksRef.current.length) {
      await changeChannel(target);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("AUDIO PLAY FEHLER:", error);
      setIsPlaying(false);
    }
  };

  const pause = (): void => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const toggle = async (): Promise<void> => {
    if (isPlaying) {
      pause();
      return;
    }

    await play();
  };

  const setVolume = (value: number): void => {
    const nextVolume = Math.min(1, Math.max(0, value));

    setVolumeState(nextVolume);

    const audio = audioRef.current;

    if (audio) {
      audio.volume = nextVolume;
    }
  };

  const seek = (time: number): void => {
    const audio = audioRef.current;

    if (!audio) return;

    const maxTime =
      Number.isFinite(audio.duration) && audio.duration > 0
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
        nextTrack,
        previousTrack,
        setVolume,
        seek,
        audioRef,
      }}
    >
      {children}

      <audio ref={audioRef} preload="auto" playsInline />
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
