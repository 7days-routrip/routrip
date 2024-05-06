import { Place } from "@/models/place.model";
import { create } from "zustand";

interface SearchPlacesStore {
  searchPlace: Place | null;
  setSearchPlace: (place: Place) => void;
}

export const useSearchPlacesStore = create<SearchPlacesStore>((set) => ({
  searchPlace: null,
  setSearchPlace: (place: Place) => {
    set({ searchPlace: place });
  },
}));
