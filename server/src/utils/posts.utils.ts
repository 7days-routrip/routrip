import { Not } from "typeorm";

export const getOffset = async (pages: number, limit: number) => {
  return typeof pages === "undefined" ? 0 : pages * limit - limit;
};

export const setAreaType = async (area: string) => {
  return area === "home" ? 1 : Not(1);
};

export const setDateFromat = async (date: Date | string) => {
  if (typeof date === "string") return date.replaceAll("-", ".");
  const newDate = new Date(date).toISOString();
  return newDate.split("T")[0].replaceAll("-", ".");
};
