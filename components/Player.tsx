"use client";

import TrackInfo from "./player/TrackInfo";
import PlayerControls from "./player/PlayerControls";
import ProgressBar from "./player/ProgressBar";
import VolumeControl from "./player/VolumeControl";

export default function Player() {
  return (
    <footer className="fixed bottom-0 left-72 right-0 border-t border-[#3A2B22] bg-[#0B0908]/95 backdrop-blur-2xl">

      <div className="flex h-32 items-center justify-between px-8">

        {/* Linke Seite */}

        <TrackInfo />

        {/* Mitte */}

        <div className="flex flex-1 flex-col items-center px-12">

          <PlayerControls />

          <ProgressBar />

        </div>

        {/* Rechte Seite */}

        <VolumeControl />

      </div>

    </footer>
  );
}