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
import ProfileCard from "@/components/common/ProfileCard";
import { QUERYSTRING } from "@/constants/querystring";

const TAGLIST = [
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
  const [activeTag, setActiveTag] = useState([true, false, false, false, false]);
  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule();
  const { posts, isEmptyPosts, postsRefetch } = usePost();
  const { comments, isEmptyComments, commentsRefetch } = useComment();
  const { likePosts, isEmptyLikePosts, likePostRefetch } = useLikePost();
  const { likePlaces, isEmptyLikePlace, likePlaceRefetch } = useLikePlace();
  const { profileInfo, isProfileLoding } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMypageTag = (idx: number, tag: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const newActiveTag = new Array(5).fill(false);
    newActiveTag[idx] = true;
    setActiveTag(newActiveTag);
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
      if (TAGLIST[i].queryValue === params.tag) {
        handleMypageTag(i, params.tag);
      }
    }
  }, [location.search]);

  return (
    <MypageStyle $commentsView={activeTag[2]} $likePlaceView={activeTag[4]}>
      <ProfileCard ProfileProps={!isProfileLoding && profileInfo ? profileInfo : dummyData} />
      <div className="main">
        <MypageTapStyle>
          {TAGLIST.map((item, idx) => (
            <Button
              $radius="default"
              $scheme={activeTag[idx] ? "primary" : "normal"}
              $size="large"
              onClick={() => handleMypageTag(idx, item.queryValue)}
              key={idx}
            >
              {item.name}
            </Button>
          ))}
        </MypageTapStyle>
        <div className="contents">
          {!isEmptySchedules && activeTag[0]
            ? schedules?.map((item, idx) => <ScheduleCard scheduleProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyPosts && activeTag[1]
            ? posts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyComments && activeTag[2]
            ? comments?.map((item, idx) => <CommentCard CommentProps={item} key={idx} />)
            : null}
          {!isEmptyLikePosts && activeTag[3]
            ? likePosts?.map((item, idx) => <PostCard PostProps={item} key={idx} view="grid" />)
            : null}
          {!isEmptyLikePlace && activeTag[4]
            ? likePlaces?.map((item, idx) => (
                <LikePlaceCard PlaceProps={item} likePlaceRefetch={likePlaceRefetch} key={idx} />
              ))
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
    grid-template-columns: ${({ $likePlaceView }) =>
      $likePlaceView ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(32%, auto))"};
    gap: 0.5rem;
    flex-direction: column;
    place-items: center;
  }

  @media (max-width: 768px) {
    .contents {
      grid-template-columns: ${({ $likePlaceView }) => ($likePlaceView ? "repeat(1, 1fr)" : "repeat(2, 1fr)")};
    }
  }
`;

const MypageTapStyle = styled.div`
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: center;
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

    > button {
      width: 100%;
      font-weight: 600;
      padding: 0.6rem;
    }
  }
`;

export default Mypage;
