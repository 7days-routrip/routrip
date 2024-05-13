import icons from "@/icons/icons";
import { Post as IPost } from "@/models/post.model";

import styled from "styled-components";
import { DEFAULT_IMAGE } from "./ProfileCard";
import { Link } from "react-router-dom";

export type ViewMode = "grid" | "list";

interface Props {
  PostProps: IPost;
  view: ViewMode;
}

const PostCard = ({ PostProps, view }: Props) => {
  const PinIcon = icons.PinIcon;
  const Likecon = icons.LikeIcon;
  const CommentIcon = icons.CommentIcon;
  return (
    <PostCardStyle $profile={PostProps.userProfile} $view={view}>
      <Link to={`/post/${PostProps.id}`}>
        <CardImageStyle $image={PostProps.postsImg} $view={view} />
      </Link>

      <CardContentStyle>
        <div className="schedule">
          <div className="route">
            <PinIcon />
            <span>
              {PostProps.continental} • {PostProps.country}
            </span>
          </div>
          <div className="scedul-date">
            <span className="date-text">작성일 :</span>
            <span> {PostProps.createdAt}</span>
          </div>
        </div>
        <h3 className="card-title">{PostProps.title}</h3>
        <div className="author-info">
          <p className="card-date">여행 기간: {PostProps.date}</p>
          <div className="feedback">
            <div className="writer">
              <div className="profile-img"></div>
              <p>{PostProps.author}</p>
            </div>
            <div className="feedback-icon">
              <div className="comment">
                <CommentIcon />
                <span>{PostProps.commentsNum}</span>
              </div>
              <div className="like">
                <Likecon />
                <span>{PostProps.likesNum}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContentStyle>
    </PostCardStyle>
  );
};

export interface CardImageStyleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $image: string;
  $view: string;
}

export const CardImageStyle = styled.div<CardImageStyleProps>`
  display: flex;
  width: ${({ $view }) => ($view === "grid" ? "320px" : "280px")};
  height: ${({ $view }) => ($view === "grid" ? "170px" : "150px")};
  align-items: center;
  justify-content: center;
  background-image: url(${({ $image }) => ($image ? `data:image/${$image}` : DEFAULT_IMAGE)});
  background-position: center;
  background-size: cover;
  border: 0;

  border-radius: ${({ $view, theme }) => ($view === "grid" ? `${theme.borderRadius.tab}` : `8px 0 0 8px`)};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "170px" : "150px")};
    height: ${({ $view }) => ($view === "grid" ? "100px" : "110px")};
  }
`;

export const CardContentStyle = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  overflow: hidden;
  gap: 0.8rem;
  .card-title {
    margin: 1px;
    font-size: ${({ theme }) => theme.fontSize.medium};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .schedule {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: inherit;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .route {
      color: ${({ theme }) => theme.color.routeGray};
    }

    .route > :first-child {
      margin-bottom: 5px;
    }

    > :last-child {
      color: ${({ theme }) => theme.color.commentGray};
    }
  }

  @media (max-width: 768px) {
    padding: 0.3rem;
    gap: 0.2rem;

    .card-title {
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .date-text {
      display: none;
    }
  }
`;

interface CardStyleProps {
  $view: string;
}

export const CardStyle = styled.div<CardStyleProps>`
  display: flex;
  justify-content: first baseline;
  align-items: center;
  flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};
  width: ${({ $view }) => ($view === "grid" ? "320px" : "800px")};
  height: ${({ $view }) => ($view === "grid" ? "360px" : "150px")};
  p {
    margin: 2px;
  }

  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "175px" : "300px")};
    height: ${({ $view }) => ($view === "grid" ? "200px" : "110px")};
  }
`;

interface PostCardStyleProps {
  $profile: string;
  $view: string;
}

const PostCardStyle = styled(CardStyle)<PostCardStyleProps>`
  display: flex;

  .profile-img {
    background-image: url(${({ $profile }) => ($profile ? `data:image/${$profile}` : DEFAULT_IMAGE)});
    background-size: 2rem 1rem;
    background-position: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
  }

  .comment > :first-child,
  .like > :first-child {
    color: ${({ theme }) => theme.color.primary};
    margin: 0 0.35rem;
    width: 1rem;
  }

  .writer,
  .feedback,
  .comment,
  .like {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .feedback {
    display: flex;
    width: ${({ $view }) => ($view === "grid" ? "100%" : "auto")};
    justify-content: ${({ $view }) => ($view === "grid" ? "space-between" : "center")};
  }

  .author-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: ${({ $view }) => ($view === "grid" ? "flex-start" : "center")};
    flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};
  }

  .card-date {
    color: ${({ theme }) => theme.color.commentGray};
  }

  .feedback-icon {
    display: flex;
  }
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};

    .author-info {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default PostCard;
