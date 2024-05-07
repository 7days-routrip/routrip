import { iPageDataProps } from "@/types/posts.types";

export const getImageFromContent = async (contents: string) => {
  const reg = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
  const repImage = await contents.match(reg);

  if (typeof contents !== null) return repImage?.map((value) => value)[0];
  else return undefined;
};

export const getOffset = async (pageData?: iPageDataProps) => {
  if (typeof pageData === "undefined") return 0;
  const offset = pageData?.pages * pageData?.limit - pageData?.limit;
  return offset;
};

export const setAreaType = async (area: string) => {
  if (area === "home") return `1`;
  if (area === "abroad") return `Not(1)`;
};
