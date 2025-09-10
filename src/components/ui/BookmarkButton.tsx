import React from "react";
import { twMerge } from "tailwind-merge";
import BookmarkIcon from "../icons/BookmarkIcon";

type BookmarkButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  active?: boolean;
};

const BookmarkButton = React.forwardRef<HTMLButtonElement, BookmarkButtonProps>(
  (
    {
      className,
      onClick,
      disabled,
      active = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <button
        type='button'
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        aria-label={ariaLabel ?? (active ? "Remove bookmark" : "Add bookmark")}
        className={twMerge(
          "w-12 h-12 rounded-full border border-white/30 bg-black/5",
          "flex items-center justify-center cursor-pointer transition-colors outline-none",
          "hover:bg-white/15 active:bg-white/20",
          "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          active ? "bg-white" : "",
          className
        )}
        {...props}
      >
        {/* Иконка: используем твои props size/color/filled */}
        <BookmarkIcon
          size={18}
          color={active ? "black" : "white"}
          filled={active}
        />
      </button>
    );
  }
);

BookmarkButton.displayName = "BookmarkButton";
export default BookmarkButton;
