import ProfileCard from "@/components/common/ProfileCard";
import styled from "styled-components";

const dummyData: any = {
  nickname: "김하늘누리",
  profile: "",
  journeysNum: 5,
  postsNum: 5,
  commentsNum: 88,
  likePostsNum: 81,
  likeSpotsNum: 50,
};

const MainPage = () => {
  return (
    <MainPageStyle>
      <ProfileCard ProfileProps={dummyData} />
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
`;

export default MainPage;
