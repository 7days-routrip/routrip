import { Place } from "@/models/place.model";
import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";

interface MapStore {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map | null) => void;
  updateMapBounds: (places: SelectedPlace[] | Place[]) => void;
}

const initialState: MapStore = {
  googleMap: null,
  setGoogleMap: () => {},
  updateMapBounds: () => {},
};

export const useMapStore = create<MapStore>((set) => ({
  googleMap: initialState.googleMap,
  setGoogleMap: (map: google.maps.Map | null) => set({ googleMap: map }),
  updateMapBounds: (places: SelectedPlace[] | Place[]) => {
    set((state) => {
      const bounds = new google.maps.LatLngBounds();

      if (state.googleMap && places.length > 0) {
        places.forEach((place) => {
          bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));
        });

        state.googleMap.fitBounds(bounds);
      }
      return state;
    });
  },
}));
