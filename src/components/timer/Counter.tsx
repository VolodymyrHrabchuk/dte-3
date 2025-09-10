import { twMerge } from "tailwind-merge";

type CounterProps = {
  className?: string;
  title?: string;
  count: number;
  length: number;
};

export default function Counter({
  className,
  title = "Flashcard",
  count,
  length,
}: CounterProps) {
  return (
    <div
      className={twMerge(
        "flex w-fit px-4 py-2 border border-white/30 bg-black/50 backdrop-blur-[20px] rounded-3xl items-center justify-center",
        className
      )}
    >
      <span className='text-sm font-medium text-white'>
        {title} {count + 1}/{length}
      </span>
    </div>
  );
}
