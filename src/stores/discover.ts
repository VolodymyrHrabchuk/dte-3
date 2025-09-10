import { create } from 'zustand';

export type Focus = 'self-confidence' | 'inner-strength' | 'mental-toughness';
export type Helper =
  | 'breakthrough'
  | 'goals-progress'
  | 'focused'
  | 'habits'
  | 'lead-improve';

interface DiscoverState {
  step: 1 | 2 | 3;
  focus?: Focus;
  rating?: 1 | 2 | 3 | 4 | 5;
  helper?: Helper;
  setFocus: (f: Focus) => void;
  setRating: (r: 1 | 2 | 3 | 4 | 5) => void;
  setHelper: (h: Helper) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export const useDiscover = create<DiscoverState>((set) => ({
  step: 1,
  setFocus: (focus) => set({ focus, step: 2 }),
  setRating: (rating) => set({ rating, step: 3 }),
  setHelper: (helper) => set({ helper }),

  next: () =>
    set((s) => {
      const nextStep = Math.min(3, s.step + 1) as 1 | 2 | 3;
      return { step: nextStep };
    }),

  prev: () =>
    set((s) => {
      const prevStep = Math.max(1, s.step - 1) as 1 | 2 | 3;
      return { step: prevStep };
    }),

  reset: () => ({
    step: 1,
    focus: undefined,
    rating: undefined,
    helper: undefined,
  }),
}));
