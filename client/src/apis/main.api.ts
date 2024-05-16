import { PostList } from "@/models/post.model";
import { httpClient } from "./https";

// hot한 여행지 요청
export interface BestPosts {
  id: string;
  likesNum: string;
  date: string;
  title: string;
  postsImg: string;
  country: string;
}

export const getBestPosts = async () => {
  try {
    const { data } = await httpClient.get<BestPosts[]>("/posts/all/hot");
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

// 국내 여행지 요청
export const getHomePosts = async () => {
  try {
    const { data } = await httpClient.get<PostList>("/posts?area=home&pages=1");
    // console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

// 해외 여행지 요청
export const getAbroadPosts = async () => {
  try {
    const { data } = await httpClient.get<PostList>("/posts?area=abroad&pages=1");
    // console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};
