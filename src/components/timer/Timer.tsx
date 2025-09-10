"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { twMerge } from "tailwind-merge";
import StartButton from "./StartButton";

interface TimerProps {
  timer: number;
  onComplete?: () => void;
  className?: string;
  inhaleSec?: number; // 5 c
  exhaleSec?: number; // 5 c
  breathMinRatio?: number; // 0.6
  breathMaxRatio?: number; // 0.9
}

const Timer: React.FC<TimerProps> = ({
  timer,
  onComplete,
  className,
  inhaleSec = 5,
  exhaleSec = 5,
  breathMinRatio = 0.6,
  breathMaxRatio = 0.9,
}) => {
  // Геометрия
  const size = 244;
  const strokeWidth = 10;
  const innerSize = 230;
  const radius = (innerSize - strokeWidth) / 2;
  const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);

  // Refs
  const progressCircleRef = useRef<SVGCircleElement | null>(null); // градиентный круг
  const eraseMaskStrokeRef = useRef<SVGCircleElement | null>(null); // штрих в маске (вырезает)
  const progressDotRef = useRef<SVGCircleElement | null>(null);
  const breathCircleRef = useRef<SVGCircleElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const breathTLRef = useRef<gsap.core.Timeline | null>(null);

  // ===== SFX (ding) =====
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const dingUnlockedRef = useRef(false);

  useEffect(() => {
    const a = new Audio("/ding.mp3"); 
    a.preload = "auto";
    a.volume = 0.8;
    dingRef.current = a;
    return () => {
      try {
        dingRef.current?.pause();
      } catch {}
      dingRef.current = null;
    };
  }, []);

  const unlockDing = async () => {
    const a = dingRef.current;
    if (!a || dingUnlockedRef.current) return;
    try {
      a.muted = true;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.muted = false;
      dingUnlockedRef.current = true;
    } catch {

    }
  };

  const playDing = () => {
    const a = dingRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };


  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [rotationCount, setRotationCount] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(-90);


  const startedAtRef = useRef<number | null>(null);
  const rafActiveRef = useRef(false);
  const lastWholeSecRef = useRef(0);
  const accumElapsedRef = useRef(0);

  const mmss = useMemo(() => {
    const m = Math.floor(displaySeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (displaySeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [displaySeconds]);


  const setProgressFrame = (elapsedMs: number) => {
    const totalMs = timer * 1000;
    const clamped = Math.min(elapsedMs, totalMs);

    
    const degPerSec = 18;
    const rotationPeriodMs = (360 / degPerSec) * 1000; 
    const turn = Math.floor(clamped / rotationPeriodMs);
    const phase = (clamped % rotationPeriodMs) / rotationPeriodMs; 

    const angleDeg = -90 + phase * 360;
    const angleRad = (angleDeg * Math.PI) / 180;

    if (turn !== rotationCount) setRotationCount(turn);
    setCurrentAngle(((angleDeg + 90) % 360) - 90);

    const endPos = circumference * phase;
    const EPS = 0.0001;
    const isDrawTurn = turn % 2 === 0;

    if (progressCircleRef.current) {
      if (isDrawTurn) {
        const visibleLen = Math.min(
          circumference - EPS,
          Math.max(EPS, phase * circumference)
        );
        let offset = (endPos - visibleLen) % circumference;
        if (offset < 0) offset += circumference;

        gsap.set(progressCircleRef.current, {
          strokeDasharray: `${visibleLen} ${circumference - visibleLen}`,
          strokeDashoffset: offset,
        });

        if (eraseMaskStrokeRef.current) {
          gsap.set(eraseMaskStrokeRef.current, {
            strokeDasharray: `0 ${circumference}`,
            strokeDashoffset: 0,
          });
        }
      } else {
        gsap.set(progressCircleRef.current, {
          strokeDasharray: `${circumference} 0`,
          strokeDashoffset: 0,
        });

        if (eraseMaskStrokeRef.current) {
          const eraseLen = Math.min(
            circumference - EPS,
            Math.max(EPS, phase * circumference)
          );
          let offset = (endPos - eraseLen - circumference / 4) % circumference;
          if (offset < 0) offset += circumference;

          gsap.set(eraseMaskStrokeRef.current, {
            strokeDasharray: `${eraseLen} ${circumference - eraseLen}`,
            strokeDashoffset: offset,
          });
        }
      }
    }

    if (progressDotRef.current) {
      const cx = size / 2 + radius * Math.cos(angleRad);
      const cy = size / 2 + radius * Math.sin(angleRad);
      gsap.set(progressDotRef.current, { cx, cy });
    }
  };

  
  const ensureBreathTimeline = () => {
    const el = breathCircleRef.current;
    if (!el) return;
    if (breathTLRef.current) return;

    const minR = radius * breathMinRatio;
    const maxR = radius * breathMaxRatio;

    const currentR =
      Number.parseFloat(el.getAttribute("r") || "") || (minR as number);
    gsap.set(el, { attr: { r: currentR } });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power1.inOut" },
    });

    const distToMax = Math.abs(currentR - maxR);
    const distToMin = Math.abs(currentR - minR);

    if (distToMax < distToMin) {
      tl.to(el, { attr: { r: minR }, duration: Math.max(0.1, exhaleSec) }).to(
        el,
        {
          attr: { r: maxR },
          duration: Math.max(0.1, inhaleSec),
        }
      );
    } else {
      tl.to(el, { attr: { r: maxR }, duration: Math.max(0.1, inhaleSec) }).to(
        el,
        {
          attr: { r: minR },
          duration: Math.max(0.1, exhaleSec),
        }
      );
    }

    breathTLRef.current = tl;
    if (isPaused) tl.pause();
  };


  useEffect(() => {
    if (!isRunning || isPaused) return;


    if (overlayRef.current && displaySeconds === 0) {
      gsap.fromTo(
        overlayRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
    if (
      progressCircleRef.current &&
      eraseMaskStrokeRef.current &&
      progressDotRef.current &&
      displaySeconds === 0
    ) {
      gsap.set(progressCircleRef.current, {
        strokeDasharray: `0 ${circumference}`,
        strokeDashoffset: 0,
      });
      gsap.set(eraseMaskStrokeRef.current, {
        strokeDasharray: `0 ${circumference}`,
        strokeDashoffset: 0,
      });
      gsap.fromTo(
        progressDotRef.current,
        { scale: 0.85 },
        { scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    ensureBreathTimeline();

    startedAtRef.current = performance.now() - accumElapsedRef.current;
    rafActiveRef.current = true;

    const tick = () => {
      if (!rafActiveRef.current || startedAtRef.current == null) return;
      const now = performance.now();
      const elapsed = Math.min(now - startedAtRef.current, timer * 1000);

      setProgressFrame(elapsed);

      const whole = Math.floor(elapsed / 1000);
      if (whole !== lastWholeSecRef.current) {
        lastWholeSecRef.current = whole;
        setDisplaySeconds(whole);
      }

      if (elapsed >= timer * 1000) {
        rafActiveRef.current = false;
        setIsRunning(false);
        setIsComplete(true);
        setIsPaused(false);
        accumElapsedRef.current = timer * 1000;
        breathTLRef.current?.kill();
        breathTLRef.current = null;

        // === DING ===
        playDing();

        onComplete?.();
        return;
      }
      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => {
      rafActiveRef.current = false;
      cancelAnimationFrame(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRunning,
    isPaused,
    timer,
    inhaleSec,
    exhaleSec,
    breathMinRatio,
    breathMaxRatio,
    circumference,
  ]);

  // Кнопки
  const handleStart = () => {
    // разблокируем звук по юзер-жесту
    void unlockDing();

    if (isRunning || isComplete) return;
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.96,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
    accumElapsedRef.current = 0;
    lastWholeSecRef.current = 0;
    setDisplaySeconds(0);
    setIsComplete(false);
    setIsPaused(false);
    setIsRunning(true);
    setRotationCount(0);
    setCurrentAngle(-90);
  };

  const handlePauseResume = () => {
    // подстраховка: разблокируем тоже
    void unlockDing();

    if (!isRunning) return;
    if (!isPaused) {
      setIsPaused(true);
      rafActiveRef.current = false;
      if (startedAtRef.current != null) {
        const now = performance.now();
        accumElapsedRef.current = Math.min(
          now - startedAtRef.current,
          timer * 1000
        );
      }
      breathTLRef.current?.pause();
    } else {
      setIsPaused(false);
      startedAtRef.current = performance.now() - accumElapsedRef.current;
      rafActiveRef.current = true;
      breathTLRef.current?.play();

      const loop = () => {
        if (!rafActiveRef.current || startedAtRef.current == null) return;
        const now = performance.now();
        const elapsed = Math.min(now - startedAtRef.current, timer * 1000);
        setProgressFrame(elapsed);
        const whole = Math.floor(elapsed / 1000);
        if (whole !== lastWholeSecRef.current) {
          lastWholeSecRef.current = whole;
          setDisplaySeconds(whole);
        }
        if (elapsed >= timer * 1000) {
          rafActiveRef.current = false;
          setIsRunning(false);
          setIsComplete(true);
          setIsPaused(false);
          accumElapsedRef.current = timer * 1000;
          breathTLRef.current?.kill();
          breathTLRef.current = null;

          // === DING ===
          playDing();

          onComplete?.();
          return;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  };

  const handleStop = () => {
    // на всякий случай разблокировать тоже можно
    void unlockDing();

    rafActiveRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    accumElapsedRef.current = 0;
    lastWholeSecRef.current = 0;
    setDisplaySeconds(0);
    setRotationCount(0);
    setCurrentAngle(-90);

    // Сброс окружностей/маски
    if (progressCircleRef.current) {
      gsap.set(progressCircleRef.current, {
        strokeDasharray: `0 ${circumference}`,
        strokeDashoffset: 0,
      });
    }
    if (eraseMaskStrokeRef.current) {
      gsap.set(eraseMaskStrokeRef.current, {
        strokeDasharray: `0 ${circumference}`,
        strokeDashoffset: 0,
      });
    }

    // Точка в верх
    if (progressDotRef.current) {
      gsap.set(progressDotRef.current, {
        cx: size / 2,
        cy: size / 2 - radius,
      });
    }

    // Остановить дыхание и вернуть к спокойному радиусу
    const el = breathCircleRef.current;
    breathTLRef.current?.kill();
    breathTLRef.current = null;
    if (el) {
      const calmR = radius * ((breathMinRatio + breathMaxRatio) / 2);
      gsap.to(el, { attr: { r: calmR }, duration: 0.35, ease: "power2.out" });
    }
  };

  const state: "initial" | "running" | "paused" | "complete" =
    !isRunning && displaySeconds === 0
      ? "initial"
      : isComplete
      ? "complete"
      : isPaused
      ? "paused"
      : "running";

  return (
    <>
      <div className={twMerge("block", className)} style={{ width: size }}>
        {/* Фиксированная область круга */}
        <div className='relative' style={{ width: size, height: size }}>
          <svg width={size} height={size} className='block'>
            {/* фон дорожки */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill='none'
              stroke='rgba(255,255,255,0.28)'
              strokeWidth={strokeWidth}
            />

            {/* градиенты + маска */}
            <defs>
              <linearGradient
                id='progressGradient'
                x1='0%'
                y1='0%'
                x2='0%'
                y2='100%'
              >
                <stop offset='0%' stopColor='#7766DA' />
                <stop offset='100%' stopColor='#5241B7' />
              </linearGradient>

              <linearGradient
                id='timerGradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#60A5FA' />
                <stop offset='100%' stopColor='#1E40AF' />
              </linearGradient>

              <mask
                id='eraseMask'
                maskUnits='userSpaceOnUse'
                maskContentUnits='userSpaceOnUse'
              >
                <rect width={size} height={size} fill='white' />
                <circle
                  ref={eraseMaskStrokeRef}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill='none'
                  stroke='black'
                  strokeWidth={strokeWidth}
                  strokeDasharray={`0 ${circumference}`}
                  strokeDashoffset={0}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  strokeLinecap='butt'
                />
              </mask>
            </defs>

            {/* дыхание */}
            {state !== "initial" && (
              <circle
                ref={breathCircleRef}
                cx={size / 2}
                cy={size / 2}
                r={radius * breathMinRatio}
                fill='url(#timerGradient)'
                opacity={0.95}
              />
            )}

            {/* прогресс под маской */}
            {state !== "initial" && (
              <circle
                ref={progressCircleRef}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='url(#progressGradient)'
                strokeWidth={strokeWidth}
                strokeDasharray={`0 ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                strokeLinecap='round'
                mask='url(#eraseMask)'
              />
            )}

            {/* метки */}
            <g fill='#FFFFFF'>
              <rect x={size / 2 - 2} y={0} width='4' height='24' rx='2' />
              <rect
                x={size - 24}
                y={size / 2 - 2}
                width='24'
                height='4'
                rx='2'
              />
              <rect
                x={size / 2 - 2}
                y={size - 24}
                width='4'
                height='24'
                rx='2'
              />
              <rect x={0} y={size / 2 - 2} width='24' height='4' rx='2' />
            </g>

            {/* бегущая точка */}
            {state !== "initial" && (
              <circle
                ref={progressDotRef}
                cx={size / 2}
                cy={size / 2 - radius}
                r='12'
                fill='#FFFFFF'
              />
            )}
          </svg>

          {/* центр — поверх круга */}
          <div
            ref={overlayRef}
            className='absolute inset-0 flex items-center justify-center'
          >
            {state === "initial" ? (
              <StartButton ref={buttonRef} onClick={handleStart} />
            ) : (
              <button
                ref={buttonRef}
                type='button'
                onClick={() => void 0}
                className='bg-transparent rounded-full w-[180px] h-[180px] grid place-items-center select-none'
              >
                <span className="text-white text-center font-['DM_Sans',sans-serif] text-[40px] leading-[52px] tracking-[2.23602px] font-bold tabular-nums">
                  {mmss}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {state !== "initial" && (
        <div className='pointer-events-auto -mt-1 flex items-center justify-between gap-4 w-full'>
          {/* Стоп */}
          <button
            type='button'
            onClick={handleStop}
            aria-label='Стоп'
            className='p-0 bg-transparent border-0'
          >
            <svg
              width='80'
              height='80'
              viewBox='0 0 80 80'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='40' cy='40' r='40' fill='white' />
              <path
                d='M45 30H35C32.2386 30 30 32.2386 30 35V45C30 47.7614 32.2386 50 35 50H45C47.7614 50 50 47.7614 50 45V35C50 32.2386 47.7614 30 45 30Z'
                fill='black'
              />
            </svg>
          </button>

          {/* Пауза / Продолжить */}
          <button
            type='button'
            onClick={handlePauseResume}
            aria-label={isPaused ? "Продолжить" : "Пауза"}
            className='p-0 bg-transparent border-0'
          >
            {isPaused ? (
              // PLAY
              <svg
                width='80'
                height='80'
                viewBox='0 0 80 80'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle cx='40' cy='40' r='40' fill='white' />
                <path
                  d='M46.3566 33.8045C50.1189 36.4351 52 37.7505 52 40.0001C52 42.2497 50.1189 43.5651 46.3566 46.1957C45.3181 46.9219 44.288 47.6056 43.3414 48.1753C42.511 48.6752 41.5705 49.1922 40.5968 49.6997C36.8434 51.6561 34.9667 52.6343 33.2835 51.5513C31.6003 50.4683 31.4473 48.201 31.1413 43.6666C31.0548 42.3842 31 41.1271 31 40.0001C31 38.8731 31.0548 37.616 31.1413 36.3336C31.4473 31.7992 31.6003 29.5319 33.2835 28.4489C34.9667 27.3659 36.8434 28.3441 40.5968 30.3005C41.5705 30.808 42.511 31.325 43.3414 31.8249C44.288 32.3946 45.3181 33.0783 46.3566 33.8045Z'
                  fill='black'
                />
              </svg>
            ) : (
              // PAUSE
              <svg
                width='80'
                height='80'
                viewBox='0 0 80 80'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle cx='40' cy='40' r='40' fill='white' />
                <path
                  d='M37.4 51H32.6C32.1757 51 31.7687 50.8946 31.4686 50.7071C31.1686 50.5196 31 50.2652 31 50V30C31 29.7348 31.1686 29.4804 31.4686 29.2929C31.7687 29.1054 32.1757 29 32.6 29H37.4C37.8243 29 38.2313 29.1054 38.5314 29.2929C38.8314 29.4804 39 29.7348 39 30V50C39 50.2652 38.8314 50.5196 38.5314 50.7071C38.2313 50.8946 37.8243 51 37.4 51Z'
                  fill='black'
                />
                <path
                  d='M47.4 51H42.6C42.1757 51 41.7687 50.8946 41.4686 50.7071C41.1686 50.5196 41 50.2652 41 50V30C31 29.7348 41.1686 29.4804 41.4686 29.2929C41.7687 29.1054 42.1757 29 42.6 29H47.4C47.8243 29 48.2313 29.1054 48.5314 29.2929C48.8314 29.4804 49 29.7348 49 30V50C49 50.2652 48.8314 50.5196 48.5314 50.7071C48.2313 50.8946 47.8243 51 47.4 51Z'
                  fill='black'
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default Timer;
