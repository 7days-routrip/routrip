import styled from "styled-components";
import { theme } from "../../styles/theme";

const WriteTopBtnStyle = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ primary?: boolean }>`
  border-radius: ${theme.borderRadius.write};
  border: 2px solid ${(props) => (props.primary ? theme.color.primary : theme.color.white)};
  background-color: ${(props) => (props.primary ? theme.color.primary : theme.color.white)};
  color: ${(props) => (props.primary ? theme.color.white : theme.color.primary)};
  font-size: ${theme.buttonSize.medium.fontSize};
  padding: ${theme.buttonSize.medium.padding};
  cursor: pointer;
  box-shadow: ${theme.boxShadow.default};

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

  return (
    <WriteTopBtnStyle>
      <Button primary={false} onClick={() => (window.location.href = "/write")}>
        글쓰기
      </Button>
      <Button primary onClick={handleScrollTop}>
        Top
      </Button>
    </WriteTopBtnStyle>
  );
};

export default WriteTopBtn;
