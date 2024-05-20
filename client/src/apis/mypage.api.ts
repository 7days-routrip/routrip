import { Comment } from "@/models/comment.model";
import { PlaceDetails } from "@/models/place.model";
import { Pagination, PostList } from "@/models/post.model";
import { Profile } from "@/models/profile.model";
import { Schedule } from "@/models/schedule.model";
import { httpClient } from "./https";

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
interface fetchScheduleResponse {
  schedules: Schedule[];
  pagination: Pagination;
}

export const fetchMySchedule = async (page: number) => {
  try {
    const { data } = await httpClient.get<fetchScheduleResponse>(`/mypages/journeys?pages=${page}`);
    return data;
  } catch (error) {
    return {
      schedules: [],
      pagination: {
        totalItems: 0,
        page: 1,
      },
    };
  }
};

// 내 게시글
export const fetchMyPosts = async (page: number) => {
  try {
    const { data } = await httpClient.get<PostList>(`/mypages/posts?pages=${page}`);
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return {
      posts: [],
      pagination: {
        totalItems: 0,
        page: 1,
      },
    };
  }
};

// 내 댓글
interface fetchCommentResponse {
  comments: Comment[];
  pagination: Pagination;
}
export const fetchMyComments = async (page: number) => {
  try {
    const { data } = await httpClient.get<fetchCommentResponse>(`/mypages/comments?pages=${page}`);
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return {
      comments: [],
      pagination: {
        totalItems: 0,
        page: 1,
      },
    };
  }
};

// 여행글 좋아요
export const fetchLikePost = async (page: number) => {
  try {
    const { data } = await httpClient.get<PostList>(`/likes/posts?pages=${page}`);
    return data;
  } catch (error) {
    // 에러 처리
    console.log(error);
    return {
      posts: [],
      pagination: {
        totalItems: 0,
        page: 1,
      },
    };
  }
};

// 찜한 장소
interface fetchPlaceResponse {
  places: PlaceDetails[];
  pagination: Pagination;
}
export const fetchLikePlace = async (page: number) => {
  try {
    const { data } = await httpClient.get<fetchPlaceResponse>(`/mypages/places?pages=${page}`);
    console.log(data);
    return data;
  } catch (error) {
    // 에러 처리
    return {
      places: [],
      pagination: {
        totalItems: 0,
        page: 1,
      },
    };
  }
};
