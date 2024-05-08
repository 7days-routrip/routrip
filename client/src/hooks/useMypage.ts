import {
  fetchLikePlace,
  fetchLikePost,
  fetchMyComments,
  fetchMyPosts,
  fetchMySchedule,
  fetchProfile,
} from "@/apis/mypage.api";
import { queryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useSchedule = () => {
  const {
    data: ScheduleData,
    isLoading: isScheduleLoding,
    refetch: scheduleRefetch,
  } = useQuery({
    queryKey: ["schedule"],
    queryFn: () => fetchMySchedule({ list: queryKey.schedule }),
    enabled: false,
  });

  return {
    schedules: ScheduleData?.schedules,
    isEmptySchedules: ScheduleData?.schedules.length === 0,
    isScheduleLoding,
    scheduleRefetch,
  };
};

export const useProfile = () => {
  const { data: profileData, isLoading: isProfileLoding } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  return {
    profileInfo: profileData?.profile,
    isProfileLoding,
  };
};

export const usePost = () => {
  const {
    data: postData,
    isLoading: isPostLoading,
    refetch: postsRefetch,
  } = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchMyPosts({ list: queryKey.post }),
    enabled: false,
  });

  return {
    posts: postData?.posts,
    isEmptyPosts: postData?.posts.length === 0,
    isPostLoading,
    postsRefetch,
  };
};

export const useComment = () => {
  const {
    data: commentData,
    isLoading: isCommentLoading,
    refetch: commentsRefetch,
  } = useQuery({
    queryKey: ["comment"],
    queryFn: () => fetchMyComments({ list: queryKey.comment }),
    enabled: false,
  });

  return {
    comments: commentData?.comments,
    isEmptyComments: commentData?.comments.length === 0,
    isCommentLoading,
    commentsRefetch,
  };
};

export const useLikePost = () => {
  const {
    data: likePostData,
    isLoading: isLikePostLoading,
    refetch: likePostRefetch,
  } = useQuery({ queryKey: ["likePost"], queryFn: () => fetchLikePost(), enabled: false });

  return {
    likePosts: likePostData?.posts,
    isEmptyLikePosts: likePostData?.posts.length === 0,
    isLikePostLoading,
    likePostRefetch,
  };
};

export const useLikePlace = () => {
  const {
    data: likePlaceData,
    isLoading: isLikePlaceLoding,
    refetch: likePlaceRefetch,
  } = useQuery({
    queryKey: ["likePlace"],
    queryFn: () => fetchLikePlace(),
    enabled: false,
  });
  return {
    likePlaces: likePlaceData?.places,
    isEmptyLikePlace: likePlaceData?.places.length === 0,
    isLikePlaceLoding,
    likePlaceRefetch,
  };
};
