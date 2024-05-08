import { Location, Place } from "@/models/place.model";
import { create } from "zustand";
import { SelectedPlace } from "./addPlaceStore";

interface MapStore {
  mapCenter: Location;
  googleMap: google.maps.Map | null;
  setCenter: (newCenter: Location) => void;
  setGoogleMap: (map: google.maps.Map | null) => void;
  updateMapBounds: (map: google.maps.Map | null, places: SelectedPlace[] | Place[]) => void;
}

const initialState: MapStore = {
  mapCenter: { lat: 38, lng: 128 }, // zoom 5
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
  updateMapBounds: (map: google.maps.Map | null, places: SelectedPlace[] | Place[]) => {
    set((state) => {
      const bounds = new google.maps.LatLngBounds();

      if (map && places.length > 0) {
        places.forEach((place) => {
          bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));
        });

        map.fitBounds(bounds);
        return { ...state, mapCenter: { lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() } };
      }

      return state;
    });
  },
}));
