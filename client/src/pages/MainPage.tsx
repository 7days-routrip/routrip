import PostCard from "@/components/common/postCard";
import ScheduleCard from "@/components/common/scheduleCard";
import { Post } from "@/models/post.model";
import { Schedule } from "@/models/schedule.model";
import styled from "styled-components";

const postDummyData: Post = {
  title: "오션뷰를 보고 싶다면? 여기!",
  schedule: "대한민국 > 서울/경기 • 강원도 • 경상도",
  image: "https://unsplash.it/400/200",
  date: "2024.03.12 ~ 2024.03.18",
  like: "99",
  comments: "22",
  writer: "여행조아",
  profileImage: "/assets/images/logo-profile.png",
};

const ScheduleDummyData: Schedule = {
  title: "오션뷰를 보고 싶다면? 여기!",
  schedule: "대한민국 > 서울/경기 • 강원도 • 경상도",
  image: "https://unsplash.it/400/200",
  date: "2024.03.12 ~ 2024.03.18",
};

const MainPage = () => {
  return (
    <MainPageStyle>
      <PostCard PostProps={postDummyData} />
      <ScheduleCard scheduleProps={ScheduleDummyData} />
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
`;

export default MainPage;
