import { Post, PostList } from "@/models/post.model";
import { httpClient } from "./https";

// hot한 여행지 요청
export type BestPosts = Pick<Post, "id" | "likesNum" | "date" | "title" | "postsImg" | "country">;
export const getBestPosts = async () => {
  try {
    const { data } = await httpClient.get<BestPosts[]>("/posts/all/hot");
    return data;
  } catch (err) {
    throw err;
  }
};

// 국내 여행지 요청
export const getHomePosts = async () => {
  try {
    const { data } = await httpClient.get<PostList>("/posts?area=home&pages=1");
    return data;
  } catch (err) {
    throw err;
  }
};

// 해외 여행지 요청
export const getAbroadPosts = async () => {
  try {
    const { data } = await httpClient.get<PostList>("/posts?area=abroad&pages=1");
    return data;
  } catch (err) {
    throw err;
  }
};
