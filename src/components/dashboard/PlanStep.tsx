"use client";

import Image from "next/image";
import { StepState } from "@/lib/planProgress";

export default function PlanStep({
  title,
  iconSrc,
  minutes = 2,
  state,
  accent = false,
  onStart,
}: {
  title: "Discover" | "Train" | "Execute";
  iconSrc: string;
  minutes?: number;
  state: StepState | "available" | "completed"; 
  accent?: boolean;
  onStart?: () => void;
}) {
  const locked = state === "locked";
  const available = state === "available";
  const completed = state === "completed";

  return (
    <div
      className={`relative rounded-[999px] px-4 py-3 flex items-center gap-4 ${
        locked ? "opacity-60" : ""
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
        border: `1px solid ${
          accent ? "rgba(120,72,255,0.25)" : "rgba(255,255,255,0.06)"
        }`,
      }}
    >
      <div className='w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0b1720] to-[#161122]'>
        <Image src={iconSrc} alt={title} width={44} height={44} />
      </div>

      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <div
            className={`${
              locked ? "text-white/60" : "text-white"
            } text-lg font-medium`}
          >
            {title}
          </div>
          <div className='text-sm flex gap-2 items-center text-white/60'>
            <svg width='16' height='17' viewBox='0 0 16 17' fill='none'>
              <path
                d='M14.6663 8.49967C14.6663 12.1816 11.6816 15.1663 7.99967 15.1663C4.31778 15.1663 1.33301 12.1816 1.33301 8.49967C1.33301 4.81778 4.31778 1.83301 7.99967 1.83301C11.6816 1.83301 14.6663 4.81778 14.6663 8.49967Z'
                fill='white'
                fillOpacity='0.8'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.99967 5.33301C8.27582 5.33301 8.49967 5.55687 8.49967 5.83301V8.29257L10.0199 9.81279C10.2152 10.008 10.2152 10.3246 10.0199 10.5199C9.82463 10.7152 9.50805 10.7152 9.31279 10.5199L7.64612 8.85323C7.55235 8.75946 7.49967 8.63228 7.49967 8.49967V5.83301C7.49967 5.55687 7.72353 5.33301 7.99967 5.33301Z'
                fill='#060502'
              />
            </svg>
            {minutes} minutes
          </div>
        </div>
      </div>

      <div>
        {locked && (
          <div
            className='w-12 h-12 rounded-full bg-[#28354EB2] flex items-center justify-center text-white/60'
            aria-hidden
          >
            {/* lock icon */}
            <svg width='14' height='15' viewBox='0 0 14 15' fill='none'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M2.5 6.7V5.333C2.5 2.848 4.514 0.833 7 0.833s4.5 2.015 4.5 4.5V6.703c.744.055 1.228.195 1.582.549.586.586.586 1.529.586 3.414s0 2.828-.586 3.414c-.586.586-1.528.586-3.414.586H4.333c-1.886 0-2.828 0-3.414-.586C.333 13.494.333 12.552.333 10.666c0-1.885 0-2.828.586-3.414.354-.354.838-.494 1.581-.55ZM3.5 5.333C3.5 3.4 5.067 1.833 7 1.833S10.5 3.4 10.5 5.333V6.669c-.255-.002-.532-.002-.833-.002H4.333c-.301 0-.578 0-.833.002V5.333Z'
                fill='black'
                fillOpacity='0.8'
              />
            </svg>
          </div>
        )}
        {available && (
          <button
            onClick={onStart}
            className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow'
            aria-label={`Start ${title}`}
          >
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
              <path
                d='M8 5l8 7-8 7'
                stroke='#000'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        )}
        {completed && (
          <div
            className='w-12 h-12 rounded-full bg-green-500/90 flex items-center justify-center text-white'
            aria-hidden
          >
            ✓
          </div>
        )}
      </div>
    </div>
  );
}
