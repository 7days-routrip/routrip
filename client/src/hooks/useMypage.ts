import {
  fetchLikePlace,
  fetchLikePost,
  fetchMyComments,
  fetchMyPosts,
  fetchMySchedule,
  fetchProfile,
} from "@/apis/mypage.api";
import { useQuery } from "@tanstack/react-query";

export const useSchedule = () => {
  const {
    data: ScheduleData,
    isLoading: isScheduleLoding,
    refetch: scheduleRefetch,
  } = useQuery({
    queryKey: ["schedule"],
    queryFn: () => fetchMySchedule(),
    enabled: false,
  });

  return {
    schedules: ScheduleData,
    isEmptySchedules: ScheduleData?.length === 0,
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
    profileInfo: profileData,
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
    queryFn: () => fetchMyPosts(),
    enabled: false,
  });

  return {
    posts: postData,
    isEmptyPosts: postData?.length === 0,
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
    queryFn: () => fetchMyComments(),
    enabled: false,
  });

  return {
    comments: commentData,
    isEmptyComments: commentData?.length === 0,
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
    likePosts: likePostData,
    isEmptyLikePosts: likePostData?.length === 0,
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
    likePlaces: likePlaceData,
    isEmptyLikePlace: likePlaceData?.length === 0,
    isLikePlaceLoding,
    likePlaceRefetch,
  };
};
