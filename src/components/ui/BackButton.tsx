import { twMerge } from "tailwind-merge";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";

type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export default function BackButton({ className, ...props }: BackButtonProps) {
  return (
    <button 
      className={twMerge(`bg-transparent cursor-pointer`, className)}
      {...props}
    >
      <ChevronLeftIcon />
    </button>
  )
}