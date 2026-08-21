import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[#D89A3C] text-[#120D09] hover:bg-[#E9B65A] shadow-[0_8px_30px_rgba(216,154,60,.25)]",

    secondary:
      "border border-[#5A4637] bg-[#171311]/80 text-[#F5E9D8] hover:border-[#D89A3C] hover:bg-[#211A17]",

    ghost:
      "bg-transparent text-[#D89A3C] hover:text-[#E9B65A]",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-2xl
        px-8
        py-4
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-0.5
        active:scale-[0.98]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}