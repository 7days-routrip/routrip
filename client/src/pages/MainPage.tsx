import PostCard from "@/components/common/postCard";
import ScheduleCard from "@/components/common/scheduleCard";
import { Post } from "@/models/post.model";
import { Schedule } from "@/models/schedule.model";
import styled from "styled-components";

const postDummyData: Post = {
  id: 1,
  title: "오션뷰를 보고 싶다면? 여기!",
  continental: "대한",
  country: "서울",
  postsImg: "https://unsplash.it/400/200",
  date: "2024.03.12 ~ 2024.03.18",
  postsNum: "1",
  like: "99",
  commentsNum: "22",
  author: "여행조아",
  profileImage: "/assets/images/logo-profile.png",
};

const ScheduleDummyData: Schedule = {
  id: 1,
  title: "오션뷰를 보고 싶다면? 여기!",
  image: "https://unsplash.it/400/200",
  date: "2024.03.12 ~ 2024.03.18",
};

const MainPage = () => {
  return (
    <MainPageStyle>
      <PostCard PostProps={postDummyData} view="list" />
      <ScheduleCard scheduleProps={ScheduleDummyData} view="list" />
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
`;

export default MainPage;
