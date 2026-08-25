"use client";

import TrackInfo from "./player/TrackInfo";
import PlayerControls from "./player/PlayerControls";
import ProgressBar from "./player/ProgressBar";
import VolumeControl from "./player/VolumeControl";

export default function Player() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#3A2B22] bg-[#0B0908]/95 backdrop-blur-2xl md:left-72">
      <div className="relative h-20 px-3 md:h-32 md:px-8">
        <div className="flex h-full items-center pb-2 md:pb-0">
          <div className="min-w-0 flex-1 md:w-1/4 md:flex-none">
            <TrackInfo />
          </div>

          <div className="shrink-0 md:flex-1 md:px-12">
            <PlayerControls />
          </div>

          <div className="hidden md:block md:w-1/4">
            <VolumeControl />
          </div>
        </div>

        <div className="absolute bottom-0 left-3 right-3 md:hidden">
          <ProgressBar />
        </div>

        <div className="hidden md:block md:absolute md:bottom-3 md:left-1/4 md:right-1/4 md:px-12">
          <ProgressBar />
        </div>
      </div>
    </footer>
  );
}