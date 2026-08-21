"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type { Channel } from "../types/channel";

type PreviewContextType = {
  previewChannel: Channel | null;
  setPreviewChannel: (channel: Channel | null) => void;
};

const PreviewContext = createContext<PreviewContextType | null>(null);

export function PreviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [previewChannel, setPreviewChannel] =
    useState<Channel | null>(null);

  return (
    <PreviewContext.Provider
      value={{
        previewChannel,
        setPreviewChannel,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);

  if (!context) {
    throw new Error(
      "usePreview must be used inside PreviewProvider."
    );
  }

  return context;
}