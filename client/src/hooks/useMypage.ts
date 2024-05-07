import {
  fetchLikePlace,
  fetchLikePost,
  fetchMyComments,
  fetchMyPosts,
  fetchMySchedules,
  fetchProfile,
} from "@/apis/mypage.api";
import { queryKey } from "@/constants/queryKey";
import { Comment as IComment } from "@/models/comment.model";
// import { LikePlace } from "@/models/place.mode";
import { Post } from "@/models/post.model";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import { Schedule } from "@/models/schedule.model";
import { getNickName } from "@/stores/authStore";
import { useEffect, useState } from "react";

export const useMypage = () => {
  const [profileInfo, setProfileInfo] = useState<IProfileCard>();
  const [schedules, setschedules] = useState<Schedule[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  // const [likePlace, setLikePlace] = useState<LikePlace[]>([]);

  const switchProfile = () => {
    const nickname = getNickName();
    if (nickname === null) return;
    fetchProfile().then(({ profile }) => profile && setProfileInfo({ ...profile, nickname }));
  };

  const switchMySchedules = () => {
    fetchMySchedules({ list: queryKey.schedule }).then(({ schedules }) => {
      schedules && setschedules(schedules);
    });
  };

  const switchMyPosts = () => {
    fetchMyPosts({ list: queryKey.post }).then(({ posts }) => posts && setPosts(posts));
  };

  const switchComments = () => {
    fetchMyComments({ list: queryKey.comment }).then(({ comments }) => comments && setComments(comments));
  };

  const switchLikePost = () => {
    fetchLikePost().then(({ posts }) => posts && setPosts(posts));
  };

  // const switchLikePlace = () => {
  //   fetchLikePlace().then(({ places }) => places && setLikePlace(places));
  // };

  useEffect(() => {
    // switchMySchedules();
    // switchProfile();
  }, []);

  // likePlace 가 지금 빠져 있음
  return {
    posts,
    profileInfo,
    schedules,
    comments,

    switchProfile,
    switchMySchedules,
    switchMyPosts,
    switchComments,
    switchLikePost,
  };
};
