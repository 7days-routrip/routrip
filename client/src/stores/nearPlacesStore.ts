import { Place } from "@/models/place.model";
import { create } from "zustand";

// {
//   id: string;// place_id
//   placeName: string; // name
//   location: Location; // {lat: location.lat(), lng: location.lng()}
//   address: string; // vicinity
// }

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
