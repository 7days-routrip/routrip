import CategoryCard from "@/components/common/CategoryCard";
import GuidePostCard from "@/components/common/GuidePostCard";
import MainPostCard from "@/components/common/MainPostCard";

import { Post } from "@/models/post.model";
import styled from "styled-components";

const dummyPost: Post = {
  id: 1,
  title: "서울 여행 가이드",
  date: "2024.03.12-2024.03.18",
  author: "김아무개",
  userProfile: "",
  continental: "대한민국",
  country: "서울",
  commentsNum: "999",
  likesNum: "999",
  postsImg: "https://picsum.photos/seed/picsum/200/300",
  createdAt: "2024.03.12",
};

const MainPage = () => {
  // return <MainPageStyle>MainPageStyle</MainPageStyle>;
  return (
    <MainPageStyle>
      {/* <MainPostCard PostPops={dummyPost} /> */}
      <GuidePostCard PostPops={dummyPost} />
      {/* <CategoryCard /> */}
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MainPage;
