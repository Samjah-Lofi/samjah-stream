export default function HowItWorks() {
    const steps = [
      {
        number: "01",
        title: "Betrieb auswählen",
        text: "Wähle die Musikwelten aus, die zu deinem Café, Restaurant, Hotel oder Büro passen.",
      },
      {
        number: "02",
        title: "Musik starten",
        text: "Ein Klick genügt und die passende Atmosphäre läuft sofort über deine Lautsprecher.",
      },
      {
        number: "03",
        title: "Den Tag genießen",
        text: "Werbefreie LoFi und Afro LoFi Musik begleitet deine Gäste und Mitarbeiter den ganzen Tag.",
      },
    ];
  
    return (
      <section className="mx-auto max-w-7xl px-8 py-28">
  
        <div className="text-center">
  
          <p className="text-sm uppercase tracking-[0.35em] text-[#D89A3C]">
            So funktioniert's
          </p>
  
          <h2 className="mt-4 text-5xl font-black text-[#F5E9D8]">
            In weniger als einer Minute startklar.
          </h2>
  
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#BFAE98]">
            Keine komplizierte Einrichtung. Einfach anmelden,
            Musik auswählen und die passende Atmosphäre schaffen.
          </p>
  
        </div>
  
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
  
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-[#3A2B22] bg-[#171311] p-10 transition duration-300 hover:-translate-y-2 hover:border-[#D89A3C]"
            >
  
              <div className="text-6xl font-black text-[#D89A3C]/30">
                {step.number}
              </div>
  
              <h3 className="mt-8 text-3xl font-bold text-[#F5E9D8]">
                {step.title}
              </h3>
  
              <p className="mt-6 leading-8 text-[#BFAE98]">
                {step.text}
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }