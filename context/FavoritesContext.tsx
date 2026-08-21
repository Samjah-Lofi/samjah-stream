"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";

type FavoritesContextType = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
};

const FavoritesContext =
  createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("channel_id")
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Favoriten konnten nicht geladen werden:",
          error
        );

        setFavorites([]);
        setLoading(false);
        return;
      }

      setFavorites(
        (data ?? []).map((item) => item.channel_id)
      );

      setLoading(false);
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (id: number) => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error(
        "Favorit kann nicht gespeichert werden: kein Benutzer eingeloggt."
      );

      return;
    }

    const alreadyFavorite = favorites.includes(id);

    if (alreadyFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("channel_id", id);

      if (error) {
        console.error(
          "Favorit konnte nicht entfernt werden:",
          error
        );

        return;
      }

      setFavorites((current) =>
        current.filter((item) => item !== id)
      );

      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        channel_id: id,
      });

    if (error) {
      console.error(
        "Favorit konnte nicht gespeichert werden:",
        error
      );

      return;
    }

    setFavorites((current) => [
      ...current,
      id,
    ]);
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider."
    );
  }

  return context;
}