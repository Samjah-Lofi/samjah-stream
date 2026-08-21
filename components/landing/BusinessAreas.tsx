export default function BusinessAreas() {
    const areas = [
      {
        emoji: "☕",
        title: "Cafés",
        text: "Entspannte LoFi Beats für Frühstück, Kaffee und gemütliche Nachmittage.",
      },
      {
        emoji: "🍽️",
        title: "Restaurants",
        text: "Die passende Musik für Lunch, Dinner und ein angenehmes Ambiente.",
      },
      {
        emoji: "🏨",
        title: "Hotels",
        text: "Musik für Lobby, Frühstücksbereich und Aufenthaltsräume.",
      },
      {
        emoji: "💻",
        title: "Büros",
        text: "LoFi und Afro LoFi für konzentriertes Arbeiten ohne Ablenkung.",
      },
    ];
  
    return (
      <section className="mx-auto max-w-7xl px-8 py-28">
  
        <div className="text-center">
  
          <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            Einsatzbereiche
          </p>
  
          <h2 className="mt-4 text-5xl font-black text-[#F5E9D8]">
            Wo kommt Samjah zum Einsatz?
          </h2>
  
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#BFAE98]">
            Jede Musikwelt wurde entwickelt, um Gästen und Mitarbeitern
            eine angenehme Atmosphäre zu schaffen.
          </p>
  
        </div>
  
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
  
          {areas.map((area) => (
            <div
              key={area.title}
              className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-8 transition duration-300 hover:-translate-y-2 hover:border-[#D89A3C]"
            >
  
              <div className="text-5xl">
                {area.emoji}
              </div>
  
              <h3 className="mt-8 text-2xl font-bold text-[#F5E9D8]">
                {area.title}
              </h3>
  
              <p className="mt-5 leading-8 text-[#BFAE98]">
                {area.text}
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }