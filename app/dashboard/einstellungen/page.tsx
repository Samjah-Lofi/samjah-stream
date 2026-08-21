"use client";

import { useEffect, useState } from "react";
import {
  Volume2,
  Bell,
  Moon,
  PlayCircle,
  Shield,
  Save,
} from "lucide-react";

type Settings = {
  autoplay: boolean;
  notifications: boolean;
  darkMode: boolean;
  volume: number;
};

const defaultSettings: Settings = {
  autoplay: true,
  notifications: true,
  darkMode: true,
  volume: 75,
};

export default function EinstellungenPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem("samjah-settings");

    if (stored) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "samjah-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen pb-40">

      <section className="px-12 pt-12">

        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          Deine Präferenzen
        </p>

        <h1 className="mt-3 text-6xl font-black text-[#F5E9D8]">
          Einstellungen
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#BFAE98]">
          Passe Samjah Music an deine persönlichen
          Vorlieben an.
        </p>

      </section>

      <section className="mt-12 max-w-5xl px-12">

        <div className="rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">

          <div className="flex items-center gap-4 border-b border-[#3A2B22] pb-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#211A17]">

              <Volume2
                size={22}
                className="text-[#D89A3C]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#F5E9D8]">
                Wiedergabe
              </h2>

              <p className="mt-1 text-[#8D7B68]">
                Einstellungen für deine Musikwiedergabe.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-6">

            <div className="flex items-center justify-between gap-8 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">

              <div className="flex items-center gap-4">

                <PlayCircle
                  size={21}
                  className="text-[#D89A3C]"
                />

                <div>

                  <p className="font-semibold text-[#F5E9D8]">
                    Automatische Wiedergabe
                  </p>

                  <p className="mt-1 text-sm text-[#8D7B68]">
                    Starte eine Atmosphäre automatisch,
                    wenn du sie auswählst.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "autoplay",
                    !settings.autoplay
                  )
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  settings.autoplay
                    ? "bg-[#D89A3C]"
                    : "bg-[#3A2B22]"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-[#F5E9D8] transition ${
                    settings.autoplay
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

            <div className="rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">

              <div className="flex items-center gap-4">

                <Volume2
                  size={21}
                  className="text-[#D89A3C]"
                />

                <div>

                  <p className="font-semibold text-[#F5E9D8]">
                    Lautstärke
                  </p>

                  <p className="mt-1 text-sm text-[#8D7B68]">
                    Standardlautstärke des Players.
                  </p>

                </div>

                <span className="ml-auto font-semibold text-[#D89A3C]">
                  {settings.volume}%
                </span>

              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(event) =>
                  updateSetting(
                    "volume",
                    Number(event.target.value)
                  )
                }
                className="mt-6 w-full accent-[#D89A3C]"
              />

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">

          <div className="flex items-center gap-4 border-b border-[#3A2B22] pb-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#211A17]">

              <Bell
                size={22}
                className="text-[#D89A3C]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#F5E9D8]">
                Benachrichtigungen
              </h2>

              <p className="mt-1 text-[#8D7B68]">
                Entscheide, welche Hinweise du erhalten möchtest.
              </p>

            </div>

          </div>

          <div className="mt-8 flex items-center justify-between gap-8 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">

            <div>

              <p className="font-semibold text-[#F5E9D8]">
                Neue Atmosphären
              </p>

              <p className="mt-1 text-sm text-[#8D7B68]">
                Informiere mich über neue Musikwelten.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                updateSetting(
                  "notifications",
                  !settings.notifications
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                settings.notifications
                  ? "bg-[#D89A3C]"
                  : "bg-[#3A2B22]"
              }`}
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-[#F5E9D8] transition ${
                  settings.notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </div>

        <div className="mt-8 rounded-[28px] border border-[#3A2B22] bg-[#171311] p-8">

          <div className="flex items-center gap-4 border-b border-[#3A2B22] pb-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#211A17]">

              <Moon
                size={22}
                className="text-[#D89A3C]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#F5E9D8]">
                Darstellung
              </h2>

              <p className="mt-1 text-[#8D7B68]">
                Passe das Erscheinungsbild an.
              </p>

            </div>

          </div>

          <div className="mt-8 flex items-center justify-between gap-8 rounded-2xl border border-[#3A2B22] bg-[#0F0C0A] p-6">

            <div>

              <p className="font-semibold text-[#F5E9D8]">
                Dunkles Design
              </p>

              <p className="mt-1 text-sm text-[#8D7B68]">
                Das dunkle Samjah Design verwenden.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                updateSetting(
                  "darkMode",
                  !settings.darkMode
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                settings.darkMode
                  ? "bg-[#D89A3C]"
                  : "bg-[#3A2B22]"
              }`}
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-[#F5E9D8] transition ${
                  settings.darkMode
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </div>

        <div className="mt-8 flex items-center justify-between rounded-[28px] border border-[#3A2B22] bg-[#171311] p-6">

          <div>

            {saved ? (
              <p className="font-semibold text-[#D89A3C]">
                Einstellungen gespeichert
              </p>
            ) : (
              <p className="text-[#BFAE98]">
                Änderungen werden lokal gespeichert.
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center gap-3 rounded-2xl bg-[#D89A3C] px-7 py-4 font-bold text-[#120D09] transition hover:bg-[#E9B65A]"
          >

            <Save size={20} />

            Speichern

          </button>

        </div>

      </section>

    </main>
  );
}