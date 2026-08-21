type LogoProps = {
    compact?: boolean;
  };
  
  export default function Logo({ compact = false }: LogoProps) {
    if (compact) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D89A3C]/30 bg-[#211A17]">
          <span className="text-xl font-black text-[#D89A3C]">
            S
          </span>
        </div>
      );
    }
  
    return (
      <div className="flex items-center gap-4">
  
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D89A3C]/30 bg-[#211A17] shadow-[0_0_20px_rgba(216,154,60,.15)]">
  
          <span className="text-2xl font-black text-[#D89A3C]">
            S
          </span>
  
        </div>
  
        <div>
  
          <h1 className="text-2xl font-black tracking-tight text-[#F5E9D8]">
            SAMJAH
          </h1>
  
          <p className="text-xs uppercase tracking-[0.35em] text-[#D89A3C]">
            Crafted Soundscapes
          </p>
  
        </div>
  
      </div>
    );
  }