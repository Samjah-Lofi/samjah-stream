import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "gold" | "dark";
  className?: string;
};

export default function Badge({
  children,
  variant = "gold",
  className = "",
}: BadgeProps) {
  const variants = {
    gold:
      "border border-[#D89A3C]/40 bg-[#D89A3C]/15 text-[#E9B65A]",

    dark:
      "border border-[#3A2B22] bg-[#211A17] text-[#BFAE98]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        tracking-wider
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}