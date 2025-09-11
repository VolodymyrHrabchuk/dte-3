"use client";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  leading?: string | number;
  selected?: boolean;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg"; // NEW
};

export default function OptionButton({
  leading,
  selected = false,
  align = "left",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  const height =
    size === "sm" ? "h-[46px]" : size === "lg" ? "h-[76px]" : "h-[68px]";
  const leadingCls =
    size === "sm"
      ? "w-9 h-9 text-[14px] mr-2.5"
      : size === "lg"
      ? "w-11 h-11 text-[16px] mr-3.5"
      : "w-10 h-10 text-[15px] mr-3";
  const textCls =
    size === "sm" ? "text-base" : size === "lg" ? "text-[19px]" : "text-lg";

  return (
    <button
      {...rest}
      className={twMerge(
        `w-full rounded-[999px] ${height} px-4 flex items-center active:scale-[0.995]
         transition text-white ${
           align === "center" ? "text-center" : "text-left"
         }`,
        className
      )}
      style={{
        background: selected
          ? "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2))"
          : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
        border: selected
          ? "1px solid rgba(255,255,255,0.4)"
          : "1px solid rgba(255,255,255,0.2)",
        boxShadow: selected
          ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 30px rgba(0,0,0,0.6)"
          : "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 30px rgba(0,0,0,0.6)",
      }}
    >
      {leading !== undefined && (
        <span
          className={`flex-shrink-0 rounded-full grid place-items-center ${leadingCls}`}
          style={{
            background: selected
              ? "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
              : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {leading}
        </span>
      )}
      <div
        className={`flex-1 ${align === "center" ? "flex justify-center" : ""}`}
      >
        <span className={`${textCls} font-medium leading-snug`}>
          {children}
        </span>
      </div>
    </button>
  );
}
