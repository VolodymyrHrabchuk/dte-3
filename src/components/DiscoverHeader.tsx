"use client";

import { useRouter } from "next/navigation";

export default function DiscoverHeader({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const goBack = () => (onBack ? onBack() : router.back());

  return (
    <div className='flex items-center gap-4 mb-4'>
      <button
        onClick={goBack}
        aria-label='Back'
        className='p-1 rounded-full hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-white/20'
      >
        <svg width='28' height='28' viewBox='0 0 24 24' aria-hidden='true'>
          <path
            d='M15 18l-6-6 6-6'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          />
        </svg>
      </button>
      <h1 className='text-2xl font-bold'>Discover</h1>
    </div>
  );
}
