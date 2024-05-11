import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Place } from "@/models/place.model";

export interface SelectedPlace extends Place {
  uuid: string;
}

interface AddPlaceStore {
  addPlaces: SelectedPlace[];
  addPlace: (place: Place) => void; // 장소 추가 함수
  removePlace: (uuid: string) => void; // 장소 제거 함수
  setPlaces: (places: SelectedPlace[]) => void; // 전역 상태 업데이트 함수
}

export const useAddPlaceStore = create<AddPlaceStore>((set) => ({
  addPlaces: [],
  addPlace: (place: Place) => {
    const uuid = uuidv4();
    const selectedPlace: SelectedPlace = { ...place, uuid };
    set((state) => ({ addPlaces: [selectedPlace, ...state.addPlaces] }));
  },
  removePlace: (uuid: string) => {
    set((state) => ({
      addPlaces: state.addPlaces.filter((place) => place.uuid !== uuid),
    }));
  },
  setPlaces: (places: SelectedPlace[]) => {
    set({ addPlaces: places });
  },
}));
