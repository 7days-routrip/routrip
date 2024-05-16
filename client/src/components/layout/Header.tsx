import styled from "styled-components";
import logo from "../../../public/assets/images/logo-header.png";
import icons from "../../icons/icons";
import { Link } from "react-router-dom";
import { theme } from "../../styles/theme";
import Sidebar from "../common/Sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import Dropdown from "../common/Dropdown";
import { useState } from "react";

interface Props {
  isFull?: boolean;
}

const Header = ({ isFull = false }: Props) => {
  const { LoginIcon, JoinIcon, LogoutIcon, MyPageIcon, HamburgerIcon, MobileUserIcon } = icons;
  const { isLoggedIn, storeLogout } = useAuthStore();
  const { userLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  const logoutHandler = () => {
    userLogout().then(() => {
      storeLogout();
    });
  };

  return (
    <>
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
              <StyledLink to="/post?area=home">국내 여행지</StyledLink>
            </li>
            <li>
              <StyledLink to="/post?area=abroad">해외 여행지</StyledLink>
            </li>
          </ul>
        </nav>
        <div className="desktop-auth-icons">
          {isLoggedIn ? (
            <>
              <IconText onClick={logoutHandler} to={"/"} color="primary">
                <LogoutIcon color={theme.color.primary} />
                <span>로그아웃</span>
              </IconText>
              <div className="mypage">
                <Dropdown toggleIcon={<MyPageIcon color={theme.color.primary} />} title="마이페이지">
                  <IconText to={"/me"}>
                    <small>내 정보 수정</small>
                  </IconText>
                  <IconText to={"/mypage?tag=schedules"}>
                    <small>일정 모음</small>
                  </IconText>
                  <IconText to={"/mypage?tag=posts"}>
                    <small>내 여행글</small>
                  </IconText>
                  <IconText to={"/mypage?tag=comments"}>
                    <small>내 댓글</small>
                  </IconText>
                  <IconText to={"/mypage?tag=like-posts"}>
                    <small>좋아요 한 글</small>
                  </IconText>
                  <IconText to={"/mypage?tag=like-places"}>
                    <small>찜한 장소</small>
                  </IconText>
                </Dropdown>
              </div>
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
          <HamburgerIcon onClick={() => setSidebarOpen(true)} />
          <MobileUserIcon onClick={() => setMobileUserMenuOpen(true)} />
        </div>
      </HeaderStyle>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} menuType="nav" />}
      {mobileUserMenuOpen && <Sidebar onClose={() => setMobileUserMenuOpen(false)} menuType="user" />}
    </>
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
    img {
      width: 80px;
      height: 37px;
    }
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
    width: 80px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

export default Header;
