import MypageTab from "@/components/mypage/MypageTab";
import MypageTabItem from "@/components/common/MypageTabItem";
import styled from "styled-components";

const MainPage = () => {
  // return <MainPageStyle>MainPageStyle</MainPageStyle>;
  return (
    <MainPageStyle>
      <MypageTab />
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
`;

export default MainPage;
