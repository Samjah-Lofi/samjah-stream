"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { usePreview } from "../context/PreviewContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";

import type { Channel } from "../types/channel";

import Card from "./ui/Card";
import Badge from "./ui/Badge";

type Props = {
  channel: Channel;
};

export default function ChannelCard({ channel }: Props) {
  const { currentChannel, setCurrentChannel } = usePlayer();

  const { setPreviewChannel } = usePreview();

  const { play } = useAudioPlayer();

  const isActive = currentChannel?.id === channel.id;

  const handleClick = () => {
    setCurrentChannel(channel);

    setTimeout(() => {
      play();
    }, 150);
  };

  return (
    <Link
      href={`/dashboard/atmosphaeren/${channel.slug}`}
      onClick={handleClick}
      onMouseEnter={() => setPreviewChannel(channel)}
      onMouseLeave={() => setPreviewChannel(null)}
      className="group block"
    >
      <Card
        active={isActive}
        className="overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={channel.image}
            alt={channel.title}
            fill
            sizes="360px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-[#0B090820] to-transparent transition duration-500 group-hover:from-[#0B0908]/95" />

          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,164,65,.18),transparent_70%)]" />
          </div>

          <div className="absolute left-5 top-5">
            <Badge>ON AIR</Badge>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
                isActive
                  ? "scale-100 bg-[#D9A441] shadow-[0_0_40px_rgba(217,164,65,.45)]"
                  : "scale-75 bg-[#D9A441] opacity-0 shadow-[0_0_30px_rgba(217,164,65,.35)] group-hover:scale-100 group-hover:opacity-100"
              }`}
            >
              <Play
                size={34}
                fill="currentColor"
                className="ml-1 text-[#120D09]"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3
            className={`text-2xl font-bold transition-colors duration-300 ${
              isActive
                ? "text-[#D9A441]"
                : "text-[#F5E9D8] group-hover:text-[#D9A441]"
            }`}
          >
            {channel.title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {channel.tags.map((tag) => (
              <Badge key={tag} variant="dark">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mt-5 leading-7 text-[#BFAE98]">
            {channel.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-[#2A201A] pt-5">
            <span
              className={`text-sm transition ${
                isActive
                  ? "font-semibold text-[#D9A441]"
                  : "text-[#8D7B68]"
              }`}
            >
              {isActive ? "● Jetzt aktiv" : "Details ansehen"}
            </span>

            <span className="text-2xl text-[#D9A441] transition-all duration-300 group-hover:translate-x-2">
              →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}