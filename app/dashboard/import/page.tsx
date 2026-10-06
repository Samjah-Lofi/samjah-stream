"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const SUPERUSER_ID = "837b76e4-db6a-4bb6-a37f-9ed7e438900e";

type Channel = { id: number; title: string; slug: string };
type ImportTrack = {
  file: File;
  catalogNumber: number | null;
  title: string;
  durationSeconds: number;
  error?: string;
};

function readAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(file);
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const duration = Number.isFinite(audio.duration) ? Math.round(audio.duration) : 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    audio.src = url;
  });
}

function parseFilename(file: File) {
  const base = file.name.replace(/\.mp3$/i, "").trim();
  const match = base.match(/^(\d+)\s*[-–—.]\s*(.+)$/);
  return {
    catalogNumber: match ? Number(match[1]) : null,
    title: (match ? match[2] : base).trim(),
  };
}

export default function ImportPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelId, setChannelId] = useState("");
  const [tracks, setTracks] = useState<ImportTrack[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      const allowed = user?.id === SUPERUSER_ID;
      setAuthorized(allowed);
      if (!allowed) return;
      const { data, error: channelError } = await supabase
        .from("channels")
        .select("id, title, slug")
        .order("id", { ascending: true });
      if (!active) return;
      if (channelError) {
        setError("Atmosphären konnten nicht geladen werden: " + channelError.message);
        return;
      }
      const list = (data ?? []) as Channel[];
      setChannels(list);
      if (list.length) setChannelId(String(list[0].id));
    };
    void init();
    return () => { active = false; };
  }, []);

  const selectedChannel = useMemo(
    () => channels.find((channel) => String(channel.id) === channelId),
    [channels, channelId],
  );

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError("");
    setMessage("");
    if (!files.length) return;
    const mp3s = files.filter((file) => file.name.toLowerCase().endsWith(".mp3"));
    if (mp3s.length !== files.length) {
      setError("Bitte ausschließlich MP3-Dateien auswählen. Nicht-MP3-Dateien wurden ignoriert.");
    }
    if (!mp3s.length) return;
    setLoadingFiles(true);
    try {
      const parsed = await Promise.all(mp3s.map(async (file) => {
        const info = parseFilename(file);
        const durationSeconds = await readAudioDuration(file);
        return {
          file,
          ...info,
          durationSeconds,
          error: !info.catalogNumber
            ? "Dateiname braucht eine Katalognummer, z. B. 131 - Tropical Memories.mp3."
            : !info.title
              ? "Titel fehlt im Dateinamen."
              : durationSeconds <= 0
                ? "MP3-Metadaten konnten nicht gelesen werden."
                : undefined,
        } satisfies ImportTrack;
      }));
      setTracks((current) => {
        const byName = new Map(current.map((track) => [track.file.name, track]));
        for (const track of parsed) byName.set(track.file.name, track);
        return Array.from(byName.values()).sort((a, b) =>
          (a.catalogNumber ?? Number.MAX_SAFE_INTEGER) - (b.catalogNumber ?? Number.MAX_SAFE_INTEGER)
        );
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  const publish = async () => {
    if (!selectedChannel || !tracks.length || publishing) return;
    setPublishing(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id !== SUPERUSER_ID) {
      setAuthorized(false);
      setPublishing(false);
      return;
    }

    try {
      const invalid = tracks.filter((track) => track.error || !track.catalogNumber || !track.title);
      if (invalid.length) throw new Error("Bitte zuerst alle markierten Dateinamen oder Metadaten korrigieren.");

      const numbers = tracks.map((track) => track.catalogNumber as number);
      if (new Set(numbers).size !== numbers.length) throw new Error("Die Auswahl enthält doppelte Katalognummern.");

      const { data: existingTracks, error: existingError } = await supabase
        .from("tracks")
        .select("catalog_number, audio_path");
      if (existingError) throw new Error("Vorhandene Tracks konnten nicht geprüft werden: " + existingError.message);

      const existingNumbers = new Set((existingTracks ?? []).map((row) => Number(row.catalog_number)));
      const existingPaths = new Set((existingTracks ?? []).map((row) => String(row.audio_path)));
      const conflicts = tracks.filter((track) =>
        existingNumbers.has(track.catalogNumber as number) || existingPaths.has(track.file.name)
      );
      if (conflicts.length) {
        throw new Error("Import gestoppt: Katalognummer oder Dateipfad existiert bereits: " +
          conflicts.map((track) => track.file.name).join(", ") +
          ". Es wurde nichts veröffentlicht.");
      }

      const { data: relations, error: relationsError } = await supabase
        .from("track_channels")
        .select("sort_order")
        .eq("channel_id", selectedChannel.id)
        .order("sort_order", { ascending: false })
        .limit(1);
      if (relationsError) throw new Error("Reihenfolge konnte nicht geprüft werden: " + relationsError.message);

      let nextOrder = (relations?.[0]?.sort_order ?? 0) + 1;
      const published: { id: number; path: string }[] = [];

      try {
        for (const track of tracks) {
          const path = track.file.name;
          const { error: uploadError } = await supabase.storage
            .from("audio")
            .upload(path, track.file, { upsert: false, contentType: "audio/mpeg" });
          if (uploadError) throw new Error("Upload für " + path + " fehlgeschlagen: " + uploadError.message);

          const { data: inserted, error: insertError } = await supabase
            .from("tracks")
            .insert({
              catalog_number: track.catalogNumber,
              title: track.title,
              duration_seconds: track.durationSeconds,
              audio_path: path,
            })
            .select("id")
            .single();
          if (insertError || !inserted) {
            await supabase.storage.from("audio").remove([path]);
            throw new Error("Track-Datensatz für " + path + " fehlgeschlagen: " + (insertError?.message ?? "keine ID erhalten"));
          }

          const { error: relationInsertError } = await supabase
            .from("track_channels")
            .insert({
              channel_id: selectedChannel.id,
              track_id: inserted.id,
              sort_order: nextOrder,
            });
          if (relationInsertError) {
            await supabase.from("tracks").delete().eq("id", inserted.id);
            await supabase.storage.from("audio").remove([path]);
            throw new Error("Atmosphären-Zuordnung für " + path + " fehlgeschlagen: " + relationInsertError.message);
          }

          published.push({ id: inserted.id, path });
          nextOrder += 1;
        }
      } catch (publishError) {
        // Undo only records created during this batch; never touch pre-existing tracks.
        for (const item of published.reverse()) {
          await supabase.from("track_channels").delete().eq("channel_id", selectedChannel.id).eq("track_id", item.id);
          await supabase.from("tracks").delete().eq("id", item.id);
          await supabase.storage.from("audio").remove([item.path]);
        }
        throw publishError;
      }

      setMessage(tracks.length + " Track(s) wurden " + selectedChannel.title + " hinzugefügt. Reihenfolge: " +
        (nextOrder - tracks.length) + "–" + (nextOrder - 1) + ".");
      setTracks([]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Import fehlgeschlagen.");
    } finally {
      setPublishing(false);
    }
  };

  if (authorized === null) {
    return <main className="min-h-screen p-10 text-[#F5E9D8]">Importbereich wird geprüft …</main>;
  }
  if (!authorized) {
    return <main className="min-h-screen p-10 text-[#F5E9D8]"><h1 className="text-3xl font-bold">Kein Zugriff</h1><p className="mt-3 text-[#BFAE98]">Dieser Importbereich ist nur für den Projektadministrator freigegeben.</p></main>;
  }

  return (
    <main className="min-h-screen max-w-6xl px-6 py-10 pb-40 text-[#F5E9D8] md:px-12">
      <p className="text-sm uppercase tracking-[0.3em] text-[#D89A3C]">Administration</p>
      <h1 className="mt-3 text-4xl font-black md:text-5xl">MP3-Import</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[#BFAE98]">
        Mehrere MP3s auswählen, Ziel-Atmosphäre prüfen und erst danach veröffentlichen.
        Bestehende Katalognummern und Dateipfade werden vor dem Upload auf Konflikte geprüft.
      </p>

      <section className="mt-8 rounded-3xl border border-[#3A2B22] bg-[#171311] p-6 md:p-8">
        <label className="mb-2 block font-semibold" htmlFor="channel">Atmosphäre</label>
        <select id="channel" value={channelId} onChange={(event) => setChannelId(event.target.value)}
          className="w-full rounded-xl border border-[#3A2B22] bg-[#0F0C0A] p-4 text-[#F5E9D8]">
          {channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.title}</option>)}
        </select>
        <label className="mt-6 mb-2 block font-semibold" htmlFor="mp3s">MP3-Dateien auswählen</label>
        <input id="mp3s" type="file" accept=".mp3,audio/mpeg" multiple onChange={onFiles}
          className="block w-full rounded-xl border border-dashed border-[#6F5032] bg-[#0F0C0A] p-4 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#D89A3C] file:px-4 file:py-2 file:font-bold file:text-[#120D09]" />
        <p className="mt-3 text-sm text-[#8D7B68]">Dateinamen bitte im Format „131 - Tropical Memories.mp3“. Neue Titel werden an das Ende der ausgewählten Atmosphäre angehängt.</p>
      </section>

      {loadingFiles && <p className="mt-6 text-[#D89A3C]">MP3-Metadaten werden gelesen …</p>}
      {error && <div role="alert" className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-200">{error}</div>}
      {message && <div role="status" className="mt-6 rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-emerald-200">{message}</div>}

      {tracks.length > 0 && (
        <section className="mt-8 rounded-3xl border border-[#3A2B22] bg-[#171311] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 className="text-2xl font-bold">Import-Vorschau</h2><p className="mt-2 text-sm text-[#BFAE98]">{tracks.length} Datei(en) · Ziel: {selectedChannel?.title ?? "—"}</p></div>
            <button type="button" onClick={() => setTracks([])} disabled={publishing} className="rounded-xl border border-[#3A2B22] px-4 py-2 text-sm hover:bg-[#211A17]">Auswahl leeren</button>
          </div>
          <div className="mt-6 space-y-3">
            {tracks.map((track) => (
              <div key={track.file.name} className="grid gap-2 rounded-xl border border-[#3A2B22] bg-[#0F0C0A] p-4 md:grid-cols-[90px_1fr_100px]">
                <div className="font-mono text-[#D89A3C]">{track.catalogNumber ?? "—"}</div>
                <div className="min-w-0"><p className="break-words font-semibold">{track.title || track.file.name}</p><p className="mt-1 break-all text-xs text-[#8D7B68]">{track.file.name} · {(track.file.size / 1024 / 1024).toFixed(2)} MB</p>{track.error && <p className="mt-2 text-sm text-red-300">{track.error}</p>}</div>
                <div className="text-sm text-[#BFAE98]">{track.durationSeconds ? Math.floor(track.durationSeconds / 60) + ":" + String(track.durationSeconds % 60).padStart(2, "0") : "Länge unbekannt"}</div>
              </div>
            ))}
          </div>
          <button type="button" onClick={publish} disabled={publishing || loadingFiles || !selectedChannel || tracks.some((track) => !!track.error)}
            className="mt-6 w-full rounded-xl bg-[#D89A3C] px-6 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A] disabled:cursor-not-allowed disabled:opacity-50">
            {publishing ? "Import läuft …" : "Prüfen und veröffentlichen"}
          </button>
          <p className="mt-3 text-xs leading-5 text-[#8D7B68]">Vor dem Upload werden vorhandene Katalognummern und Pfade geprüft. Bei einem Fehler versucht der Import, nur die in diesem Durchlauf neu angelegten Einträge zurückzunehmen.</p>
        </section>
      )}
    </main>
  );
}
