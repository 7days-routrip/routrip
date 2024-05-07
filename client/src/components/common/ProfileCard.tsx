import { ProfileCard as IProfileCard } from "@/models/profile.model";
import styled from "styled-components";

export const DEFAULT_IMAGE = "assets/images/logo-profile.png";

interface Props {
  ProfileProps: IProfileCard;
}

const ProfileCard = ({ ProfileProps }: Props) => {
  return (
    <ProfileCardStyle>
      <ProfileImageStyle $image={ProfileProps.profile} />
      <div className="profile-info">
        <span className="user-nickname">{ProfileProps.nickname}</span>
        <section className="user-stats">
          <div className="user-schedules">일정 모음 {ProfileProps.journeysNum}개</div>
          <div className="profile-dot">.</div>
          <div className="user-posts">여행글 {ProfileProps.postsNum}개</div>
          <div className="profile-dot">.</div>
          <div className="user-comments">내 댓글 {ProfileProps.commentsNum}개</div>
        </section>
        <section className="user-likes">
          <div className="likes-posts">좋아요 한글 {ProfileProps.likePostsNum}개 </div>
          <div className="profile-dot">.</div>
          <div className="likes-places">내가 찜한 장소 {ProfileProps.likeSpotsNum}개</div>
        </section>
      </div>
    </ProfileCardStyle>
  );
};

export interface ProfileImageStyleProps {
  $image: string;
}

export const ProfileImageStyle = styled.div<ProfileImageStyleProps>`
  width: 6rem;
  height: 6rem;
  background-image: url(${({ $image }) => ($image ? "data:image/png;base64,${$image}" : DEFAULT_IMAGE)});
  background-color: ${({ theme }) => theme.color.white};
  background-size: 70% 60%;
  background-position: center;
  border-radius: 50%;
  margin: 1rem;
`;

const ProfileCardStyle = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.5rem;

  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};

  .profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: inherit;
  }
  .profile-dot,
  .user-nickname {
    font-size: ${({ theme }) => theme.fontSize.large};
    font-weight: bold;
  }

  .profile-dot {
    text-align: center;
    width: 10px;
    height: 10px;
    line-height: 10px;
  }

  .user-stats,
  .user-likes {
    display: flex;
    margin: 0.3rem 0;

    gap: 0.5rem;
    width: auto;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    height: 100px;
  }
`;

export default ProfileCard;
