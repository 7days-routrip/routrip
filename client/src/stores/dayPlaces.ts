import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";

interface DayPlacesStore {
  dayPlaces: SelectedPlace[][];
  setDayPlaces: (places: SelectedPlace[][]) => void;
  removeDayPlace: (uuid: string) => void;
}

export const useDayPlaceStore = create<DayPlacesStore>((set) => ({
  dayPlaces: [[]],
  setDayPlaces: (places: SelectedPlace[][]) => {
    set({ dayPlaces: places });
  },
  removeDayPlace: (uuid: string) => {
    set((state) => ({
      dayPlaces: state.dayPlaces.map((placesInDay) => placesInDay.filter((place) => place.uuid !== uuid)),
    }));
  },
}));
