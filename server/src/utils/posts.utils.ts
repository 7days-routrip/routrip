import { iPageDataProps } from "@/types/posts.types";

export const getOffset = async (pageData?: iPageDataProps) => {
  return typeof pageData === "undefined" ? 0 : pageData?.pages * pageData?.limit - pageData?.limit;
};

export const setAreaType = async (area: string) => {
  return area === "home" ? `1` : `Not(1)`;
};

export const setDateFromat = async (date: Date | string) => {
  const newDate = new Date(date);
  const years = newDate.getFullYear();
  const month = newDate.getMonth() - 1;
  const days = newDate.getDate();
  return `${years}.${month}.${days}`;
};
