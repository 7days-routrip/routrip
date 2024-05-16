import { httpClient } from "./https";
import { Comment } from "@/models/comment.model";
import { Schedule } from "@/models/schedule.model";
import { Post, PostList } from "@/models/post.model";
import { PlaceDetails } from "@/models/place.model";
import { Profile } from "@/models/profile.model";

// 내 프로필
export const fetchProfile = async () => {
  try {
    const { data } = await httpClient.get<Profile>("/mypages/total-data-quantity");
    return data;
  } catch (error: any) {
    // 에러 처리
    console.log(error);
    if (error.response.status === 404) {
    }
    return {
      journeysNum: 0,
      postsNum: 0,
      commentsNum: 0,
      likePostsNum: 0,
      likeSpotsNum: 0,
      profileImg: "",
      nickName: "",
    };
  }
};

// 내 일정

export const fetchMySchedule = async () => {
  try {
    const { data } = await httpClient.get<Schedule[]>("/mypages/journeys");
    return data;
  } catch (error: any) {
    // 에러 처리
    if (error.response.status === 404) {
      return [];
    } else {
    }
  }
};

// 내 게시글
export const fetchMyPosts = async () => {
  try {
    const { data } = await httpClient.get<PostList>("/mypages/posts?pages=1");
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return {
      posts: [],
      pagenation: {},
    };
  }
};

// 내 댓글
export const fetchMyComments = async () => {
  try {
    const { data } = await httpClient.get<Comment[]>("/mypages/comments");
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return [];
  }
};

// 여행글 좋아요
export const fetchLikePost = async () => {
  try {
    const { data } = await httpClient.get<Post[]>("/likes/posts");
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return [];
  }
};

// 찜한 장소

export const fetchLikePlace = async () => {
  try {
    const { data } = await httpClient.get<PlaceDetails[]>("/likes/places");
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return [];
  }
};
