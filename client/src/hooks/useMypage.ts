import {
  fetchLikePlace,
  fetchLikePost,
  fetchMyComments,
  fetchMyPosts,
  fetchMySchedule,
  fetchProfile,
} from "@/apis/mypage.api";
import { LIMIT } from "@/constants/pagenation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const isLastPage = (totalCnt: number, pages: number) => {
  return totalCnt === 0 || Math.ceil(totalCnt / LIMIT) === pages;
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

export const useSchedule = () => {
  const {
    data,
    isLoading: isScheduleLoding,
    refetch: scheduleRefetch,
    fetchNextPage: nextSchedules,
    hasNextPage: hasNextSchedules,
  } = useInfiniteQuery({
    queryKey: ["schedules"],
    queryFn: ({ pageParam }) => fetchMySchedule(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return isLastPage(lastPage.pagination.totalItems, lastPage.pagination.page)
        ? null
        : Number(lastPage.pagination.page) + 1;
    },

    enabled: false,
  });

  const schedules = data ? data.pages.flatMap((page) => page.schedules) : [];
  const schedulePage = data ? data.pages[data.pages.length - 1].pagination : {};
  const isEmptySchedules = schedules?.length === 0;

  return {
    schedules,
    schedulePage,
    isEmptySchedules,
    isScheduleLoding,
    scheduleRefetch,
    nextSchedules,
    hasNextSchedules,
  };
};

export const usePost = () => {
  const {
    data,
    isLoading: isPostLoading,
    refetch: postsRefetch,
    fetchNextPage: nextPosts,
    hasNextPage: hasNextPosts,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchMyPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return isLastPage(lastPage.pagination.totalItems, lastPage.pagination.page)
        ? null
        : Number(lastPage.pagination.page) + 1;
    },
    enabled: false,
  });

  const posts = data ? data.pages.flatMap((page) => page.posts) : [];
  const postsPage = data ? data.pages[data.pages.length - 1].pagination : {};
  const isEmptyPosts = posts.length === 0;

  return {
    posts,
    postsPage,
    isEmptyPosts,
    isPostLoading,
    postsRefetch,
    nextPosts,
    hasNextPosts,
  };
};

export const useComment = () => {
  const {
    data,
    isLoading: isCommentLoading,
    refetch: commentsRefetch,
    fetchNextPage: nextComments,
    hasNextPage: hasNextComments,
  } = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam }) => fetchMyComments(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return isLastPage(lastPage.pagination.totalItems, lastPage.pagination.page)
        ? null
        : Number(lastPage.pagination.page) + 1;
    },
    enabled: false,
  });

  const comments = data ? data.pages.flatMap((page) => page.comments) : [];
  const commentPage = data ? data.pages[data.pages.length - 1].pagination : {};
  const isEmptyComment = comments.length === 0;

  return {
    comments,
    isEmptyComment,
    commentPage,
    isCommentLoading,
    commentsRefetch,
    nextComments,
    hasNextComments,
  };
};

export const useLikePost = () => {
  const {
    data,
    isLoading: isLikePostLoading,
    refetch: likePostRefetch,
    fetchNextPage: nextLikePosts,
    hasNextPage: hasNextLikePost,
  } = useInfiniteQuery({
    queryKey: ["likePosts"],
    queryFn: ({ pageParam }) => fetchLikePost(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return isLastPage(lastPage.pagination.totalItems, lastPage.pagination.page)
        ? null
        : Number(lastPage.pagination.page) + 1;
    },
    enabled: false,
  });

  const likePosts = data ? data.pages.flatMap((page) => page.posts) : [];
  const likePostsPage = data ? data.pages[data.pages.length - 1].pagination : {};
  const isEmptyLikePosts = likePosts.length === 0;

  return {
    likePosts,
    isEmptyLikePosts,
    likePostsPage,
    isLikePostLoading,
    likePostRefetch,
    nextLikePosts,
    hasNextLikePost,
  };
};

