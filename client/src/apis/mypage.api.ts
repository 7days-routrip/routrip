import { Profile } from "@/models/profile.model";
import { httpClient } from "./https";
import { Comment } from "@/models/comment.model";
import { Schedule } from "@/models/schedule.model";
import { Post } from "@/models/post.model";
import { LikePlace } from "@/models/likePlace.mode";

interface FetchMyPageResponse {
  type: Schedule[] | Comment[] | Post[];
}

// 내 일정, 게시글, 댓글
// export const fetchMyPage = async (params: string) => {
//   try {
//     const response = await httpClient.get<FetchMyPageResponse>("api/mypages", { params: params });
//     return response.data;
//   } catch (error) {
//     // 에러 처리
//   }
// };

interface FetchProfileResponse {
  profile: Profile;
}

// 내 프로필
export const fetchProfile = async () => {
  try {
    const response = await httpClient.get<FetchProfileResponse>("api/mypages/total-data-quantity");
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      profile: {
        journeysNum: 0,
        postsNum: 0,
        commentsNum: 0,
        likePostsNum: 0,
        likeSpotsNum: 0,
        profile: "",
      },
    };
  }
};

// 내 일정
interface FetchMyPageParams {
  list: string;
}
interface FetchSchedulesResponse {
  schedules: Schedule[];
}
export const fetchMySchedules = async (params: FetchMyPageParams) => {
  try {
    const response = await httpClient.get<FetchSchedulesResponse>("api/mypages", { params: params.list });
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      schedules: [],
    };
  }
};

// 내 게시글
interface FetchPostsResponse {
  posts: Post[];
}
export const fetchMyPosts = async (params: FetchMyPageParams) => {
  try {
    const response = await httpClient.get<FetchPostsResponse>("api/mypages", { params: params.list });
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      posts: [],
    };
  }
};

// 내 댓글
interface FetchCommentsResponse {
  comments: Comment[];
}
export const fetchMyComments = async (params: FetchMyPageParams) => {
  try {
    const response = await httpClient.get<FetchCommentsResponse>("api/mypages", { params: params });
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      comments: [],
    };
  }
};

// 여행글 좋아요
interface FetchPostResponse {
  posts: Post[];
}
export const fetchLikePost = async () => {
  try {
    const response = await httpClient.get<FetchPostResponse>("api/likes/place");
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      posts: [],
    };
  }
};

// 찜한 장소
interface FetchPostResponse {
  places: LikePlace[];
}
export const fetchLikePlace = async () => {
  try {
    const response = await httpClient.get<FetchPostResponse>("api/likes/places");
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      places: [],
    };
  }
};
