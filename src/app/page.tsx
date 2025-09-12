"use client";

import Image from "next/image";
import Providers from "./providers";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Home() {
  const router = useRouter();
  const goDiscover = useCallback(() => router.push("/discover"), [router]);

  return (
    <Providers>
      <main
        role='button'
        tabIndex={0}
        aria-label='Open Discover'
        onClick={goDiscover}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") goDiscover();
        }}
        className='min-h-dvh bg-black relative cursor-pointer select-none outline-none max-w-md mx-auto'
      >
        <div className='absolute inset-0 grid place-items-center pointer-events-none'>
          <Image
            src='/lockscreen.png'
            alt='HITE EQ'
            fill
            className='object-cover'
            priority
          />
        </div>
        <span className='sr-only'>Tap anywhere to continue</span>
      </main>
    </Providers>
  );
}
