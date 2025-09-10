"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import OptionButton from "@/components/OptionButton";
import { twMerge } from "tailwind-merge";
import { useFeedbackStore } from "@/stores/feedback";
import { sendFeedback } from "@/lib/sendFeedback";
import { useProfileStore } from "@/stores/profile";
import { useRouter } from "next/navigation";

function sanitizeName(input: string): string {
  return input
    .replace(/[^\p{L}\p{N}\s'’-]/gu, "")
    .trim()
    .slice(0, 40);
}

export default function FeedbackFormPage() {
  const router = useRouter();
  const [lengthChoice, setLengthChoice] = useState<
    "long" | "right" | "short" | null
  >(null);
  const [days, setDays] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");

  const fb = useFeedbackStore();
  const setProfileName = useProfileStore((s) => s.setName);

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => lengthChoice !== null && days !== null && name.trim().length > 0,
    [lengthChoice, days, name]
  );

  const onSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitErr(null);
    try {
      const cleaned = sanitizeName(name);

      await sendFeedback({
        overallRating: fb.overallRating,
        helpfulRating: fb.helpfulRating,
        engagingRating: fb.engagingRating,
        freeText: fb.freeText,
        lengthChoice,
        daysPerWeek: days!,
        notes,
        name: cleaned,
        sheet: "Feedback",
        meta: {
          page: "feedback/form",
          appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "demo",
        },
      });

      setProfileName(cleaned);
      localStorage.setItem(
        "planProgress",
        JSON.stringify({
          discover: "completed",
          train: "completed",
          execute: "completed",
        })
      );

      fb.reset();
      router.replace("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submit failed";
      setSubmitErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-dvh relative text-white'>
      <div className='absolute inset-0 -z-10'>
        <Image src='/bg.png' alt='' fill priority className='object-cover' />
      </div>

      <div className='max-w-md mx-auto px-4 pb-[calc(env(safe-area-inset-bottom,0px)+24px)]'>
        <BackButton onClick={() => history.back()} className='mt-2 mb-4' />

        {/* Q1 */}
        <h2 className='text-base font-medium mb-4'>
          What did you think of the length?
        </h2>
        <div className='space-y-3 mb-8'>
          <OptionButton
            align='center'
            size='sm'
            selected={lengthChoice === "long"}
            onClick={() => setLengthChoice("long")}
          >
            Too Long
          </OptionButton>
          <OptionButton
            align='center'
            size='sm'
            selected={lengthChoice === "right"}
            onClick={() => setLengthChoice("right")}
          >
            Just Right
          </OptionButton>
          <OptionButton
            align='center'
            size='sm'
            selected={lengthChoice === "short"}
            onClick={() => setLengthChoice("short")}
          >
            Too Short
          </OptionButton>
        </div>

        {/* Q2 */}
        <h2 className='text-base font-medium mb-3'>
          How many days a week could you see yourself doing trainings like this?
        </h2>
        <div className='flex items-center gap-3 mb-10'>
          {Array.from({ length: 8 }, (_, i) => i).map((n) => {
            const active = days === n;
            return (
              <button
                key={n}
                onClick={() => setDays(n)}
                className={twMerge(
                  "w-10 h-10 rounded-full grid place-items-center text-[16px] font-medium",
                  active ? "bg-white text-black" : "bg-white/10 text-white/85"
                )}
                aria-label={`${n} days`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Q3 — notes */}
        <h3 className='text-[16px] text-white/85 mb-2'>
          Anything else you’d like to share
        </h3>
        <div className='relative mb-6'>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
            placeholder='Type your answer...'
            rows={2}
            className='w-full resize-none rounded-2xl bg-white/5 border border-white/20 px-4 py-3 outline-none placeholder:text-white/40'
          />
          <div className='absolute right-3 bottom-2 text-xs text-white/50'>
            {notes.length}/1000
          </div>
        </div>

        {/* Q4 — name */}
        <h3 className='text-[16px] text-white/85 mb-2'>
          Please enter your name
        </h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your name'
          className='w-full h-14 rounded-2xl bg-white/5 border border-white/20 px-4 outline-none mb-10'
        />

        {/* NEXT */}
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={twMerge(
            "w-full rounded-[999px] py-4 text-lg",
            !canSubmit && "opacity-60 pointer-events-none"
          )}
          variant='button'
        >
          {submitting ? "Submitting..." : "Next"}
        </Button>
        {submitErr && <p className='mt-2 text-sm text-red-400'>{submitErr}</p>}
      </div>
    </div>
  );
}
