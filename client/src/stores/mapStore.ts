import { Location } from "@/models/place.model";
import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";

interface MapStore {
  mapCenter: Location;
  googleMap: google.maps.Map | null;
  setCenter: (newCenter: Location) => void;
  setGoogleMap: (map: google.maps.Map | null) => void;
  updateMapBounds: (map: google.maps.Map | null, places: SelectedPlace[]) => void;
}

const initialState: MapStore = {
  mapCenter: { lat: 38, lng: 128 }, // zoom 5
  // mapCenter: { lat: 20, lng: 90 }, // zoom 2.6
  googleMap: null,
  setCenter: () => {},
  setGoogleMap: () => {},
  updateMapBounds: () => {},
};

export const useMapStore = create<MapStore>((set) => ({
  mapCenter: initialState.mapCenter,
  googleMap: initialState.googleMap,
  setCenter: (newCenter: Location) => set({ mapCenter: newCenter }),
  setGoogleMap: (map: google.maps.Map | null) => set({ googleMap: map }),
  updateMapBounds: (map: google.maps.Map | null, places: SelectedPlace[]) => {
    set((state) => {
      const bounds = new window.google.maps.LatLngBounds();
      // console.log(map);

      if (map) {
        places.forEach((place) => {
          bounds.extend(new window.google.maps.LatLng(place.location.lat, place.location.lng));
        });

        map.fitBounds(bounds);
        return { ...state, mapCenter: { lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() } };
      }

      return state;
    });
  },
}));
