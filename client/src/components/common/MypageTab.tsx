import styled from "styled-components";
import MypageTabItem from "./MypageTabItem";
import { useState } from "react";
interface Props {}

const TABLIST = ["일정 모음", "내 여행글", "내 댓글", "좋아요 한글", "찜한 장소"];

const MypageTab = () => {
  const [activeTab, setActiveTab] = useState([true, false, false, false, false]);

  return (
    <MypageTabStyle>
      {TABLIST.map((item, idx) => (
        <MypageTabItem title={item} ative={activeTab[idx]} key={idx} />
      ))}
    </MypageTabStyle>
  );
};

const MypageTabStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export default MypageTab;

// 받는 매개변수 path, title
// 필요한 기능 path를 통해 해당 주소로 이동? 아니지 탭을 써서 값만 바뀌는거네 ㅇㅇㅇ
// 그럼 tabItem 을 만들고 그걸 나열하면 되는거 아닌가
// 그리고 그거 값을 tanstack query 로 관리 한다고 보면 될꺼 같은데 ㅇㅇㅇ
// path: string, title: string
