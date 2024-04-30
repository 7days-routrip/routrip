import styled from "styled-components";
import Icons from "@/icons/icons";

const Loading = () => {
  return (
    <LoadingStyle>
      <Icons.LoadingIcon />
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 1080px;
  margin-top: -80px; // 헤더 높이 만큼

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  svg {
    width: 70px;
    height: 70px;
    fill: #ececec;
    animation: rotate 1s cubic-bezier(0.06, 0.08, 0.1, 1) infinite;
  }
`;

export default Loading;
