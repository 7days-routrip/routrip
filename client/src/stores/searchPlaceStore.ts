import { Place } from "@/models/place.model";
import { create } from "zustand";

interface SearchPlacesStore {
  searchPlace: Place[];
  setSearchPlace: (place: Place[]) => void;
}

export const useSearchPlacesStore = create<SearchPlacesStore>((set) => ({
  searchPlace: [],
  setSearchPlace: (place: Place[]) => {
    set({ searchPlace: place });
  },
}));
