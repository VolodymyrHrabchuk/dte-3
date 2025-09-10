"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock, ChevronDown } from "lucide-react";
import * as React from "react";

type Props = {
  score: number; 
  level: "Rookie" | string; 
  streakDays: number; 
  weekLabel?: string; 
  plansDone?: number; 
  plansTotal?: number; 
  timeSpent?: string; 
  onShowMore?: () => void; 
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export default function HiteSummaryCard({
  score,
  level,
  streakDays,
  weekLabel = "This week",
  plansDone = 2,
  plansTotal = 4,
  timeSpent = "1h 15m",
  onShowMore,
}: Props) {
  return (
    <motion.div
      className='relative w-full rounded-2xl overflow-hidden border border-white/10'
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      style={{
        background:
          "linear-gradient(180deg, rgba(6,10,18,0.55), rgba(2,4,8,0.35))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
    
      <div
        aria-hidden
        className='absolute inset-0 pointer-events-none'
        style={{
          backgroundImage: "url('/hite-score-bg.png')",
          backgroundSize: "290px 140px",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
        }}
      />

      <div className='relative z-10 p-[18px] text-white'>

        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
  
              <Image src='/icon1.png' alt='HITE' width={28} height={28} />
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-lg font-medium'>HITE Score</span>


              <div className='mt-1 inline-block text-[10px]'>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.span
                    key={level}
                    initial={{ opacity: 0, y: 6, scale: 0.95, rotateX: -40 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95, rotateX: 40 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className='inline-flex items-center gap-1 px-2 py-1 rounded-2xl'
                    style={{
                      backgroundColor: "#363391",
                      color: "#B2FF8B",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
         
                    🌱 {level}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.span
            className='text-3xl font-bold tabular-nums'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          >
            {score}
          </motion.span>
        </div>


        <div
          className='my-2'
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          }}
        />

        {/* === Active Streak === */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-white/6 flex items-center justify-center'>
              <svg
                width='18'
                height='20'
                viewBox='0 0 18 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10.1123 19.7956C13.3272 19.1512 17.484 16.8385 17.484 10.858C17.484 5.41581 13.5004 1.79182 10.636 0.12664C10.0003 -0.242859 9.25623 0.243078 9.25623 0.978287V2.85883C9.25623 4.34173 8.63275 7.04852 6.90034 8.17437C6.01585 8.74918 5.06061 7.88886 4.95311 6.8395L4.86484 5.97781C4.76223 4.97607 3.742 4.36796 2.94138 4.97871C1.50307 6.07592 0 7.99727 0 10.858C0 18.1716 5.43947 20 8.1592 20C8.31739 20 8.48364 19.9953 8.6567 19.9853C7.31377 19.8705 5.14235 19.0373 5.14235 16.3429C5.14235 14.2353 6.67999 12.8094 7.84828 12.1163C8.16249 11.9299 8.53025 12.1719 8.53025 12.5373V13.1432C8.53025 13.607 8.70961 14.3319 9.13655 14.8282C9.61968 15.3897 10.3288 14.8015 10.386 14.0629C10.4041 13.8299 10.6384 13.6814 10.8402 13.7993C11.4997 14.1848 12.3416 15.0083 12.3416 16.3429C12.3416 18.4492 11.1805 19.4181 10.1123 19.7956Z'
                  fill='#E4782A'
                />
              </svg>
            </div>
            <span className='text-[15px]'>Active Streak</span>
          </div>

          <span className='text-[15px] font-semibold'>{streakDays} days</span>
        </div>

        <div
          className='mt-1 rounded-xl px-3 py-3 flex items-center justify-between'
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className='flex items-center gap-4 text-sm'>
            <div className='flex items-center gap-1.5'>
              <div className='w-6 h-6 rounded-full bg-white/6 flex items-center justify-center'>
                <Calendar size={14} />
              </div>
              <span className='text-[#B59CFF]'>{weekLabel}</span>
            </div>

            <div className='flex items-center gap-1.5 text-white/80'>
              <div className='w-5 h-5 rounded-full bg-white/6 flex items-center justify-center text-xs'>
              
                <div
                  className='w-1.5 h-1.5 rounded-full'
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>
              <span className='tabular-nums'>
                {plansDone}/{plansTotal} daily plans
              </span>
            </div>

            <div className='flex items-center gap-1.5 text-white/80'>
              <div className='w-5 h-5 rounded-full bg-white/6 flex items-center justify-center'>
                <Clock size={12} />
              </div>
              <span className='tabular-nums'>{timeSpent}</span>
            </div>
          </div>
        </div>
        <button
          type='button'
          onClick={onShowMore}
          className='flex items-center gap-1 ml-auto text-white/80 hover:text-white transition text-sm'
        >
          Show More
          <ChevronDown size={12} />
        </button>
      </div>
    </motion.div>
  );
}
