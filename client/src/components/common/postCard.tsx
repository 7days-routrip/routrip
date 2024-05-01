import icons from "@/icons/icons";
import { Post as IPost } from "@/models/post.model";
import styled from "styled-components";

// props 로 받아야할꺼
// - 이미지 값
// - 여행경로
// - 제목
// - 일정 날짜
interface Props {
  PostProps: IPost;
}

const PostCard = ({ PostProps }: Props) => {
  const PinIcon = icons.PinIcon;
  const Likecon = icons.LikeIcon;
  const CommentIcon = icons.CommentIcon;
  return (
    <PostCardStyle $img={PostProps.image} $profile={PostProps.profileImage}>
      <div className="card-img">{}</div>
      <div className="card-content">
        <div className="schedule-info">
          <PinIcon />
          <p>{PostProps.schedule}</p>
        </div>
        <h3>{PostProps.title}</h3>
        <p>{PostProps.date}</p>
        <div className="profile-info">
          <div className="writer">
            <div className="profile-img"></div>
            <p>{PostProps.writer}</p>
          </div>
          <div className="feedback">
            <div className="comment">
              <Likecon />
              <p>{PostProps.comments}</p>
            </div>
            <div className="like">
              <CommentIcon />
              <p>{PostProps.like}</p>
            </div>
          </div>
        </div>
      </div>
    </PostCardStyle>
  );
};

interface PostCardStyleProps {
  $img: string;
  $profile: string;
}

const PostCardStyle = styled.div<PostCardStyleProps>`
  display: flex;
  justify-content: first baseline;
  align-items: center;
  flex-direction: column;
  width: 21.875rem;
  height: 18.75rem;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};

  .card-img {
    display: flex;
    width: 100%;
    height: 179px;
    align-items: center;
    justify-content: center;
    background-image: url(${({ $img }) => $img});
    border-radius: ${({ theme }) => theme.borderRadius.tab};
  }

  .profile-img {
    background-image: url(${({ $profile }) => $profile});
    background-size: 2rem 1rem;
    background-position: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
  }

  .card-content {
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 5px;
    p {
      /* padding: 0; */
      margin: 2px;
    }
    h3 {
      margin: 1px;
      font-size: ${({ theme }) => theme.fontSize.medium};
    }

    .schedule-info > :first-child {
      color: ${({ theme }) => theme.color.routeGray};
    }

    .comment > :first-child,
    .like > :first-child {
      color: ${({ theme }) => theme.color.primary};
    }

    .schedule-info,
    .writer,
    .feedback,
    .comment,
    .like {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .profile-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: 5px 0;
    }

    .comment {
      margin-right: 1rem;
    }
  }
`;

export default PostCard;
