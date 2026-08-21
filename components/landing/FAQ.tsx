"use client";

import { useState } from "react";

const questions = [
  {
    question: "Für wen ist Samjah geeignet?",
    answer:
      "Samjah wurde für Cafés, Restaurants, Hotels, Büros und andere Unternehmen entwickelt, die eine angenehme Hintergrundmusik suchen.",
  },
  {
    question: "Welche Musik bietet Samjah an?",
    answer:
      "Der Schwerpunkt liegt auf hochwertigem LoFi und Afro LoFi. Neue Musikwelten werden regelmäßig ergänzt.",
  },
  {
    question: "Kann ich Samjah sofort nutzen?",
    answer:
      "Ja. Nach der Registrierung erhältst du sofort Zugriff auf alle verfügbaren Musikwelten.",
  },
  {
    question: "Gibt es Werbung?",
    answer:
      "Nein. Die Musik läuft ohne Werbeunterbrechungen.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto max-w-5xl px-8 py-28"
    >
      <div className="text-center">

        <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
          FAQ
        </p>

        <h2 className="mt-4 text-5xl font-black text-[#F5E9D8]">
          Häufige Fragen
        </h2>

      </div>

      <div className="mt-16 space-y-5">

        {questions.map((item, index) => (
          <div
            key={item.question}
            className="overflow-hidden rounded-3xl border border-[#3A2B22] bg-[#171311]"
          >

            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="flex w-full items-center justify-between px-8 py-6 text-left"
            >

              <span className="text-xl font-semibold text-[#F5E9D8]">
                {item.question}
              </span>

              <span className="text-2xl text-[#D89A3C]">
                {open === index ? "−" : "+"}
              </span>

            </button>

            {open === index && (

              <div className="border-t border-[#2A201A] px-8 py-6 leading-8 text-[#BFAE98]">

                {item.answer}

              </div>

            )}

          </div>
        ))}

      </div>

    </section>
  );
}