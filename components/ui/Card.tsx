import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export default function Card({
  children,
  active = false,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-[24px]
        border
        transition-all
        duration-500

        ${
          active
            ? "border-[#D89A3C] bg-[#221914] shadow-[0_0_35px_rgba(216,154,60,.20)]"
            : "border-[#3A2B22] bg-[#171311] hover:border-[#D89A3C] hover:shadow-[0_0_35px_rgba(216,154,60,.12)]"
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
}