"use client";

import { useRef } from "react";
import ChannelCard from "./ChannelCard";
import type { Channel } from "../types/channel";

type Props = {
  title: string;
  channels: Channel[];
};

export default function ChannelRow({ title, channels }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  if (channels.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#F5E9D8]">
          {title}
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A2B22] bg-[#171311] text-[#F5E9D8] transition hover:border-[#D89A3C] hover:text-[#D89A3C]"
          >
            ←
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A2B22] bg-[#171311] text-[#F5E9D8] transition hover:border-[#D89A3C] hover:text-[#D89A3C]"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
      >
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="min-w-[360px] max-w-[360px] flex-none"
          >
            <ChannelCard channel={channel} />
          </div>
        ))}
      </div>
    </section>
  );
}