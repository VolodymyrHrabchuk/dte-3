"use client";
import Counter from "./timer/Counter";
import { FlashcardsContent } from "./Flashcards";
import AudioIcon from "./icons/AudioIcon";
import SwipeIcon from "./icons/SwipeIcon";
import BackButton from "./ui/BackButton";
import BookmarkButton from "./ui/BookmarkButton";
import TextArea from "./ui/TextArea";
import Timer from "./timer/Timer";
import Swiper from "swiper";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./ui/Button";
import { createPortal } from "react-dom";

type FlashcardSlideProps = {
  card: FlashcardsContent;
  isActive: boolean;
  index: number;
  cardsLength: number;
  userInput: string;
  onUserInputChange: (value: string) => void;
  swiper: Swiper | null;
  onComplete?: () => void;
  onBack?: () => void;
};


const TIMER_STARTED_EVT = "flashcards:timer-started";

export default function FlashcardSlide({
  card,
  isActive,
  index,
  cardsLength,
  userInput,
  onUserInputChange,
  swiper,
  onComplete,
  onBack,
}: FlashcardSlideProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const hasTyped = useMemo(
    () => card.type === "input" && userInput.trim().length > 0,
    [card.type, userInput]
  );
  const isLastSlide = index === cardsLength - 1;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActiveNow = isActive || swiper?.activeIndex === index;

  const handleSubmit = () => {
    if (swiper && !isLastSlide) {
      swiper.slideTo(index + 1, 300);
    } else {
      onComplete?.();
    }
  };


  const [timerKey, setTimerKey] = useState(0);
  const lastResetAtRef = useRef(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
    let el: HTMLElement | null = node?.parentElement ?? null;
    while (el && el !== document.body) {
      const st = getComputedStyle(el);
      if (/(auto|scroll)/.test(st.overflowY)) return el;
      el = el.parentElement;
    }
    return window;
  };

  useEffect(() => {
    if (!(card.type === "timer" && isActiveNow)) return;

    const resetTimer = () => {
      const now = performance.now();
      if (now - lastResetAtRef.current < 500) return; 
      lastResetAtRef.current = now;
      setTimerKey((k) => k + 1);
    };

    const scrollTarget = getScrollParent(rootRef.current);
    const onScroll = () => resetTimer();
    const onWheel = () => resetTimer();
    const onTouchMove = () => resetTimer();

    (scrollTarget as HTMLElement | Window).addEventListener(
      "scroll",
      onScroll as EventListener,
      { passive: true } as AddEventListenerOptions
    );
    window.addEventListener("wheel", onWheel as EventListener, {
      passive: true,
    });
    window.addEventListener("touchmove", onTouchMove as EventListener, {
      passive: true,
    });

    return () => {
      (scrollTarget as HTMLElement | Window).removeEventListener(
        "scroll",
        onScroll as EventListener
      );
      window.removeEventListener("wheel", onWheel as EventListener);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
    };
  }, [card.type, isActiveNow]);

  const [hasTimerStarted, setHasTimerStarted] = useState(false);

  useEffect(() => {

    setHasTimerStarted(false);
    const onStarted = () => setHasTimerStarted(true);
    window.addEventListener(TIMER_STARTED_EVT, onStarted);
    return () => window.removeEventListener(TIMER_STARTED_EVT, onStarted);
  }, []);

  const showSwipe = hasTimerStarted; 

  return (
    <div ref={rootRef} className='h-full flex flex-col'>
      <BackButton
        onClick={() => {
          if (onBack) return onBack();
          if (index > 0) swiper?.slidePrev();
        }}
        className='z-10 mt-[1.5rem] mb-6'
      />

      <div className='flex-1 flex flex-col justify-center items-center'>
        {card.type === "video" && (
          <div className='w-full h-full'>
            <Counter count={index} length={cardsLength} />
          </div>
        )}

        {card.type === "timer" && (
          <div className='w-full h-full'>
            <div className='flex flex-col space-y-4 mb-12'>
              <Counter count={index} length={cardsLength} />
              {card.title && (
                <h1 className='text-2xl font-medium text-white leading-tight'>
                  {card.title}
                </h1>
              )}
              {card.content && <p className='text-white'>{card.content}</p>}
            </div>

            <div className='flex-col items-center justify-center'>
              <Timer key={timerKey} timer={60} className='mx-auto' />
            </div>
          </div>
        )}

        {card.type === "text" && (
          <div className='w-full h-full'>
            <div className='flex flex-col mt-14 w-full space-y-4'>
              <Counter count={index} length={cardsLength} />
              {card.title && (
                <h1 className='text-2xl font-medium text-white leading-tight'>
                  {card.title}
                </h1>
              )}
              {card.content && <p className='text-white'>{card.content}</p>}
              {card.audioUrl && (
                <div className='flex justify-center -mx-4'>
                  <AudioIcon />
                </div>
              )}
            </div>
          </div>
        )}

        {card.type === "input" && (
          <div className='flex flex-col w-full h-full space-y-4'>
            <Counter count={index} length={cardsLength} />
            {card.title && (
              <h1 className='text-2xl font-medium text-white leading-tight'>
                {card.title}
              </h1>
            )}
            {card.content && <p className='text-white'>{card.content}</p>}
            <TextArea
              value={userInput}
              onChange={(e) => onUserInputChange(e.target.value)}
            />
          </div>
        )}
      </div>


      {showSwipe && index < 1 && (
        <div className='flex justify-center mb-[4.125rem]'>
          <SwipeIcon />
        </div>
      )}


      {card.type === "input" && hasTyped && isActiveNow && mounted
        ? createPortal(
            <div className='fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] z-[1000]'>
              <div className='mx-auto w-full max-w-md px-4'>
                <Button
                  onClick={handleSubmit}
                  variant='button'
                  aria-label='Submit'
                  className='w-full'
                >
                  Submit
                </Button>
              </div>
            </div>,
            document.body
          )
        : null}

      <BookmarkButton
        className='fixed z-30 bottom-[2.375rem] right-4'
        active={bookmarked}
        onClick={() => setBookmarked((b) => !b)}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      />
    </div>
  );
}
