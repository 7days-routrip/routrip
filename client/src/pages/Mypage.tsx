import MypageTab from "@/components/common/MypageTab";
import ProfileCard from "@/components/common/ProfileCard";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import styled from "styled-components";
interface Props {}

const dummyData: IProfileCard = {
  nickname: "김하늘누리",
  profile: "",
  journeysNum: 5,
  postsNum: 5,
  commentsNum: 88,
  likePostsNum: 81,
  likeSpotsNum: 50,
};

// 더미 데이터들

const Mypage = () => {
  return (
    <MypageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <MypageTab />
    </MypageStyle>
  );
};

const MypageStyle = styled.div``;

export default Mypage;
