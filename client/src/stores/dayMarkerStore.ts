import { create } from "zustand";

export type ClickType = "add" | "day";

interface ShowMarkerTypeStore {
  markerType: ClickType;
  dayIndex: number | null; // "add"타입일 때는 null, "day"타입일 때는 number
  setMarkerType: (type: ClickType, dayIndex?: number) => void;
}

export const useShowMarkerTypeStore = create<ShowMarkerTypeStore>((set) => ({
  markerType: "add",
  dayIndex: null,
  setMarkerType: (type: ClickType, dayIndex?: number) => {
    set({ markerType: type, dayIndex: type === "add" ? null : dayIndex });
  },
}));
