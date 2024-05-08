export interface iCreatePostProps {
  title: string;
  startDate: string;
  endDate: string;
  continent: number;
  country: number;
  totalExpense: number;
  journeyId: number;
  contents: string;
  author?: string;
}
export interface iPageDataProps {
  pages: number;
  limit: number;
}
export interface iSearchDataProps {
  filter: string;
  keyword: string;
}

export interface iPagination {
  pages?: number;
  totalPosts?: number;
}

export interface iSpotData {
  seq: number;
  placeId: string;
  tel: string;
  name: string;
  address: string;
  openingHours: string[];
}
