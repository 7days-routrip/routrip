import styled from "styled-components";
import { theme } from "../../styles/theme";
import icons from "@/icons/icons";

const WriteTopBtnStyle = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ primary?: boolean }>`
  border-radius: ${theme.borderRadius.write};
  border: 1px solid ${theme.color.primary};
  background-color: ${(props) => (props.primary ? theme.color.primary : theme.color.white)};
  color: ${(props) => (props.primary ? theme.color.white : theme.color.primary)};
  font-size: ${theme.buttonSize.medium.fontSize};
  padding: ${theme.buttonSize.small.padding};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// 컴포넌트 기능 구현
const WriteTopBtn = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { TopIcon } = icons;

  return (
    <WriteTopBtnStyle>
      <Button primary={false} onClick={() => (window.location.href = "/write")}>
        글쓰기
      </Button>
      <Button primary onClick={handleScrollTop}>
        <TopIcon color="white" />
      </Button>
    </WriteTopBtnStyle>
  );
};

export default WriteTopBtn;
