"use client";

import { cva } from "class-variance-authority";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

type TextAreaProps = {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
};

const textAreaContainerVariants = cva(
  [
    "flex flex-col justify-between p-4 rounded-3xl transition-colors duration-200",
    "border bg-white/[4%] border-white/30 focus-within:border-white/50",
  ],
  {
    variants: {
      size: {
        sm: "h-[11.25rem]",
        md: "h-[18.75rem]",
      },
      error: {
        true: "border-red",
        false: "",
      },
      disabled: {
        true: "border-white/10",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
      disabled: false,
    },
  }
);

const textAreaVariants = cva(
  [
    "w-full break-all resize-none appearance-none bg-transparent focus:border-none focus:outline-none focus:ring-0 -mr-4 pr-4 custom-scrollbar",
    "placeholder:text-white/60",
  ],
  {
    variants: {
      size: {
        sm: "h-[6.063rem]",
        md: "h-[15.063rem]",
      },
      disabled: {
        true: "placeholder:text-white/10 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  }
);

export default function TextArea({
  name, 
  id, 
  placeholder = "Type your answer...", 
  label, 
  maxLength = 1000, 
  size, 
  value, 
  onChange, 
  error, 
  disabled, 
  className,
  containerClassName
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.target === textAreaRef.current) return;
    textAreaRef.current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-[0.25rem]">
      <label 
        className="text-white/80 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      <div
        className={twMerge(textAreaContainerVariants({ size, error, disabled }), containerClassName)}
        onPointerDown={handleContainerPointerDown}
      >
        <textarea 
          ref={textAreaRef}
          name={name} 
          id={id} 
          placeholder={placeholder} 
          maxLength={maxLength} 
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(textAreaVariants({ size, disabled, className }))}
        />

        <div className="text-xs self-end">
          <span className={twMerge(value?.length ? "text-white" : "text-grey")}>
            {value?.length || 0}
          </span>
          <span className="text-grey">
            /{maxLength}
          </span>
        </div>
      </div>
    </div>
  )
}