export default function Features() {
    const features = [
      {
        title: "Werbefrei",
        description:
          "Keine Unterbrechungen. Nur hochwertige Musik für deine Gäste und Mitarbeiter.",
        icon: "♫",
      },
      {
        title: "24/7 verfügbar",
        description:
          "Deine Atmosphäre läuft den ganzen Tag – zuverlässig und ohne Aufwand.",
        icon: "◉",
      },
      {
        title: "Für Unternehmen",
        description:
          "Perfekt für Cafés, Restaurants, Hotels, Büros und moderne Arbeitsplätze.",
        icon: "▣",
      },
      {
        title: "Kuratierte Musik",
        description:
          "Jede Atmosphäre wird sorgfältig zusammengestellt und kontinuierlich erweitert.",
        icon: "✦",
      },
    ];
  
    return (
      <section
        id="features"
        className="mx-auto max-w-7xl px-8 py-28"
      >
        <div className="text-center">
  
          <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            Warum Samjah?
          </p>
  
          <h2 className="mt-4 text-5xl font-black text-[#F5E9D8]">
            Musik, die Räume verändert.
          </h2>
  
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#BFAE98]">
            Entwickelt für Unternehmen, die Wert auf eine angenehme Atmosphäre
            legen und ihren Gästen oder Mitarbeitern ein hochwertiges Klangerlebnis
            bieten möchten.
          </p>
  
        </div>
  
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
  
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-8 transition duration-300 hover:-translate-y-2 hover:border-[#D89A3C]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D89A3C]/10 text-3xl text-[#D89A3C]">
                {feature.icon}
              </div>
  
              <h3 className="mt-8 text-2xl font-bold text-[#F5E9D8]">
                {feature.title}
              </h3>
  
              <p className="mt-5 leading-8 text-[#BFAE98]">
                {feature.description}
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }