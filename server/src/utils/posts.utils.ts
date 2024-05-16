import { Not } from "typeorm";

export const getOffset = async (pages: number, limit: number) => {
  return typeof pages === "undefined" ? 0 : pages * limit - limit;
};

export const setAreaType = async (area: string) => {
  return area === "home" ? 1 : Not(1);
};

export const setDateFromat = async (date: Date | string) => {
  const newDate = new Date(date);
  const years = newDate.getFullYear();
  const month = newDate.getMonth() - 1;
  const days = newDate.getDate();
  return `${years}.${month}.${days}`;
};
