import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";

interface DayPlacesStore {
  dayPlaces: SelectedPlace[][];
  setDayPlaces: (places: SelectedPlace[][]) => void;
}

export const useDayPlaceStore = create<DayPlacesStore>((set) => ({
  dayPlaces: [[]],
  setDayPlaces: (places: SelectedPlace[][]) => {
    set({ dayPlaces: places });
  },
}));
