"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Screen from "@/components/Screen";
import OptionButton from "@/components/OptionButton";
import FlashcardSlide from "@/components/FlashCardSlide";
import type { FlashcardsContent } from "@/components/Flashcards";
import { completeExecute } from "@/lib/planProgress";
import Image from "next/image";

export default function ExecutePage() {
  const router = useRouter();

  // шаг 0: тест; шаг 1: карточка "как в компоненте"
  const [step, setStep] = useState<0 | 1>(0);
  const [answer, setAnswer] = useState("");

  const progress = useMemo(() => (step === 0 ? 50 : 100), [step]);
  // было: completeExecute(); router.push("/dashboard");
  const finish = () => {
    completeExecute();
    router.push("/score"); // ⬅️ идём на страницу Score
  };
  // --- STEP 0 (тест) ---
  if (step === 0) {
    return (
      <Screen title='Execute' progress={progress} onBack={() => router.back()}>
        <p className='text-lg mt-6 mb-5'>
          What helps reinforce your confidence during a rough patch?
        </p>
        <div className='space-y-3'>
          {[
            "Pushing through without reflection.",
            "Trusting the work you’ve put in.",
            "Focusing on what others think.",
          ].map((opt) => (
            <OptionButton key={opt} align='left' onClick={() => setStep(1)}>
              {opt}
            </OptionButton>
          ))}
        </div>
      </Screen>
    );
  }

  // --- STEP 1 (карточка как в FlashcardSlide) ---
  const card: FlashcardsContent = {
    id: "exec-2",
    type: "input",
    title:
      "Why does returning to an internal anchor strengthen belief in uncertain moments?",
  };

  return (
    <div className='min-h-dvh relative text-white'>
      {/* фоновое блюр-видео как на рефе */}
      <div className='absolute inset-0 -z-10 overflow-hidden' aria-hidden>
        <Image
          src='/input-bg.png' // ← твоя картинка
          alt=''
          fill
          priority
          className='object-cover blur-[10px] scale-110'
        />
      </div>

      <div className='max-w-md mx-auto px-4'>
        <FlashcardSlide
          card={card}
          isActive
          index={1} // чтобы счётчик показал 2/3
          cardsLength={2}
          userInput={answer}
          onUserInputChange={setAnswer}
          swiper={null} // слайд одиночный, без Swiper
          onBack={() => setStep(0)}
          onComplete={() => {
            finish();
          }}
        />
      </div>
    </div>
  );
}
