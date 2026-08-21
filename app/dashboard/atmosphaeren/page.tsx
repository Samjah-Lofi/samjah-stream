"use client";

import { useMemo, useState } from "react";

import { channels } from "@/lib/channels";

import ChannelCard from "@/components/ChannelCard";

const categories = [
  "Alle",
  "LoFi",
  "Afro",
  "Lounge",
  "Relax",
  "Coffee",
  "Night",
];

export default function AtmosphaerenPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");

  const filteredChannels = useMemo(() => {
    const query = search.trim().toLowerCase();

    return channels.filter((channel) => {
      const matchesSearch =
        channel.title.toLowerCase().includes(query) ||
        channel.description.toLowerCase().includes(query) ||
        channel.tags.some((tag: string) =>
          tag.toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "Alle" ||
        channel.tags.some(
          (tag: string) =>
            tag.toLowerCase() === category.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="pb-36">
      <section className="px-12 pt-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Bibliothek
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Alle Atmosphären
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Entdecke alle verfügbaren Musikwelten für Cafés,
          Restaurants, Hotels und Arbeitsplätze.
        </p>
      </section>

      <section className="mt-10 px-12">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Atmosphäre suchen..."
          className="w-full rounded-2xl border border-[#3A2B22] bg-[#171311] px-6 py-5 text-lg text-[#F5E9D8] outline-none transition focus:border-[#D89A3C]"
        />
      </section>

      <section className="mt-8 px-12">
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 transition ${
                category === item
                  ? "bg-[#D89A3C] text-[#120D09]"
                  : "border border-[#3A2B22] bg-[#171311] text-[#BFAE98] hover:border-[#D89A3C]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12 px-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#F5E9D8]">
            {filteredChannels.length} Atmosphären
          </h2>
        </div>

        {filteredChannels.length === 0 ? (
          <div className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-16 text-center">
            <h3 className="text-3xl font-bold text-[#F5E9D8]">
              Keine Treffer
            </h3>

            <p className="mt-4 text-[#BFAE98]">
              Versuche einen anderen Suchbegriff.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}