export const useLikePlace = () => {
  const {
    data,
    isLoading: isLikePlaceLoding,
    refetch: likePlaceRefetch,
    fetchNextPage: nextLikePlaces,
    hasNextPage: hasNextPlaces,
  } = useInfiniteQuery({
    queryKey: ["likePlaces"],
    queryFn: ({ pageParam }) => fetchLikePlace(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return isLastPage(lastPage.pagination.totalItems, lastPage.pagination.page)
        ? null
        : Number(lastPage.pagination.page) + 1;
    },
    enabled: false,
  });

  const likePlaces = data ? data.pages.flatMap((page) => page.places) : [];
  const likePlacePage = data ? data.pages[data.pages.length - 1].pagination : {};
  const isEmptyLikePlace = likePlaces.length === 0;

  return {
    likePlaces,
    isEmptyLikePlace,
    likePlacePage,
    isLikePlaceLoding,
    likePlaceRefetch,
    nextLikePlaces,
    hasNextPlaces,
  };
};

// import {
//   fetchLikePlace,
//   fetchLikePost,
//   fetchMyComments,
//   fetchMyPosts,
//   fetchMySchedule,
//   fetchProfile,
// } from "@/apis/mypage.api";
// import { useQuery } from "@tanstack/react-query";
// import { useLocation } from "react-router-dom";

// export const useSchedule = () => {
//   const {
//     data: ScheduleData,
//     isLoading: isScheduleLoding,
//     refetch: scheduleRefetch,
//   } = useQuery({
//     queryKey: ["schedules"],
//     queryFn: () => fetchMySchedule(),
//     enabled: false,
//   });

//   return {
//     schedules: ScheduleData,
//     isEmptySchedules: ScheduleData?.length === 0,
//     isScheduleLoding,
//     scheduleRefetch,
//   };
// };

// export const useProfile = () => {
//   const {
//     data: profileData,
//     isLoading: isProfileLoding,
//     refetch: profileRefetch,
//   } = useQuery({
//     queryKey: ["profile"],
//     queryFn: () => fetchProfile(),
//   });

//   return {
//     profileInfo: profileData,
//     isProfileLoding,
//     profileRefetch,
//   };
// };

// export const usePost = () => {
//   const {
//     data: postList,
//     isLoading: isPostLoading,
//     refetch: postsRefetch,
//   } = useQuery({
//     queryKey: ["posts"],
//     queryFn: () => fetchMyPosts(),
//     enabled: false,
//   });

//   return {
//     posts: postList?.posts,
//     isEmptyPosts: postList?.posts.length === 0,
//     isPostLoading,
//     postsRefetch,
//   };
// };

// export const useComment = () => {
//   const {
//     data: commentData,
//     isLoading: isCommentLoading,
//     refetch: commentsRefetch,
//   } = useQuery({
//     queryKey: ["comments"],
//     queryFn: () => fetchMyComments(),
//     enabled: false,
//   });

//   return {
//     comments: commentData,
//     isEmptyComments: commentData?.length === 0,
//     isCommentLoading,
//     commentsRefetch,
//   };
// };

// export const useLikePost = () => {
//   const {
//     data: likePostData,
//     isLoading: isLikePostLoading,
//     refetch: likePostRefetch,
//   } = useQuery({ queryKey: ["likePosts"], queryFn: () => fetchLikePost(), enabled: false });

//   return {
//     likePosts: likePostData,
//     isEmptyLikePosts: likePostData?.length === 0,
//     isLikePostLoading,
//     likePostRefetch,
//   };
// };

// export const useLikePlace = () => {
//   const {
//     data: likePlaceData,
//     isLoading: isLikePlaceLoding,
//     refetch: likePlaceRefetch,
//   } = useQuery({
//     queryKey: ["likePlaces"],
//     queryFn: () => fetchLikePlace(),
//     enabled: false,
//   });

//   return {
//     likePlaces: likePlaceData,
//     isEmptyLikePlace: likePlaceData?.length === 0,
//     isLikePlaceLoding,
//     likePlaceRefetch,
//   };
// };
