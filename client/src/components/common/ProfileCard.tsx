import { Profile } from "@/models/profile.model";
import styled from "styled-components";

export const DEFAULT_IMAGE = "https://7days-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.png";

interface Props {
  ProfileProps: Profile;
}

const ProfileCard = ({ ProfileProps }: Props) => {
  return (
    <ProfileCardStyle>
      <ProfileImageStyle $image={ProfileProps.profileImg} />
      <div className="profile-info">
        <span className="user-nickname">{ProfileProps.nickName}</span>
        <section className="user-stats">
          <div className="user-schedules">일정 모음 {ProfileProps.journeysNum}개</div>
          <div className="profile-dot">.</div>
          <div className="user-posts">여행글 {ProfileProps.postsNum}개</div>
          <div className="profile-dot">.</div>
          <div className="user-comments">내 댓글 {ProfileProps.commentsNum}개</div>
        </section>
        <section className="user-likes">
          <div className="likes-posts">좋아요한 글 {ProfileProps.likePostsNum}개 </div>
          <div className="profile-dot">.</div>
          <div className="likes-places">내가 찜한 장소 {ProfileProps.likeSpotsNum}개</div>
        </section>
      </div>
    </ProfileCardStyle>
  );
};

export interface ProfileImageStyleProps {
  $image?: string;
}

export const ProfileImageStyle = styled.div<ProfileImageStyleProps>`
  width: 6rem;
  height: 6rem;

  background-image: url(${({ $image }) => ($image ? $image : DEFAULT_IMAGE)});
  background-position: center;
  background-size: cover;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 50%;
  margin: 1rem;
`;

const ProfileCardStyle = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;

  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};

  .profile-info {
    display: flex;
    flex: 1;
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
    font-size: 9px;
    justify-content: center;
    min-width: 320px;
    padding: 0;
    height: 100px;
  }
`;

export default ProfileCard;
