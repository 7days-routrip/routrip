import styled from "styled-components";
import MypageTabItem from "../common/MypageTabItem";
import { useState } from "react";
import Button from "../common/Button";
import { queryKey } from "@/constants/queryKey";
import { useMypage } from "@/hooks/useMypage";
interface Props {}

const TABLIST = [
  { name: "일정 모음" },
  { name: "내 여행글" },
  { name: "내 댓글" },
  { name: "좋아요 한 글" },
  { name: "찜한 장소" },
];

const MypageTab = () => {
  const [activeTab, setActiveTab] = useState([true, false, false, false, false]);
  const { switchMySchedules, switchMyPosts, switchComments, switchLikePost, switchLikePlace } = useMypage();
  const handleMypageTab = (tabIndex: number) => {
    const arr: boolean[] = new Array(5).fill(false);
    arr[tabIndex] = true;
    setActiveTab(arr);

    switch (tabIndex) {
      case 0:
        switchMySchedules();
        return;
      case 1:
        switchMyPosts();
        return;
      case 2:
        switchComments();
        return;
      case 3:
        switchLikePost();
        return;
      case 4:
        switchLikePlace();
        return;
    }
  };
  return (
    <MypageTabStyle>
      {TABLIST.map((item, idx) => (
        <Button
          radius="default"
          scheme={activeTab[idx] ? "primary" : "normal"}
          size="large"
          onClick={() => handleMypageTab(idx)}
          key={idx}
        >
          {item.name}
        </Button>
        // <MypageTabItem title={item.name} ative={activeTab[idx]} key={idx} />
      ))}
    </MypageTabStyle>
  );
};

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

export default MypageTab;
