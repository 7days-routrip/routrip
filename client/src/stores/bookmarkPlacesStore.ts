import { create } from "zustand";
import { Place } from "@/models/place.model";

interface BookmarkPlacesStore {
  bookmarkPlaces: Place[];
  setBookmarkPlaces: (places: Place[]) => void;
}

export const useBookmarkPlacesStore = create<BookmarkPlacesStore>((set) => ({
  bookmarkPlaces: [],
  setBookmarkPlaces: (places: Place[]) => {
    set({ bookmarkPlaces: places });
  },
}));
