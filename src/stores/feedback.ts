// store/feedback.ts
"use client";
import { create } from "zustand";

type FeedbackState = {
  overallRating: number | null;
  helpfulRating: number | null;
  engagingRating: number | null;
  freeText: string;

  setOverallRating: (n: number) => void;
  setHelpfulRating: (n: number | null) => void;
  setEngagingRating: (n: number | null) => void;
  setFreeText: (s: string) => void;
  reset: () => void;
};

export const useFeedbackStore = create<FeedbackState>((set) => ({
  overallRating: null,
  helpfulRating: null,
  engagingRating: null,
  freeText: "",

  setOverallRating: (n) => set({ overallRating: n }),
  setHelpfulRating: (n) => set({ helpfulRating: n }),
  setEngagingRating: (n) => set({ engagingRating: n }),
  setFreeText: (s) => set({ freeText: s }),
  reset: () => set({ overallRating: null, helpfulRating: null, engagingRating: null, freeText: "" }),
}));