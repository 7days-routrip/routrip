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
          <div className="user-posts">여행글 {ProfileProps.postsNum}개</div>
          <div className="user-comments">내 댓글 {ProfileProps.commentsNum}개</div>
        </section>
        <section className="user-likes">
          <div className="likes-posts">좋아요 한글 {ProfileProps.likePostsNum}개</div>
          <div className="likes-places">내가 찜한 장소 {ProfileProps.likeSpotsNum}개</div>
        </section>
      </div>
    </ProfileCardStyle>
  );
};

interface ProfileImageStyleProps {
  $image: string;
}

const ProfileImageStyle = styled.div<ProfileImageStyleProps>`
  width: 6.25rem;
  height: 6.25rem;
  background-image: url(${({ $image }) => ($image ? $image : DEFAULT_IMAGE)});
  background-color: ${({ theme }) => theme.color.white};
  background-size: 70% 60%;
  background-position: center;
  border-radius: 50%;
  margin: 1rem;
`;

const ProfileCardStyle = styled.div`
  width: 1080px;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
  align-items: center;

  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};

  .profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: inherit;
  }

  .user-nickname {
    font-size: ${({ theme }) => theme.fontSize.large};
    font-weight: bold;
  }

  .user-stats,
  .user-likes {
    display: flex;
    margin: 0.3rem 0;
    width: auto;
    height: 20px;
    div {
      margin-right: 15px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 768px;
    height: 130px;
  }
`;

export default ProfileCard;
