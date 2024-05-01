import styled from "styled-components";
import logo from "../../../public/assets/images/logo-header.png";
import icons from "../../icons/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { theme } from "../../styles/theme";

const Header = () => {
  const { LoginIcon, JoinIcon, LogoutIcon, MyPageIcon } = icons;
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <HeaderStyle>
      <Link to="/">
        <img src={logo} alt="routrip logo" className="logo" />
      </Link>
      <nav>
        <ul>
          <li>
            <StyledLink to="/schedule">내 여행</StyledLink>
          </li>
          <li>
            <StyledLink to="/post">국내 여행</StyledLink>
          </li>
          <li>
            <StyledLink to="/post">해외 여행</StyledLink>
          </li>
        </ul>
      </nav>
      <div className="auth-icons">
        {isLogin ? (
          <>
            <IconText to="/logout" color="primary">
              <LogoutIcon color={theme.color.primary} />
              <span>로그아웃</span>
            </IconText>
            <IconText to="/mypage" color="primary">
              <MyPageIcon color={theme.color.primary} />
              <span>마이페이지</span>
            </IconText>
          </>
        ) : (
          <>
            <IconText to="/login">
              <LoginIcon />
              <span>로그인</span>
            </IconText>
            <IconText to="/join">
              <JoinIcon />
              <span>회원가입</span>
            </IconText>
          </>
        )}
      </div>
    </HeaderStyle>
  );
};

const HeaderStyle = styled.header`
  width: 100%;
  max-width: 1080px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  text-decoration: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  nav ul {
    display: flex;
    justify-content: center;
    gap: 20px;
    list-style: none;
    font-weight: bold;
  }

  .auth-icons {
    display: flex;
    gap: 10px;
  }

  .icon-text {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
    color: inherit;
  }
`;
const IconText = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  color: black;

  span {
    display: inline-block;
    width: 70px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

export default Header;
