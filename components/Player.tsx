"use client";

import TrackInfo from "./player/TrackInfo";
import PlayerControls from "./player/PlayerControls";
import ProgressBar from "./player/ProgressBar";
import VolumeControl from "./player/VolumeControl";

export default function Player() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#3A2B22] bg-[#0B0908]/95 backdrop-blur-2xl md:left-72">
      <div className="flex min-h-24 flex-col gap-3 px-4 py-3 md:h-32 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">

        <div className="min-w-0 md:w-1/4">
          <TrackInfo />
        </div>

        <div className="flex flex-1 flex-col items-center px-0 md:px-12">
          <PlayerControls />

          <ProgressBar />
        </div>

        <div className="hidden md:block md:w-1/4">
          <VolumeControl />
        </div>

      </div>
    </footer>
  );
}