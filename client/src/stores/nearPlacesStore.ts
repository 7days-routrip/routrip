import { Place } from "@/models/place.model";
import { create } from "zustand";

interface NearPlacesStore {
  nearPlaces: Place[];
  setNearPlaces: (places: Place[]) => void;
}

export const useNearPlacesStore = create<NearPlacesStore>((set) => ({
  nearPlaces: [],
  setNearPlaces: (places: Place[]) => {
    set({ nearPlaces: places });
  },
}));
