import { Profile } from "@/models/profile.model";
import { httpClient } from "./https";
import { Comment } from "@/models/comment.model";
import { Schedule } from "@/models/schedule.model";
import { Post } from "@/models/post.model";
import { PlaceDetails } from "@/models/place.model";

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
interface FetchScheduleResponse {
  schedules: Schedule[];
}
export const fetchMySchedule = async (params: FetchMyPageParams) => {
  try {
    const response = await httpClient.get<FetchScheduleResponse>("api/mypages", { params: params.list });
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
  places: PlaceDetails[];
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
