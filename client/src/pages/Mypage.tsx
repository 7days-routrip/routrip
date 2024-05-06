import MypageTab from "@/components/mypage/MypageTab";
import ProfileCard from "@/components/common/ProfileCard";
import PostCardList from "@/components/mypage/postCardList";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getToken } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { Schedule } from "@/models/schedule.model";
import ScheduleCard from "@/components/common/scheduleCard";
import { useMypage } from "@/hooks/useMypage";

interface Props {}

// 더미 데이터들
const dummyData: IProfileCard = {
  nickname: "김하늘누리",
  profile: "",
  journeysNum: 5,
  postsNum: 5,
  commentsNum: 88,
  likePostsNum: 81,
  likeSpotsNum: 50,
};

const dummyScheduleData: Schedule = {
  id: 1,
  title: "post title",
  date: "post createdAt",
  postImg: "",
};

const Mypage = () => {
  const navigate = useNavigate();
  // const { profileInfo, schedules, posts, comments, likePlace } = useMypage();

  //
  useEffect(() => {
    // 로그인 되어 있는가 찾기
    const user = getToken();
    if (user === null) {
      // alert 창 을 띄어야 하나?
      // navigate("/login");
    }
  }, []);
  return (
    <MypageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <div className="main">
        <MypageTab />
        <PostCardList />
      </div>
    </MypageStyle>
  );
};

const MypageStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .main {
    width: 100%;
  }
`;

export default Mypage;
