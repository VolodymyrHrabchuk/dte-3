import { cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: "button" | "text";
};

const buttonVariants = cva(
  "text-lg font-medium cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        button:
          "h-[3.75rem] w-full items-center bg-white text-black rounded-[30px] disabled:bg-white/50 active:font-bold",
        text: "h-[3.75rem] w-full bg-transparent text-white disabled:text-white/50",
      },
    },
    defaultVariants: {
      variant: "button",
    },
  }
);

export default function Button({
  children,
  disabled,
  className,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      {...props}
      className={twMerge(buttonVariants({ variant, className }))}
    >
      {children}
    </button>
  );
}
