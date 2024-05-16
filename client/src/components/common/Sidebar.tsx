import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  onClose: () => void;
  menuType: "nav" | "user";
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, menuType }) => {
  const { isLoggedIn, storeLogout } = useAuthStore();
  const { userLogout } = useAuth();

  const logoutHandler = async () => {
    await userLogout();
    storeLogout();
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <SidebarContainer onClick={(e) => e.stopPropagation()}>
        <SidebarHeader>
          <CloseButton onClick={onClose}>×</CloseButton>
        </SidebarHeader>
        <nav>
          <ul>
            {menuType === "nav" ? (
              <>
                <li>
                  <StyledLink to="/schedule" onClick={onClose}>
                    내 여행
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/post?area=home" onClick={onClose}>
                    국내 여행지
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/post?area=abroad" onClick={onClose}>
                    해외 여행지
                  </StyledLink>
                </li>
              </>
            ) : isLoggedIn ? (
              <>
                <li>
                  <StyledLink to="/me" onClick={onClose}>
                    마이페이지
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/mypage?tag=schedules" onClick={onClose}>
                    일정 모음
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/mypage?tag=posts" onClick={onClose}>
                    내 여행글
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/mypage?tag=comments" onClick={onClose}>
                    내 댓글
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/mypage?tag=like-posts" onClick={onClose}>
                    좋아요 한 글
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/mypage?tag=like-places" onClick={onClose}>
                    찜한 장소
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/" onClick={logoutHandler}>
                    로그아웃
                  </StyledLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <StyledLink to="/login" onClick={onClose}>
                    로그인
                  </StyledLink>
                </li>
                <li>
                  <StyledLink to="/join" onClick={onClose}>
                    회원가입
                  </StyledLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </SidebarContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  padding: 20px;
  display: flex;
  flex-direction: column;

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  nav ul li {
    font-size: 18px;
    font-weight: bold;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;

  &:hover {
    opacity: 0.8;
  }
`;

export default Sidebar;
