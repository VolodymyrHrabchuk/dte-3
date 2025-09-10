"use client";

import Screen from "@/components/Screen";
import OptionButton from "@/components/OptionButton";
import { Focus, Helper, useDiscover } from "@/stores/discover";
import { useState } from "react";
import { completeDiscoverMakeTrainAvailable } from "@/lib/planProgress";
import { useRouter } from "next/navigation";

const focusLabels: Record<Focus, string> = {
  "self-confidence": "Self Confidence",
  "inner-strength": "Inner Strength",
  "mental-toughness": "Mental Toughness",
};

const helperLabels: Record<Helper, string> = {
  breakthrough: "I’m coming off a breakthrough.",
  "goals-progress": "I’m clear on my goals and making progress.",
  focused: "I’m focused and determined.",
  habits: "I’m building habits that work for me.",
  "lead-improve": "I’m pushing myself to lead or improve.",
};

const progressByStep: Record<1 | 2 | 3, number> = { 1: 25, 2: 65, 3: 100 };

export default function DiscoverPage() {
  const router = useRouter();
  const { step, setFocus, setRating, setHelper, prev } = useDiscover();
  const [flashIdx, setFlashIdx] = useState<number | null>(null);

  const flashThen = (i: number, fn: () => void) => {
    setFlashIdx(i);
    setTimeout(() => {
      setFlashIdx(null);
      fn();
    }, 120);
  };

  if (step === 1) {
    return (
      <Screen progress={progressByStep[1]} onBack={prev}>
        <div className='text-xl font-medium mb-8'>
          What do you want to focus on today?
        </div>
        <div className='space-y-3'>
          {Object.entries(focusLabels).map(([key, label], i) => (
            <OptionButton
              key={key}
              align='center'
              selected={flashIdx === i}
              onClick={() => flashThen(i, () => setFocus(key as Focus))}
            >
              {label}
            </OptionButton>
          ))}
        </div>
      </Screen>
    );
  }

  if (step === 2) {
    return (
      <Screen progress={progressByStep[2]} onBack={prev}>
        <div className='text-xl font-medium mb-8'>
          How are you feeling about your Self Confidence today? (for the purpose
          of this demo, select something 4 or higher)
        </div>
        <div className='space-y-3'>
          {[5, 4, 3, 2, 1].map((rank, i) => (
            <OptionButton
              key={rank}
              leading={rank}
              selected={flashIdx === i}
              onClick={() =>
                flashThen(i, () => setRating(rank as 1 | 2 | 3 | 4 | 5))
              }
            >
              {rank === 5 && "My self-belief is on fire today."}
              {rank === 4 && "I’m feeling more confident in myself lately."}
              {rank === 3 && "Some belief is there, but it’s not steady."}
              {rank === 2 && "I’ve been second-guessing myself a lot."}
              {rank === 1 && "I’m barely trusting my abilities right now."}
            </OptionButton>
          ))}
        </div>
      </Screen>
    );
  }

  // step === 3
  return (
    <Screen progress={progressByStep[3]} onBack={prev}>
      <div className='text-lg mb-5'>
        What’s been helping you stay strong in your Self Belief?
        <span className='block text-sm text-white/60'>
          (for the purpose of this demo, select breakthrough)
        </span>
      </div>

      <div className='space-y-3'>
        {Object.entries(helperLabels).map(([key, label], i) => (
          <OptionButton
            key={key}
            align='left'
            selected={flashIdx === i}
            onClick={() =>
              flashThen(i, () => {
                setHelper(key as Helper);
                // сохранить прогресс плана и перейти на дашборд
                completeDiscoverMakeTrainAvailable();
                router.push("/dashboard?view=discover");
              })
            }
          >
            {label}
          </OptionButton>
        ))}
      </div>
    </Screen>
  );
}
