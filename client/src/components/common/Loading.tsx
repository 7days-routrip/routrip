import styled from "styled-components";
import Icons from "@/icons/icons";

interface Props {
  isFull?: boolean;
}

const Loading = ({ isFull = false }: Props) => {
  return (
    <LoadingStyle $isFull={isFull}>
      <Icons.LoadingIcon />
    </LoadingStyle>
  );
};

interface LoadingStyleProps {
  $isFull: boolean;
}
const LoadingStyle = styled.div<LoadingStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};
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
