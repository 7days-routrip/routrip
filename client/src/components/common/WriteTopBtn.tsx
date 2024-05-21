import React from "react";
import styled from "styled-components";
import icons from "@/icons/icons";
import { Button } from "./Button";

const WriteTopBtnStyle = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  align-items: center;
  z-index: 1;
  min-height: 50px;

  .top-btn {
    padding: 0.5rem 0.8rem 0.7rem;
    border: 2px solid ${({ theme }) => theme.color.primary};
  }

  button {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
    border: 2px solid ${({ theme }) => theme.color.primary};

    &:hover {
      opacity: 1;
    }
  }

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
          $scheme="primary"
          $radius="write"
          onClick={() => (window.location.href = "/write")}
          style={{ padding: "0.6rem 1rem", fontWeight: "bold" }}
        >
          글쓰기
        </Button>
      )}
      <Button
        className="top-btn"
        $size="large"
        $scheme="secondary"
        $radius="write"
        onClick={handleScrollTop}
        style={{ borderRadius: "50%" }}
      >
        <TopIcon color="#7aafff" />
      </Button>
    </WriteTopBtnStyle>
  );
};

export default WriteTopBtn;
