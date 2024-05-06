import { Location } from "@/models/place.model";
import { create } from "zustand";

interface MapStore {
  mapCenter: Location;
  googleMap: google.maps.Map | null;
  setCenter: (newCenter: Location) => void;
  setGoogleMap: (map: google.maps.Map | null) => void;
}

const initialState: MapStore = {
  mapCenter: { lat: 20, lng: 90 },
  googleMap: null,
  setCenter: () => {},
  setGoogleMap: () => {},
};

export const useCenterStore = create<MapStore>((set) => ({
  mapCenter: initialState.mapCenter,
  googleMap: initialState.googleMap,
  setCenter: (newCenter: Location) => set({ mapCenter: newCenter }),
  setGoogleMap: (map: google.maps.Map | null) => set({ googleMap: map }),
}));
