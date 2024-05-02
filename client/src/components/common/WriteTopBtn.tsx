import React from "react";
import styled from "styled-components";
import icons from "@/icons/icons";
import Button from "./Button";

const WriteTopBtnStyle = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: -60px;
  z-index: 1;
  min-height: 50px;
`;

const WriteButton = styled(Button)`
  padding: 0.5rem 0.6rem;
`;

const TopButton = styled(Button)`
  padding: 0.5rem 0.6rem;
`;

interface WriteTopBtnProps {
  isWriting: boolean;
}

const WriteTopBtn: React.FC<WriteTopBtnProps> = ({ isWriting }) => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const { TopIcon } = icons;

  return (
    <WriteTopBtnStyle>
      {isWriting && (
        <WriteButton size="medium" scheme="secondary" radius="write" onClick={() => (window.location.href = "/write")}>
          글쓰기
        </WriteButton>
      )}
      <TopButton size="small" scheme="primary" radius="write" onClick={handleScrollTop} style={{ borderRadius: "50%" }}>
        <TopIcon color="white" />
      </TopButton>
    </WriteTopBtnStyle>
  );
};

export default WriteTopBtn;
