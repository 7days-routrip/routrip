import {
  fetchLikePlace,
  fetchLikePost,
  fetchMyComments,
  fetchMyPosts,
  fetchMySchedule,
  fetchProfile,
} from "@/apis/mypage.api";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

export const useSchedule = () => {
  const {
    data: ScheduleData,
    isLoading: isScheduleLoding,
    refetch: scheduleRefetch,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => fetchMySchedule(),
    enabled: true,
  });

  return {
    schedules: ScheduleData,
    isEmptySchedules: ScheduleData?.length === 0,
    isScheduleLoding,
    scheduleRefetch,
  };
};

export const useProfile = () => {
  const {
    data: profileData,
    isLoading: isProfileLoding,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  return {
    profileInfo: profileData,
    isProfileLoding,
    profileRefetch,
  };
};

export const usePost = () => {
  const {
    data: postList,
    isLoading: isPostLoading,
    refetch: postsRefetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchMyPosts(),
    enabled: false,
  });

  return {
    posts: postList?.posts,
    isEmptyPosts: postList?.posts.length === 0,
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
    queryKey: ["comments"],
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
  } = useQuery({ queryKey: ["likePosts"], queryFn: () => fetchLikePost(), enabled: false });

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
    queryKey: ["likePlaces"],
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
