"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { twMerge } from "tailwind-merge";
import Button from "@/components/ui/Button";
import StarButton from "@/components/ui/StarButton";
import ChatIcon from "@/components/icons/ChatIcon";
import { useFeedbackStore } from "@/stores/feedback";
import Link from "next/link";

export default function FeedbackPage() {
  const router = useRouter();
  const [helpful, setHelpful] = useState(0);
  const [engaging, setEngaging] = useState(0);

  const { setOverallRating, setHelpfulRating, setEngagingRating, setFreeText } =
    useFeedbackStore();

  const handleBack = () => router.back();

  // Всегда число: если ничего не выбрано — 0
  const overall: number = useMemo(() => {
    const arr = [helpful, engaging].filter((n) => n > 0);
    if (!arr.length) return 0;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.min(5, Math.max(1, Math.round(avg)));
  }, [helpful, engaging]);

  const handleNext = () => {
    setOverallRating(overall); // number
    setHelpfulRating(helpful); // number
    setEngagingRating(engaging); // number
    setFreeText(""); // текста на этом экране нет
  };

  return (
    <div className='min-h-dvh relative text-white'>
      <div className='absolute inset-0 -z-10'>
        <Image src='/bg.png' alt='' fill priority className='object-cover' />
      </div>

      <section
        className={twMerge(
          "flex flex-col flex-1 relative max-w-md mx-auto px-4 pt-6"
        )}
      >
        <BackButton onClick={handleBack} className='mt-2 mb-2' />

        <div className='mx-auto mb-6'>
          <ChatIcon />
        </div>

        <div className='text-center mb-10'>
          <h1 className='font-bold text-[32px] leading-tight'>
            How would you rate this <br className='hidden sm:block' />
            training?
          </h1>
        </div>

        {/* Helpful */}
        <div className='mb-8'>
          <p className='text-center text-white/80 mb-3'>
            How helpful was the information?
          </p>
          <div className='flex justify-center items-center gap-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarButton
                key={`h-${i}`}
                size={44}
                active={i <= helpful}
                onClick={() => setHelpful(i)}
              />
            ))}
          </div>
        </div>

        {/* Engaging */}
        <div className='mb-12'>
          <p className='text-center text-white/80 mb-3'>
            How engaging was the presentation of the content?
          </p>
          <div className='flex justify-center items-center gap-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarButton
                key={`e-${i}`}
                size={44}
                active={i <= engaging}
                onClick={() => setEngaging(i)}
              />
            ))}
          </div>
        </div>

        <Link
          href='/feedback/form'
          onClick={handleNext}
          className='block mt-auto'
        >
          <Button
            variant='button'
            className='w-full rounded-[999px] py-4 text-lg'
          >
            Next
          </Button>
        </Link>
      </section>
    </div>
  );
}
