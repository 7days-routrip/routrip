import PostCard from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import styled from "styled-components";

const dummyPost: Post = {
  id: 1,
  title: "가짜로 여행을 떠나는 진짜 여행!",
  date: "2024.03.12-2024.03.18",
  author: "김아무개",
  userProfile: "",
  continental: "대한민국",
  country: "서울",
  commentsNum: "999",
  likesNum: "999",
  postsImg: "",
  createdAt: "2024.03.12",
};

const MainPage = () => {
  // return <MainPageStyle>MainPageStyle</MainPageStyle>;
  return (
    <MainPageStyle>
      <PostCard PostProps={dummyPost} view="list" />
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
