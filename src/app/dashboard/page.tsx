"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import HiteSummaryCard from "@/components/dashboard/HiteSummaryCard";
import PlanStep from "@/components/dashboard/PlanStep";
import UnlockModal from "@/components/dashboard/UnlockModal";

import { PlanProgress, StepState, readPlanProgress } from "@/lib/planProgress";
import { useProfileStore } from "@/stores/profile";

type StepAvail = Exclude<StepState, "locked">;

export default function DashboardDemo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDiscoverOnly = searchParams.get("view") === "discover";

  // имя пользователя из persist-стора
  const profileName = useProfileStore((s) => s.name);
  const greeting = profileName?.trim() ? `Hi, ${profileName}!` : "Hi there!";

  // демонстрационные метрики
  const [hiteScore] = useState(1074);
  const [level] = useState<"Rookie" | "Starter">("Starter");
  const [activeStreak] = useState(6);

  const [discoverState, setDiscoverState] = useState<StepAvail>("available");
  const [trainState, setTrainState] = useState<StepState>("locked");
  const [executeState, setExecuteState] = useState<StepState>("locked");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalFor, setModalFor] = useState<"train" | "execute" | null>(null);

  const prevDiscoverRef = useRef<string | null>(null);
  const prevTrainRef = useRef<string | null>(null);

  // добавь рядом с импортами/хуками
  const TRAIN_SEEN_KEY = "__unlock_train_seen";
  const EXEC_SEEN_KEY = "__unlock_execute_seen";

  const hasSeen = (k: string) => {
    try {
      return localStorage.getItem(k) === "1";
    } catch {
      return false;
    }
  };
  const markSeen = (k: string) => {
    try {
      localStorage.setItem(k, "1");
    } catch {}
  };

  // ЗАМЕНИ содержание syncFromStorage полностью
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

    // ---- Больше никаких попапов, если всё уже сделано
    if (d === "completed" && t === "completed" && e === "completed") {
      prevDiscoverRef.current = d;
      prevTrainRef.current = t;
      return;
    }

    // предыдущие значения (для детекта перехода)
    const prevD = prevDiscoverRef.current;
    const prevT = prevTrainRef.current;

    // TRAIN unlocked: Discover стал completed, а Train сейчас available
    if (
      prevD !== "completed" &&
      d === "completed" &&
      t === "available" &&
      !hasSeen(TRAIN_SEEN_KEY)
    ) {
      setModalFor("train");
      setModalVisible(true);
      markSeen(TRAIN_SEEN_KEY);
    }

    // EXECUTE unlocked: Train стал completed, а Execute сейчас available
    if (
      prevT !== "completed" &&
      t === "completed" &&
      e === "available" &&
      !hasSeen(EXEC_SEEN_KEY)
    ) {
      setModalFor("execute");
      setModalVisible(true);
      markSeen(EXEC_SEEN_KEY);
    }

    prevDiscoverRef.current = d;
    prevTrainRef.current = t;
  }, [showDiscoverOnly]);

  // Попап один раз при заходе с Discover (?view=discover)
  useEffect(() => {
    if (!showDiscoverOnly) return;
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
  }, [showDiscoverOnly]);

  useEffect(() => {
    syncFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "planProgress") syncFromStorage();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") syncFromStorage();
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
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

  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      {/* фон-приложения */}
      <div className='absolute inset-0 -z-10'>
        <Image src='/bg.png' alt='' fill priority className='object-cover' />
        <div className='absolute inset-0 bg-black/40' />
      </div>

      {/* Мобильный фрейм */}
      <div
        className='w-full max-w-[560px] h-full rounded-[28px] overflow-hidden flex flex-col py-6'
        style={{
          background:
            "linear-gradient(180deg, rgba(11,17,37,0.75), rgba(0,0,0,0.65))",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.75)",
        }}
      >
        <div className='flex-1 overflow-auto'>
          <div className='px-2 text-white'>
            {/* Header */}
            <header className='flex items-center justify-between mb-6'>
              <h1 className='text-4xl font-extrabold'>{greeting}</h1>
              <div className='flex items-center gap-4'>
                <button
                  aria-label='notifications'
                  className='w-10 h-10 rounded-full bg-white/6 grid place-items-center'
                >
                  <span className='block w-2 h-2 rounded-full bg-[#FD521B]' />
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
                streakDays={activeStreak}
                weekLabel='This week'
                plansDone={3}
                plansTotal={4}
                timeSpent='1h 15m'
                onShowMore={() => {}}
              />
            </section>

            {/* Today's Plan */}
            <section className='mb-8'>
              <h3 className='text-2xl font-bold mb-4'>Today&apos;s Plan</h3>

              {discoverState === "completed" &&
              trainState === "completed" &&
              executeState === "completed" ? (
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

      {/* Unlock modal */}
      <UnlockModal
        open={modalVisible}
        kind={modalFor}
        onClose={() => setModalVisible(false)}
        onAction={onModalAction}
      />
    </div>
  );
}
