import { createClient } from "./server";
import type { Channel } from "../../types/channel";

export async function getChannels(): Promise<Channel[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Channels:", error);
    return [];
  }

  return data as Channel[];
}