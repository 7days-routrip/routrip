export interface iCreatePostProps {
  title: string;
  startDate: string;
  endDate: string;
  author: string;
  continent: number;
  country: number;
  totalExpense: number;
  journeyId: number;
  contents: string;
}

export interface iPageDataProps {
  pages: number;
  limit: number;
}
