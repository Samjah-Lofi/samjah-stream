export default function HeroPlayer() {
    return (
      <div className="relative">
  
        {/* Glow */}
  
        <div className="absolute -inset-12 rounded-[60px] bg-[#D89A3C]/20 blur-[90px]" />
  
        {/* Karte */}
  
        <div className="relative w-[450px] overflow-hidden rounded-[42px] border border-[#D89A3C]/20 bg-[#171311]/80 p-10 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl">
  
          {/* Lichtreflex */}
  
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
  
          {/* Header */}
  
          <div className="relative flex items-center justify-between">
  
            <div>
  
              <div className="flex items-center gap-3">
  
                <span className="h-3 w-3 animate-pulse rounded-full bg-[#D89A3C]" />
  
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D89A3C]">
                  LIVE
                </p>
  
              </div>
  
              <h3 className="mt-4 text-3xl font-black text-[#F5E9D8]">
                Coffee Morning
              </h3>
  
              <p className="mt-2 text-[#BFAE98]">
                LoFi • Afro LoFi
              </p>
  
            </div>
  
            <div className="rounded-full border border-[#D89A3C]/20 bg-[#211A17] px-4 py-2 text-sm text-[#D89A3C]">
              24/7
            </div>
  
          </div>
  
          {/* Cover */}
  
          <div className="relative mt-10 flex justify-center">
  
            <div className="absolute h-64 w-64 rounded-full bg-[#D89A3C]/20 blur-3xl" />
  
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-[12px] border-[#2B221D] bg-gradient-to-br from-[#43352C] to-[#171311] shadow-[0_20px_60px_rgba(0,0,0,.45)]">
  
              <div className="absolute h-5 w-5 rounded-full bg-[#D89A3C]" />
  
              <button className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-[#D89A3C] text-4xl text-[#120D09] transition duration-300 hover:scale-110">
                ▶
              </button>
  
            </div>
  
          </div>
  
          {/* Progress */}
  
          <div className="mt-12">
  
            <div className="mb-3 flex justify-between text-sm text-[#BFAE98]">
  
              <span>01:26</span>
  
              <span>03:42</span>
  
            </div>
  
            <div className="h-2 overflow-hidden rounded-full bg-[#2A201A]">
  
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#D89A3C] to-[#F3C46A]" />
  
            </div>
  
          </div>
  
          {/* Footer */}
  
          <div className="mt-10 flex items-center justify-between border-t border-[#2A201A] pt-8">
  
            <div>
  
              <p className="text-sm uppercase tracking-[0.3em] text-[#8D7B68]">
                NOW PLAYING
              </p>
  
              <h4 className="mt-2 text-xl font-bold text-[#F5E9D8]">
                Morning Brew
              </h4>
  
            </div>
  
            <div className="rounded-2xl bg-[#211A17] px-5 py-3 text-[#D89A3C]">
              LoFi
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  }