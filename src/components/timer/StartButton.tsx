// StartButton.tsx
import { twMerge } from "tailwind-merge";
import React from "react";

type StartButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, onClick, disabled, ...props }, ref) => (
    <button
      className={twMerge(
        "bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors w-20 h-20",
        disabled ? "bg-white/50 cursor-not-allowed" : "",
        className
      )}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <svg
        width='21'
        height='24'
        viewBox='0 0 21 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M15.3566 5.80451C19.1189 8.43514 21 9.75046 21 12.0001C21 14.2497 19.1189 15.5651 15.3566 18.1957C14.3181 18.9219 13.288 19.6056 12.3414 20.1753C11.511 20.6752 10.5705 21.1922 9.59677 21.6997C5.84336 23.6561 3.96665 24.6343 2.28345 23.5513C0.600253 22.4683 0.44728 20.201 0.141334 15.6666C0.0548123 14.3842 1.32114e-08 13.1271 0 12.0001C-1.32114e-08 10.8731 0.0548125 9.616 0.141335 8.33364C0.447281 3.79916 0.600254 1.53192 2.28345 0.448893C3.96665 -0.634136 5.84336 0.344066 9.59677 2.30047C10.5705 2.808 11.511 3.32502 12.3414 3.82485C13.288 4.39459 14.3181 5.07831 15.3566 5.80451Z'
          fill='black'
        />
      </svg>
    </button>
  )
);

StartButton.displayName = "StartButton";

export default StartButton;
