import { Place } from "@/models/place.model";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface SelectedPlace extends Place {
  uuid: string;
}

interface PlaceStore {
  places: SelectedPlace[];
  addPlace: (place: Place) => void; // 장소 추가 함수
  removePlace: (placeId: string) => void; // 장소 제거 함수
}

export const usePlaceStore = create<PlaceStore>((set) => ({
  places: [],
  addPlace: (place: Place) => {
    const uuid = uuidv4();
    const selectedPlace: SelectedPlace = { ...place, uuid };
    set((state) => ({ places: [...state.places, selectedPlace] }));
  },
  removePlace: (uuid: string) => {
    set((state) => ({
      places: state.places.filter((place) => place.uuid !== uuid),
    }));
  },
}));
