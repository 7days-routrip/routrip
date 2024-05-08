import styled from "styled-components";
import logo from "../../../public/assets/images/logo-header.png";
import icons from "../../icons/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { theme } from "../../styles/theme";

interface Props {
  isFull?: boolean;
}

const Header = ({ isFull = false }: Props) => {
  const { LoginIcon, JoinIcon, LogoutIcon, MyPageIcon, HamburgerIcon, MobileUserIcon } = icons;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <HeaderStyle $isFull={isFull}>
      <Link to="/" className="logo-link">
        <img src={logo} alt="routrip logo" className="logo" />
      </Link>
      <nav className="desktop-nav">
        <ul>
          <li>
            <StyledLink to="/schedule">내 여행</StyledLink>
          </li>
          <li>
            <StyledLink to="/post">국내 여행지</StyledLink>
          </li>
          <li>
            <StyledLink to="/post">해외 여행지</StyledLink>
          </li>
        </ul>
      </nav>
      <div className="desktop-auth-icons">
        {isLoggedIn ? (
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
      <div className="mobile-auth-icons">
        <HamburgerIcon />
        <MobileUserIcon />
      </div>
    </HeaderStyle>
  );
};

export interface HeaderStyleProps {
  $isFull: boolean;
}

const HeaderStyle = styled.header<HeaderStyleProps>`
  width: 100%;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.color.white};
  padding: 0 0.8rem;

  .desktop-nav,
  .desktop-auth-icons {
    display: flex;
  }

  .mobile-auth-icons {
    display: none;
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    .logo-link {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .desktop-nav,
    .desktop-auth-icons {
      display: none;
    }
    .mobile-auth-icons {
      display: flex;
      justify-content: flex-end;
      margin-right: 20px;
      width: 100%;
      gap: 20px;
      align-items: center;
    }
  }

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
