// stores/profile.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileState = {
  name: string;
  setName: (name: string) => void;
  clear: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: "",
      setName: (name) => set({ name }),
      clear: () => set({ name: "" }),
    }),
    { name: "profile" } 
  )
);