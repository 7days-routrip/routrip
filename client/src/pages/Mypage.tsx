import { Profile } from "@/models/profile.model";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Schedule } from "@/models/schedule.model";
import ScheduleCard from "@/components/common/scheduleCard";
import { useComment, useLikePlace, useLikePost, usePost, useProfile, useSchedule } from "@/hooks/useMypage";
import { Button } from "@/components/common/Button";
import PostCard from "@/components/common/postCard";
import CommentCard from "@/components/common/Comment";
import LikePlaceCard from "@/components/common/LikePlaceCard";
import { Comment } from "@/models/comment.model";
import ProfileCard from "@/components/common/ProfileCard";
import { QUERYSTRING } from "@/constants/querystring";

const TAPLIST = [
  { name: "일정 모음", queryValue: "schedules" },
  { name: "내 여행글", queryValue: "posts" },
  { name: "내 댓글", queryValue: "comments" },
  { name: "좋아요 한 글", queryValue: "like-posts" },
  { name: "찜한 장소", queryValue: "like-places" },
];

// 더미 데이터들
const dummyData: Profile = {
  nickName: "김하늘누리",
  profileImg: "",
  journeysNum: 5,
  postsNum: 5,
  commentsNum: 88,
  likePostsNum: 81,
  likeSpotsNum: 50,
};

const Mypage = () => {
  const [activeTap, setActiveTap] = useState([true, false, false, false, false]);
  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule();
  const { posts, isEmptyPosts, postsRefetch } = usePost();
  const { comments, isEmptyComments, commentsRefetch } = useComment();
  const { likePosts, isEmptyLikePosts, likePostRefetch } = useLikePost();
  const { likePlaces, isEmptyLikePlace, likePlaceRefetch } = useLikePlace();
  const { profileInfo, isProfileLoding } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMypageTap = (idx: number, tag: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const newActiveTap = new Array(5).fill(false);
    newActiveTap[idx] = true;
    setActiveTap(newActiveTap);
    if (tag === null) {
      newSearchParams.delete(QUERYSTRING.TAG);
    } else {
      newSearchParams.set(QUERYSTRING.TAG, tag);
    }
    setSearchParams(newSearchParams);
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
    const params = Object.fromEntries(searchParams);
    for (let i = 0; i < 5; i++) {
      if (TAPLIST[i].queryValue === params.tag) {
        handleMypageTap(i, params.tag);
      }
    }
  }, [location.search]);

  return (
    <MypageStyle $commentsView={activeTap[2]} $likePlaceView={activeTap[4]}>
      <ProfileCard ProfileProps={!isProfileLoding && profileInfo ? profileInfo : dummyData} />
      <div className="main">
        <MypageTapStyle>
          {TAPLIST.map((item, idx) => (
            <Button
              $radius="default"
              $scheme={activeTap[idx] ? "primary" : "normal"}
              $size="large"
              onClick={() => handleMypageTap(idx, item.queryValue)}
              key={idx}
            >
              {item.name}
            </Button>
          ))}
        </MypageTapStyle>
        <div className="contents">
          {!isEmptySchedules && activeTap[0]
            ? schedules?.map((item, idx) => <ScheduleCard scheduleProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyPosts && activeTap[1]
            ? posts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyComments && activeTap[2]
            ? comments?.map((item, idx) => <CommentCard CommentProps={item} key={idx} />)
            : null}
          {!isEmptyLikePosts && activeTap[3]
            ? likePosts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyLikePlace && activeTap[4]
            ? likePlaces?.map((item, idx) => <LikePlaceCard PlaceProps={item} key={idx} />)
            : null}
        </div>
      </div>
    </MypageStyle>
  );
};

interface MypageStyleProps {
  $commentsView: boolean;
  $likePlaceView: boolean;
}

export const MypageStyle = styled.div<MypageStyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .main {
    width: 100%;
  }

  .contents {
    display: ${({ $commentsView }) => ($commentsView ? "flex" : "grid")};
    grid-template-columns: ${({ $likePlaceView }) => ($likePlaceView ? "repeat(2, 1fr)" : "repeat(3, 1fr)")};
    gap: 0.5rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  @media (max-width: 768px) {
    .contents {
      grid-template-columns: ${({ $likePlaceView }) => ($likePlaceView ? "repeat(1, 1fr)" : "repeat(2, 1fr)")};
    }
  }
`;

const MypageTapStyle = styled.div`
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
