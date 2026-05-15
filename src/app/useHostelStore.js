import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useHostelStore = create(
  persist(
    (set) => ({
      selectedHostel: null,

      setHostel: (hostel) => set({ selectedHostel: hostel }),
    }),
    {
      name: "hostel-storage", // key in localStorage
    },
  ),
);
