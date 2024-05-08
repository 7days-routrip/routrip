import ProfileCard from "@/components/common/ProfileCard";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getToken } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { Schedule } from "@/models/schedule.model";
import ScheduleCard from "@/components/common/scheduleCard";
import { useComment, useLikePlace, useLikePost, usePost, useProfile, useSchedule } from "@/hooks/useMypage";
import { Button } from "@/components/common/Button";
import PostCard from "@/components/common/postCard";
import CommentCard from "@/components/common/Comment";
import LikePlaceCard from "@/components/common/LikePlaceCard";

const TABLIST = [
  { name: "일정 모음" },
  { name: "내 여행글" },
  { name: "내 댓글" },
  { name: "좋아요 한 글" },
  { name: "찜한 장소" },
];

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
  const [activeTab, setActiveTab] = useState([true, false, false, false, false]);
  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule();
  const { posts, isEmptyPosts, postsRefetch } = usePost();
  const { comments, isEmptyComments, commentsRefetch } = useComment();
  const { likePosts, isEmptyLikePosts, likePostRefetch } = useLikePost();
  const { likePlaces, isEmptyLikePlace, likePlaceRefetch } = useLikePlace();
  const { profileInfo } = useProfile();

  const handleMypageTab = (idx: number) => {
    const newActiveTab = new Array(5).fill(false);
    newActiveTab[idx] = true;
    setActiveTab(newActiveTab);
    switch (idx) {
      case 0:
        scheduleRefetch();
        break;
      case 1:
        postsRefetch();
        break;
      case 2:
        commentsRefetch();
        break;
      case 3:
        likePostRefetch();
        break;
      case 4:
        likePlaceRefetch();
        break;
    }
  };

  useEffect(() => {
    // 로그인 되어 있는가 찾기
    const user = getToken();
    if (user === null) {
      // alert 창 을 띄어야 하나?
      // navigate("/login");
    }
    scheduleRefetch();
  }, []);
  return (
    <MypageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <div className="main">
        <MypageTabStyle>
          {TABLIST.map((item, idx) => (
            <Button
              $radius="default"
              $scheme={activeTab[idx] ? "primary" : "normal"}
              $size="large"
              onClick={() => handleMypageTab(idx)}
              key={idx}
            >
              {item.name}
            </Button>
          ))}
        </MypageTabStyle>

        {!isEmptySchedules && activeTab[0]
          ? schedules?.map((item, idx) => <ScheduleCard scheduleProps={item} key={idx} view="grid" />)
          : null}
        {!isEmptyPosts && activeTab[1]
          ? posts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
          : null}
        {!isEmptyComments && activeTab[2]
          ? comments?.map((item, idx) => <CommentCard CommentProps={item} key={idx} />)
          : null}
        {!isEmptyLikePosts && activeTab[3]
          ? likePosts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
          : null}
        {!isEmptyLikePlace && activeTab[4]
          ? likePlaces?.map((item, idx) => <LikePlaceCard PlaceProps={item} key={idx} />)
          : null}
      </div>
    </MypageStyle>
  );
};

export const MypageStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .main {
    width: 100%;
  }
`;

const MypageTabStyle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  > button {
    flex: 1;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex: 0;
    width: auto;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-basis: 0;

    > button {
      flex: 0;
      width: 120px;
      font-weight: 600;
      padding: 0.6rem;
    }
  }
`;

export default Mypage;
