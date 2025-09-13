"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PopperCrackerIcon from "@/components/icons/PopperCrackerIcon";
import HITEIcon from "@/components/icons/HITEIcon";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate,
  cubicBezier,
} from "framer-motion";

function FireIcon() {
  return (
    <svg width='18' height='20' viewBox='0 0 18 20' fill='none'>
      <path
        d='M10.1123 19.796C13.3272 19.1516 17.484 16.8389 17.484 10.8584C17.484 5.41618 13.5004 1.79219 10.636 0.127007C10.0003 -0.242492 9.25623 0.243445 9.25623 0.978654V2.8592C9.25623 4.3421 8.63275 7.04889 6.90034 8.17474C6.01585 8.74955 5.06061 7.88923 4.95311 6.83987L4.86484 5.97818C4.76223 4.97644 3.742 4.36833 2.94138 4.97908C1.50307 6.07629 0 7.99764 0 10.8584C0 18.172 5.43947 20.0004 8.1592 20.0004C8.31739 20.0004 8.48364 19.9957 8.6567 19.9857C7.31377 19.8709 5.14235 19.0377 5.14235 16.3433C5.14235 14.2357 6.67999 12.8098 7.84828 12.1167C8.16249 11.9303 8.53025 12.1723 8.53025 12.5377V13.1436C8.53025 13.6074 8.70961 14.3323 9.13655 14.8286C9.61968 15.3901 10.3288 14.8019 10.386 14.0633C10.4041 13.8303 10.6384 13.6818 10.8402 13.7997C11.4997 14.1852 12.3416 15.0087 12.3416 16.3433C12.3416 18.4496 11.1805 19.4185 10.1123 19.796Z'
        fill='#E4782A'
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width='16' height='17' viewBox='0 0 16 17' fill='none'>
      <path
        d='M14.666 8.5A6.667 6.667 0 1 1 1.333 8.5a6.667 6.667 0 0 1 13.333 0Z'
        fill='white'
        fillOpacity='.8'
      />
      <path
        d='M8 5.333V8.293l1.52 1.52'
        stroke='#060502'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

const EASE = cubicBezier(0.22, 1, 0.36, 1);

export default function ScorePage() {
  const [HITE_BASE, setHiteBase] = useState(952);
  const [completedTarget, setCompletedTarget] = useState(100);
  const [streakTarget, setStreakTarget] = useState(7);
  const [correctTarget, setCorrectTarget] = useState(0);

  const [showFeedback, setShowFeedback] = useState(false);

  const daysMV = useMotionValue(0);
  const [daysVal, setDaysVal] = useState(0);

  const hiteMV = useMotionValue(0);
  const [hiteDeltaVal, setHiteDeltaVal] = useState(0);

  const completedMV = useMotionValue(0);
  const [completedVal, setCompletedVal] = useState(0);

  const streakMV = useMotionValue(0);
  const [streakVal, setStreakVal] = useState(0);

  const correctMV = useMotionValue(0);
  const [correctVal, setCorrectVal] = useState(0);

  const totalMV = useMotionValue(0);
  const [totalVal, setTotalVal] = useState(0);

  const [xpLevel, setXpLevel] = useState<"Rookie" | "Starter">("Rookie");

  // success sound
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const a = new Audio("/success.mp3");
    a.preload = "auto";
    a.volume = 0.8;
    // @ts-expect-error playsInline
    a.playsInline = true;
    successAudioRef.current = a;
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.src = "";
        successAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const u0 = daysMV.on("change", (v) => setDaysVal(Math.round(v)));
    const u1 = hiteMV.on("change", (v) => setHiteDeltaVal(Math.round(v)));
    const u2 = completedMV.on("change", (v) => setCompletedVal(Math.round(v)));
    const u3 = streakMV.on("change", (v) => setStreakVal(Math.round(v)));
    const u4 = correctMV.on("change", (v) => setCorrectVal(Math.round(v)));
    const u5 = totalMV.on("change", (v) => setTotalVal(Math.round(v)));
    return () => {
      u0();
      u1();
      u2();
      u3();
      u4();
      u5();
    };
  }, [daysMV, hiteMV, completedMV, streakMV, correctMV, totalMV]);

  useEffect(() => {
    try {
      const bonus = parseInt(localStorage.getItem("kcCorrectBonus") || "0", 10);
      setCorrectTarget(Number.isFinite(bonus) ? bonus : 0);

      const dteComp = parseInt(
        localStorage.getItem("dteCompletedPoints") || "100",
        10
      );
      const dteStrk = parseInt(
        localStorage.getItem("dteStreakPoints") || "7",
        10
      );
      setCompletedTarget(Number.isFinite(dteComp) ? dteComp : 100);
      setStreakTarget(Number.isFinite(dteStrk) ? dteStrk : 7);

      const base = parseInt(localStorage.getItem("hiteBase") || "952", 10);
      if (Number.isFinite(base)) setHiteBase(base);

      const streakDays = parseInt(
        localStorage.getItem("streakDays") || "5",
        10
      );
      daysMV.set(Number.isFinite(streakDays) ? streakDays : 5);
    } catch {
      daysMV.set(5);
    }
  }, [daysMV]);

  const totalTarget = completedTarget + streakTarget + correctTarget;


  const persistedRef = useRef(false);
  const persistScore = useCallback(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;

    try {
      localStorage.setItem("dteCompletedPoints", String(completedTarget));
      localStorage.setItem("dteStreakPoints", String(streakTarget));
      localStorage.setItem("kcCorrectBonus", String(correctTarget));
      localStorage.setItem("hiteBase", String(HITE_BASE)); 
      if (totalTarget > 0) {
        localStorage.setItem("level", "Starter");
      }

      window.dispatchEvent(new Event("hite:score-updated"));
 
      window.dispatchEvent(new Event("planprogress:updated"));
    } catch {
      
    }
  }, [completedTarget, streakTarget, correctTarget, HITE_BASE, totalTarget]);

  useEffect(() => {
    const baseDelay = 0.35;

    // reset
    hiteMV.set(0);
    completedMV.set(0);
    streakMV.set(0);
    correctMV.set(0);
    totalMV.set(0);
    setXpLevel("Rookie");
    persistedRef.current = false; 

    const ctrls: { stop: () => void }[] = [];

    // Streak days +1
    ctrls.push(
      animate(daysMV, [daysMV.get(), daysMV.get() + 1], {
        duration: 1.4,
        ease: EASE,
        delay: 0.4,
      })
    );

    // Completed DTE
    ctrls.push(
      animate(completedMV, [0, completedTarget], {
        duration: 1.0,
        ease: EASE,
        delay: baseDelay + 0.1,
      })
    );

    // DTE Streak
    ctrls.push(
      animate(streakMV, [0, streakTarget], {
        duration: 0.9,
        ease: EASE,
        delay: baseDelay + 0.8,
      })
    );

    // Correct
    if (correctTarget > 0) {
      ctrls.push(
        animate(correctMV, [0, correctTarget], {
          duration: 0.9,
          ease: EASE,
          delay: baseDelay + 1.5,
        })
      );
    }

    // Total
    ctrls.push(
      animate(totalMV, [0, totalTarget], {
        duration: 1.0,
        ease: EASE,
        delay: baseDelay + (correctTarget > 0 ? 2.1 : 1.6),
      })
    );

    ctrls.push(
      animate(hiteMV, [0, totalTarget], {
        duration: 1.6,
        ease: EASE,
        delay: baseDelay + (correctTarget > 0 ? 2.4 : 1.9),
        onComplete: () => {
          setXpLevel("Starter");
          persistScore(); // 
        },
      })
    );

    const soundTimer = setTimeout(() => {
      const a = successAudioRef.current;
      if (a) {
        try {
          a.currentTime = 0;
          a.play().catch(() => {});
        } catch {}
      }
    }, (baseDelay + 0.6) * 1000);

    const headlineTimer = setTimeout(() => setShowFeedback(true), 1400);

    return () => {
      ctrls.forEach((c) => c.stop());
      clearTimeout(soundTimer);
      clearTimeout(headlineTimer);
    };
  }, [
    completedTarget,
    streakTarget,
    correctTarget,
    totalTarget,
    daysMV,
    hiteMV,
    completedMV,
    streakMV,
    correctMV,
    totalMV,
    persistScore,
  ]);

  return (
    <div className='min-h-dvh relative text-white'>
      <div className='absolute  inset-0 -z-10 '>
        <Image src='/bg.png' alt='' fill priority className='object-cover' />
        <div className='absolute inset-0 bg-black/55' />
      </div>

      <div className='max-w-md mx-auto px-6 pt-20  flex flex-col min-h-dvh'>
        <div className='relative mb-6 h-[172px]'>
          <AnimatePresence mode='wait'>
            {!showFeedback ? (
              <motion.div
                key='headline-1'
                className='absolute inset-0 flex flex-col items-center justify-center text-center'
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className='text-white/85'>
                  You’ve completed today’s DTE. Your
                  <br />
                  metrics have now changed!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key='headline-2'
                className='absolute inset-0 flex flex-col items-center justify-center text-center'
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <motion.div
                  className='w-fit mx-auto mb-3'
                  initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <PopperCrackerIcon />
                </motion.div>
                <motion.h1
                  className='text-[32px] font-bold mb-2'
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                >
                  You Did It!
                </motion.h1>
                <motion.p
                  className='text-white/85'
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                >
                  You’ve completed today’s DTE. Your
                  <br />
                  metrics have now changed!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='mt-24 flex flex-col gap-3'>
          {/* STATS CARD */}
          <motion.div
            className='w-full p-4 bg-black/30 border border-white/20 rounded-2xl'
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          >
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Active Streak</span>
              <div className='flex items-center gap-1.5'>
                <motion.span
                  aria-hidden
                  animate={{
                    rotate: [0, -6, 0, 6, 0],
                    scale: [1, 1.06, 1, 1.06, 1],
                  }}
                  transition={{
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <FireIcon />
                </motion.span>
                <motion.span
                  className='text-[22px] font-medium tabular-nums'
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                >
                  {daysVal} days
                </motion.span>
              </div>
            </div>
            <div className='mt-1 flex items-center justify-between text-sm text-white/80'>
              <span>Time spent today:</span>
              <div className='flex items-center gap-1'>
                <motion.span
                  aria-hidden
                  animate={{ rotate: [0, -12, 0, 12, 0] }}
                  transition={{
                    duration: 3.0,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <ClockIcon />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  15m
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* HITE SCORE CARD */}
          <motion.div
            className='w-full relative overflow-hidden rounded-2xl border'
            style={{ borderColor: "rgba(124,44,255,0.5)" }}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          >
            <div
              aria-hidden
              className='absolute inset-0 opacity-90'
              style={{
                backgroundImage: "url('/hite-score-bg.png')",
                backgroundSize: "290px 140px",
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className='relative z-10 p-4'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <HITEIcon />
                  <span className='font-medium text-lg'>HITE Score</span>

                  <div className='font-medium text-[10px] rounded-4xl'>
                    <AnimatePresence mode='wait' initial={false}>
                      <motion.span
                        key={xpLevel}
                        initial={{
                          opacity: 0,
                          y: 6,
                          scale: 0.95,
                          rotateX: -40,
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95, rotateX: 40 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className='inline-flex items-center gap-1 px-2 py-1 rounded-4xl'
                        style={{
                          backgroundColor:
                            xpLevel === "Rookie" ? "#363391" : "#924AAB",
                          color: xpLevel === "Rookie" ? "#B2FF8B" : "#FFFF00",
                        }}
                      >
                        {xpLevel === "Rookie" ? "🌱 Rookie" : "🐤 Starter"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <motion.span
                  className='font-semibold text-2xl tabular-nums'
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                >
                  {(HITE_BASE + hiteDeltaVal).toLocaleString()}
                </motion.span>
              </div>

              <motion.div
                className='mt-1 pt-2 border-t border-white/20 text-sm'
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
              >
                <div className='flex items-center justify-between py-0.5 text-white/85'>
                  <span>Completed DTE</span>
                  <span className='tabular-nums'>+{completedVal}</span>
                </div>
                <div className='flex items-center justify-between py-0.5 text-white/85'>
                  <span>DTE Streak Multiplier</span>
                  <span className='tabular-nums'>+{streakVal}</span>
                </div>
                <div className='flex items-center justify-between py-0.5 text-white/85'>
                  <span>
                    {correctTarget > 0 ? "Correct" : "Incorrect"} Knowledge
                    Check Answer
                  </span>
                  <span className='tabular-nums'>+{correctVal}</span>
                </div>

                <div className='mt-1 flex items-center justify-between'>
                  <span>Total</span>
                  <span className='font-medium text-green-400 tabular-nums'>
                    +{totalVal} points
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className='pt-8 '>
            <Link href='/feedback' className='block'>
              <Button
                variant='text'
                className='w-full'
                onClick={persistScore} 
              >
                Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
