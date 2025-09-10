"use client";

export default function AppHeader({
  title = "Discover",
  onBack,
}: {
  title?: string;
  onBack?: () => void;
}) {
  return (
    <div className='flex items-center gap-4'>
      <button
        className='p-1 rounded-full bg-transparent hover:bg-white/6 transition'
        onClick={onBack}
        aria-label='Back'
      >
        <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
          <path
            d='M15 18l-6-6 6-6'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      <h2 className='text-white font-bold text-[20px]'>{title}</h2>
    </div>
  );
}
