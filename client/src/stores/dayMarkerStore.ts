import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";
import { Place } from "@/models/place.model";

export type ClickType = "add" | "day" | "searchApi" | "searchGoogle" | "bookmarkList";

interface ShowMarkerTypeStore {
  markerType: ClickType;
  dayIndex: number | null; // "add"타입일 때는 null, "day"타입일 때는 number
  clickMarker: SelectedPlace | Place | null;
  setMarkerType: (type: ClickType, dayIndex?: number) => void;
  setClickMarker: (marker: SelectedPlace | Place | null) => void;
}

export const useShowMarkerTypeStore = create<ShowMarkerTypeStore>((set) => ({
  markerType: "searchApi",
  dayIndex: null,
  clickMarker: null,
  setMarkerType: (type: ClickType, dayIndex?: number) => {
    set({ markerType: type, dayIndex: type === "day" ? dayIndex : null });
  },
  setClickMarker: (marker: SelectedPlace | Place | null) => set({ clickMarker: marker }),
}));
