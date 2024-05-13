import { Place } from "@/models/place.model";
import { create } from "zustand";

interface SearchPlacesStore {
  searchPlaces: Place[];
  setSearchPlaces: (place: Place[]) => void;
}

export const useSearchPlacesStore = create<SearchPlacesStore>((set) => ({
  searchPlaces: [],
  setSearchPlaces: (place: Place[]) => {
    set({ searchPlaces: place });
  },
}));
