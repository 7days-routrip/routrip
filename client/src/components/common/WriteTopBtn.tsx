import React from "react";
import styled from "styled-components";
import icons from "@/icons/icons";
import { Button } from "./Button";

const WriteTopBtnStyle = styled.div`
  position: fixed;
  bottom: 80px;
  right: 32px;
  margin: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  z-index: 1;
  min-height: 50px;

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    bottom: 20px;
    right: 20px;
  }
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
        <Button
          $size="large"
          $scheme="secondary"
          $radius="write"
          onClick={() => (window.location.href = "/write")}
          style={{ padding: "0.5rem 0.6rem" }}
        >
          글쓰기
        </Button>
      )}
      <Button
        $size="large"
        $scheme="primary"
        $radius="write"
        onClick={handleScrollTop}
        style={{ borderRadius: "50%", padding: "0.5rem 0.6rem" }}
      >
        <TopIcon color="white" />
      </Button>
    </WriteTopBtnStyle>
  );
};

export default WriteTopBtn;
