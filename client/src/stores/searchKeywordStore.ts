import { create } from "zustand";

interface SearchKeyword {
  searchKeywordToServer: string;
  searchKeywordToGoogle: string;
  setSearchKeywordToServer: (keyword: string) => void;
  setSearchKeywordToGoogle: (keyword: string) => void;
}

export const useSearchKeywordStore = create<SearchKeyword>((set) => ({
  searchKeywordToServer: "",
  searchKeywordToGoogle: "",
  setSearchKeywordToServer: (keyword) => set({ searchKeywordToServer: keyword }),
  setSearchKeywordToGoogle: (keyword) => set({ searchKeywordToGoogle: keyword }),
}));
