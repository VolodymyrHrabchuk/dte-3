"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Flashcards = dynamic(() => import("@/components/Flashcards"), {
  ssr: false,
});

import type { FlashcardsContent } from "@/components/Flashcards";

const isVideoSrc = (src: string) => /\.mp4$|\.webm$|\.ogg$/i.test(src ?? "");

export default function TrainPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // 🔊 swipe sound
  const swipeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof Audio === "undefined") return;

    const a = new Audio("/swipe.mp3");
    a.preload = "auto";
    a.volume = 0.5;
    // @ts-expect-error playsInline exists in browsers
    a.playsInline = true;
    swipeAudioRef.current = a;

    const unlock = () => {
      const el = swipeAudioRef.current;
      if (!el) return;
      el.muted = true;
      el.play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
          el.muted = false;
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      if (swipeAudioRef.current) {
        swipeAudioRef.current.pause();
        // clear src to release the resource
        swipeAudioRef.current.src = "";
        swipeAudioRef.current = null;
      }
    };
  }, []);

  const playSwipe = () => {
    const a = swipeAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  };

  const flashcards: FlashcardsContent[] = useMemo(
    () => [
      {
        id: "f1",
        type: "timer",
        title:
          "Use this time to visualize a recent moment when you competed with clarity and confidence.",
        content:
          "Play the scene back in your mind. What were you relying on internally to hold that space?",
        backgroundImage: "/timer-bg.png",
      },
      {
        id: "f2",
        type: "text",
        title: "Confidence You Can Trust",
        content:
          "Confidence that holds over time usually has real experiences behind it. These are the moments where you kept your composure, reset after a mistake, or competed with focus even when things were difficult. The way you respond in those situations shapes your sense of belief. Athletes often describe their strongest confidence as something they can trace back to effort, steadiness, or recovery. That kind of strength is worth paying attention to.",
        backgroundImage: "/fire-bg.png",
      },
      {
        id: "f3",
        type: "input",
        title:
          "Think about how you can return to that internal anchor the next time things feel uncertain.",
        content:
          "What does that version of you pay attention to? What needs to stay in focus?",
        backgroundImage: "/input-bg.png",
      },
    ],
    []
  );

  useEffect(() => setActiveIndex(0), []);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    playSwipe();
  };

  const handleComplete = async () => {
    const { completeTrainMakeExecuteAvailable } = await import(
      "@/lib/planProgress"
    );
    completeTrainMakeExecuteAvailable();
    router.push("/dashboard");
  };

  useEffect(() => {
    const activeId = flashcards[activeIndex]?.id;

    Object.entries(videoRefs.current).forEach(([id, el]) => {
      if (!el) return;

      const mute = () => {
        el.muted = true;
        el.defaultMuted = true;
        el.setAttribute("muted", "");
      };

      if (id === activeId) {
        try {
          el.muted = false;
          el.defaultMuted = false;
          el.removeAttribute("muted");
          el.volume = 1;
          el.play().catch(() => {
            mute();
            el.play().catch(() => {});
          });
        } catch {
          mute();
        }
      } else {
        mute();
        el.pause();
      }
    });

    return () => {
      Object.values(videoRefs.current).forEach((el) => {
        if (!el) return;
        try {
          el.pause();
          el.muted = true;
          el.defaultMuted = true;
          el.setAttribute("muted", "");
        } catch {}
      });
    };
  }, [activeIndex, flashcards]);

  return (
    <div className='w-full h-full flex justify-center'>
      <div className='min-h-screen max-w-md relative overflow-hidden'>
        <div className='absolute inset-0'>
          {flashcards.map((card) => {
            const src = card.backgroundImage || "/video-bg.png";
            const active = card.id === flashcards[activeIndex]?.id;
            const video = isVideoSrc(src);

            return (
              <div
                key={card.id}
                aria-hidden
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                } pointer-events-none`}
              >
                {video ? (
                  <>
                    <video
                      ref={(el) => {
                        videoRefs.current[card.id] = el;
                      }}
                      className='absolute inset-0 w-full h-full object-cover blur-[10px] scale-110'
                      src={src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div
                      className={`absolute inset-0 ${
                        card.id === "f2" && active
                          ? "bg-black/70"
                          : "bg-black/30"
                      }`}
                    />
                  </>
                ) : (
                  <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url("${src}")` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className='relative z-10'>
          <div className='h-screen flex flex-col'>
            <Flashcards
              cards={flashcards}
              onComplete={handleComplete}
              onSlideChange={handleSlideChange}
              className='flex-1'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
