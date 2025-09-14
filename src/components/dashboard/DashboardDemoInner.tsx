// app/dashboard/page.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import HiteSummaryCard from "@/components/dashboard/HiteSummaryCard";
import PlanStep from "@/components/dashboard/PlanStep";
import UnlockModal from "@/components/dashboard/UnlockModal";
import {
  PlanProgress,
  StepState,
  readPlanProgress,
  resetAllProgress,
  consumeJustFinishedFlag,
} from "@/lib/planProgress";

type StepAvail = Exclude<StepState, "locked">;

export default function DashboardDemoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDiscoverOnly = searchParams.get("view") === "discover";

  const [hiteScore] = useState(952);
  const [level] = useState<"Rookie">("Rookie");
  const [activeStreak] = useState(5);

  const [discoverState, setDiscoverState] = useState<StepAvail>("available");
  const [trainState, setTrainState] = useState<StepState>("locked");
  const [executeState, setExecuteState] = useState<StepState>("locked");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalFor, setModalFor] = useState<"train" | "execute" | null>(null);

  const [showAllDoneOnce, setShowAllDoneOnce] = useState(false);

  const prevDiscoverRef = useRef<string | null>(null);
  const prevTrainRef = useRef<string | null>(null);

  useEffect(() => {
    if (consumeJustFinishedFlag()) {
      setShowAllDoneOnce(true);
      setTimeout(() => {
        resetAllProgress();
      }, 120);
    }
  }, []);

  const syncFromStorage = useCallback(() => {
    if (showDiscoverOnly) {
      setDiscoverState("available");
      setTrainState("locked");
      setExecuteState("locked");
      return;
    }

    const p: PlanProgress = readPlanProgress();

    const d: StepAvail = p.discover === "completed" ? "completed" : "available";
    const t: StepState =
      p.discover === "completed"
        ? p.train === "completed"
          ? "completed"
          : "available"
        : "locked";
    const e: StepState =
      p.execute === "completed"
        ? "completed"
        : p.execute === "available"
        ? "available"
        : "locked";

    setDiscoverState(d);
    setTrainState(t);
    setExecuteState(e);

    const prevD = prevDiscoverRef.current;
    const prevT = prevTrainRef.current;

    if (
      !showAllDoneOnce &&
      !showDiscoverOnly &&
      prevD !== "completed" &&
      d === "completed"
    ) {
      setModalFor("train");
      setModalVisible(true);
    }
    if (
      !showAllDoneOnce &&
      !showDiscoverOnly &&
      prevT !== "completed" &&
      t === "completed"
    ) {
      setModalFor("execute");
      setModalVisible(true);
    }

    prevDiscoverRef.current = d;
    prevTrainRef.current = t;
  }, [showDiscoverOnly, showAllDoneOnce]);

  useEffect(() => {
    if (!showDiscoverOnly || showAllDoneOnce) return;
    const p = readPlanProgress();
    const shouldShow = p.discover === "completed" && p.train === "available";
    const SEEN_KEY = "__train_popup_once";
    if (shouldShow && sessionStorage.getItem(SEEN_KEY) !== "1") {
      setTimeout(() => {
        setModalFor("train");
        setModalVisible(true);
        sessionStorage.setItem(SEEN_KEY, "1");
      }, 60);
    }
  }, [showDiscoverOnly, showAllDoneOnce]);

  useEffect(() => {
    syncFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "planProgress") syncFromStorage();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") syncFromStorage();
    };
    const onCustom = () => syncFromStorage();

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("planprogress:updated", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(
        "planprogress:updated",
        onCustom as EventListener
      );
    };
  }, [syncFromStorage]);

  const onStartDiscover = () => router.push("/discover");
  const onStartTrain = () =>
    trainState === "available" && router.push("/train");
  const onStartExecute = () =>
    executeState === "available" && router.push("/execute");

  const onModalAction = () => {
    setModalVisible(false);
    if (modalFor === "train") router.push("/train");
    if (modalFor === "execute") router.push("/execute");
    setModalFor(null);
  };

  const shouldShowAllDoneCard = useMemo(
    () =>
      showAllDoneOnce ||
      (discoverState === "completed" &&
        trainState === "completed" &&
        executeState === "completed"),
    [showAllDoneOnce, discoverState, trainState, executeState]
  );

  const clearedStoragesRef = useRef(false);

  useEffect(() => {
    if (!shouldShowAllDoneCard || clearedStoragesRef.current) return;

    const t = setTimeout(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // ignore
      }

      clearedStoragesRef.current = true;
    }, 3000);

    return () => clearTimeout(t);
  }, [shouldShowAllDoneCard]);

  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      <div
        className='w-full max-w-[560px] h-full  overflow-hidden flex flex-col py-6'
        style={{
          background: "url('/bg.png') center/cover",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.75)",
        }}
      >
        <div className='flex-1 '>
          <div className='px-2 text-white'>
            <header className='flex items-center justify-between mb-6'>
              <h1 className='text-4xl font-extrabold'>Hi there!</h1>
              <div className='flex items-center gap-4'>
                <button
                  aria-label='notifications'
                  className='w-10 h-10 rounded-full bg-white/6 grid place-items-center'
                >
                  <svg
                    width='18'
                    height='21'
                    viewBox='0 0 18 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.59888 0.774414L8.59895 0.0700662H8.59888V0.774414ZM16.3459 13.5908L17.0503 13.5909L17.0503 13.5908L16.3459 13.5908ZM13.1887 17.2939L13.2885 17.9912L13.2885 17.9912L13.1887 17.2939ZM8.5979 17.6992L8.59788 18.4036L8.5979 18.4036L8.5979 17.6992ZM4.00806 17.2939L3.90825 17.9912L3.90826 17.9912L4.00806 17.2939ZM0.85083 13.5908L0.146482 13.5908L0.146482 13.5909L0.85083 13.5908ZM8.59888 0.774414L8.5988 1.47876C11.6242 1.4791 14.0771 3.93178 14.0771 6.95703H14.7815H15.4858C15.4858 3.15363 12.4021 0.0704866 8.59895 0.0700662L8.59888 0.774414ZM14.7815 6.95703H14.0771V9.07694H14.7815H15.4858V6.95703H14.7815ZM15.7492 11.537L15.155 11.9152C15.4631 12.3991 15.6416 12.973 15.6416 13.5908L16.3459 13.5908L17.0503 13.5908C17.0503 12.697 16.791 11.8619 16.3434 11.1588L15.7492 11.537ZM16.3459 13.5908L15.6416 13.5907C15.6414 15.0931 14.5743 16.3841 13.0889 16.5967L13.1887 17.2939L13.2885 17.9912C15.5046 17.674 17.05 15.7561 17.0503 13.5909L16.3459 13.5908ZM13.1887 17.2939L13.0889 16.5967C11.6862 16.7975 9.95933 16.9949 8.5979 16.9949L8.5979 17.6992L8.5979 18.4036C10.0642 18.4036 11.8729 18.1938 13.2885 17.9912L13.1887 17.2939ZM8.5979 17.6992L8.59792 16.9949C7.2366 16.9948 5.5104 16.7975 4.10786 16.5967L4.00806 17.2939L3.90826 17.9912C5.32367 18.1938 7.13174 18.4035 8.59788 18.4036L8.5979 17.6992ZM4.00806 17.2939L4.10786 16.5967C2.62246 16.3841 1.55539 15.0931 1.55518 13.5907L0.85083 13.5908L0.146482 13.5909C0.146795 15.7561 1.69213 17.674 3.90825 17.9912L4.00806 17.2939ZM0.85083 13.5908L1.55518 13.5908C1.55518 12.9727 1.73383 12.3986 2.04203 11.9145L1.44788 11.5362L0.853722 11.158C0.405917 11.8613 0.146482 12.6968 0.146482 13.5908L0.85083 13.5908ZM2.41626 9.07534H3.12061V6.95703H2.41626H1.71191V9.07534H2.41626ZM2.41626 6.95703H3.12061C3.12061 3.93147 5.57332 1.47876 8.59888 1.47876V0.774414V0.0700662C4.79532 0.0700662 1.71191 3.15347 1.71191 6.95703H2.41626ZM1.44788 11.5362L2.04203 11.9145C2.50797 11.1826 3.12061 10.2069 3.12061 9.07534H2.41626H1.71191C1.71191 9.73637 1.3505 10.3777 0.853722 11.158L1.44788 11.5362ZM14.7815 9.07694H14.0771C14.0771 10.2081 14.6893 11.1835 15.155 11.9152L15.7492 11.537L16.3434 11.1588C15.847 10.3788 15.4858 9.73769 15.4858 9.07694H14.7815Z'
                      fill='white'
                      fillOpacity='0.8'
                    />
                    <path
                      d='M10.5547 19.166C10.1341 19.8261 9.41481 20.2612 8.59817 20.2612C7.78153 20.2612 7.06227 19.8261 6.64165 19.166'
                      stroke='white'
                      strokeOpacity='0.8'
                      strokeWidth='1.4087'
                      strokeLinecap='round'
                    />
                  </svg>
                </button>
                <button
                  aria-label='profile'
                  className='w-12 h-12 rounded-full bg-white/6 grid place-items-center'
                >
                  <svg width='26' height='26' viewBox='0 0 30 30' fill='none'>
                    <circle cx='15' cy='8.5' r='6' fill='#CFD2D9' />
                    <rect
                      x='3'
                      y='17'
                      width='24'
                      height='10'
                      rx='5'
                      fill='#CFD2D9'
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Summary */}
            <section className='relative mb-8'>
              <HiteSummaryCard
                score={hiteScore}
                level={level}
                streakDays={activeStreak + (shouldShowAllDoneCard ? 1 : 0)}
                weekLabel='This week'
                plansDone={shouldShowAllDoneCard ? 3 : 2}
                plansTotal={4}
                timeSpent='1h 15m'
                onShowMore={() => {}}
              />
            </section>

            {/* Today's Plan */}
            <section className='mb-8'>
              <h3 className='text-2xl font-bold mb-4'>Today&apos;s Plan</h3>

              {shouldShowAllDoneCard ? (
                <div
                  className='rounded-2xl p-8 flex flex-col items-center justify-center text-center'
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className='text-white/80 mb-4'>
                    You&apos;re All Done For Today
                  </p>
                  <div className='w-20 h-20 grid place-items-center'>
                    <Image src='/check.png' alt='Done' width={80} height={80} />
                  </div>
                </div>
              ) : (
                <div className='relative'>
                  <div
                    className='absolute left-1 top-0 bottom-0 w-1 rounded-full bg-white/10'
                    style={{ transform: "translateX(-50%)" }}
                  />
                  <div className='space-y-4 pl-3'>
                    <PlanStep
                      title='Discover'
                      iconSrc='/Discover.png'
                      state={discoverState}
                      accent
                      onStart={onStartDiscover}
                    />
                    <PlanStep
                      title='Train'
                      iconSrc='/Train.png'
                      state={trainState}
                      onStart={onStartTrain}
                    />
                    <PlanStep
                      title='Execute'
                      iconSrc='/Execute.png'
                      state={executeState}
                      onStart={onStartExecute}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Coach's Corner */}
            <section style={{ marginBottom: 32 }}>
              <h3 className='text-2xl font-bold mb-4'>Coach&apos;s Corner</h3>
              <div
                className='rounded-2xl p-6 bg-gradient-to-br from-[#151029] to-[#2a1630] border border-white/10 shadow-lg'
                style={{ minHeight: 160 }}
              >
                <h4 className='text-lg font-semibold mb-2'>
                  Composure Under Pressure
                </h4>
                <p className='text-white/70 leading-relaxed mb-4'>
                  Staying calm in tough moments helps you think clearly, make
                  smart decisions, and avoid mistakes. When you&apos;re
                  composed, pressure doesn&apos;t shake you — it sharpens you.
                </p>
                <div className='flex items-center gap-3'>
                  <button className='px-4 py-2 rounded-full bg-white text-black'>
                    Coach Check-ins
                  </button>
                  <button className='px-4 py-2 rounded-full bg-transparent border border-white/10 text-white/80'>
                    Show more
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <UnlockModal
        open={modalVisible && !showAllDoneOnce}
        kind={modalFor}
        onClose={() => setModalVisible(false)}
        onAction={onModalAction}
      />
    </div>
  );
}
