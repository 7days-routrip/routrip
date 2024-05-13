import styled from "styled-components";
import ErrorImg from "../../public/assets/images/logo-error.png";

const ErrorPage = () => {
  return (
    <ErrorPageStyle>
      <img src={ErrorImg} alt="Error Logo" width="230px" height="280px" />
      <h1>페이지를 찾을 수가 없습니다.</h1>
      <p>
        존재하지 않는 주소를 입력하였거나
        <br />
        요청하신 페이지의 주소가 변경되었습니다.
      </p>
    </ErrorPageStyle>
  );
};

const ErrorPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  h1 {
    font-size: ${({ theme }) => theme.fontSize.xlarge};
    color: ${({ theme }) => theme.color.black};
    font-weight: bold;
    margin-bottom: -5px;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.medium};
    color: ${({ theme }) => theme.color.black};
    text-align: center;
  }
`;

export default ErrorPage;
