import { iPageDataProps } from "@/types/posts.types";

export const getImageFromContent = async (contents: string) => {
  const reg = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
  const repImage = await contents.match(reg);

  return typeof contents !== null ? repImage?.map((value) => value)[0] : undefined;
};

export const getOffset = async (pageData?: iPageDataProps) => {
  return typeof pageData === "undefined" ? 0 : pageData?.pages * pageData?.limit - pageData?.limit;
};

export const setAreaType = async (area: string) => {
  return area === "home" ? `1` : `Not(1)`;
};

export const getPostImg = (content: string) => {
  let getImg;

  return getImg ? getImg : undefined;
};
