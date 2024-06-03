import icons from "@/icons/icons";
import { Post as IPost } from "@/models/post.model";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE } from "@/constants/defaultImage";

export type ViewMode = "grid" | "list";
export type AreaType = "home" | "abroad" | null;

interface Props {
  PostProps: IPost;
  view: ViewMode;
}

const PostCard = ({ PostProps, view }: Props) => {
  const PinIcon = icons.PinIcon;
  const Likecon = icons.LikeIcon;
  const CommentIcon = icons.CommentIcon;
  return (
    <PostCardStyle $profile={PostProps.profileImg} $view={view}>
      <Link to={`/post/${PostProps.id}`}>
        <div className="image-wrapper">
          <div className="inner">
            <CardImageStyle $image={PostProps.postsImg} $view={view} className="card-image-style" />
          </div>
        </div>

        <CardContentStyle $view={view}>
          <div className="schedule">
            <div className="route">
              <PinIcon />
              <span className="category">
                <span>{PostProps.continent.name}</span>
                <span>{PostProps.country.name}</span>
              </span>
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
            </div>{" "}
            {/* end : feddback-icon */}
          </div>
          <h3 className="card-title">{PostProps.title}</h3>
          {/* <p className="card-date">여행 기간: {PostProps.date}</p> */}
          <div className="author-info">
            <div className="feedback">
              <div className="writer">
                <div className="profile-img"></div>
                <p>{PostProps.author}</p>
              </div>
            </div>
            <div className="scedul-date">
              <span className="date-text"></span>
              <span> {PostProps.createdAt}</span>
            </div>
          </div>
        </CardContentStyle>
      </Link>
    </PostCardStyle>
  );
};

export interface CardImageStyleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $image: string;
  $view: string;
}

export const CardImageStyle = styled.div<CardImageStyleProps>`
  display: flex;
  width: 100%;
  height: 100%;
  background-image: url(${({ $image }) => ($image ? $image : DEFAULT_IMAGE)});
  background-position: center;
  background-size: ${({ $image }) => ($image ? "cover" : "60%")};
  border: 0;
  border-radius: ${({ $view, theme }) => ($view === "grid" ? `${theme.borderRadius.tab}` : `8px 0 0 8px`)};

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    background: ${({ $view }) =>
      $view === "grid" ? "linear-gradient(180deg, rgba(0,0,0,0.3), transparent)" : "unset"};
    position: absolute;
  }

  @media (max-width: 768px) {
    /* width: ${({ $view }) => ($view === "grid" ? "170px" : "150px")}; */
    height: ${({ $view }) => ($view === "grid" ? "100px" : "110px")};
    background-size: ${({ $image }) => ($image ? "cover" : "30%")};
  }
`;
interface CardContentStyleProps {
  $view: string;
}
export const CardContentStyle = styled.div<CardContentStyleProps>`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  overflow: hidden;
  gap: 0.5rem;

  * {
    line-height: 1;
  }

  .card-title {
    margin: unset;
    font-size: ${({ theme }) => theme.fontSize.medium};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    line-height: ${({ $view }) => ($view === "grid" ? "1.5" : "1")};
    color: ${({ theme }) => theme.color.black};
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
      /* margin-bottom: 5px; */
    }

    .route > :last-child {
      color: ${({ theme }) => theme.color.routeGray};
    }

    .category {
      span {
        letter-spacing: -0.05rem;
        font-size: ${({ theme }) => theme.fontSize.xsmall};
      }
      span:first-child {
        position: relative;
        margin-right: 1rem;

        &::after {
          content: "";
          width: 3px;
          height: 3px;
          background-color: ${({ theme }) => theme.color.black};
          border-radius: 50%;
          position: absolute;
          right: -1rem;
          top: 50%;
          transform: translate(calc(-0.5rem - -1.5px), -50%);
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.5rem;

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
  /* display: flex; */
  flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};
  /* align-items: center; */
  height: ${({ $view }) => ($view === "grid" ? "auto" : "120px")};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  @media (max-width: 768px) {
    /* width: ${({ $view }) => ($view === "grid" ? "175px" : "300px")}; */
    /* height: ${({ $view }) => ($view === "grid" ? "200px" : "110px")}; */
  }
`;

interface PostCardStyleProps {
  $profile: string;
  $view: string;
}

const PostCardStyle = styled(CardStyle)<PostCardStyleProps>`
  display: flex;
  position: ${({ $view }) => ($view === "grid" ? "relative" : "unset")};
  overflow: hidden;
  width: 100%;
  a {
    width: 100%;
    display: flex;
    flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};
  }
  .image-wrapper {
    width: ${({ $view }) => ($view === "grid" ? "100%" : "280px")};
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }
  .image-wrapper > .inner {
    width: 100%;
    height: ${({ $view }) => ($view === "grid" ? "170px" : "150px")};
    transform: scale(1);
    transition: transform 0.3s;
  }
  &:hover {
    .image-wrapper > div {
      transform: scale(1.1);
    }
  }
  .profile-img {
    background-image: url(${({ $profile }) => ($profile ? `${$profile}` : DEFAULT_IMAGE)});
    background-size: 2rem 1rem;
    background-position: center;
    background-size: cover;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
  }
  .profile-img + p {
    margin: unset;
    margin-left: 0.5rem;
    color: ${({ theme }) => theme.color.commentGray};
  }

  .comment > :first-child,
  .like > :first-child {
    /* color: ${({ theme }) => theme.color.primary}; */
    color: ${({ $view, theme }) => ($view === "grid" ? "#2a7efb" : theme.color.primary)};
    margin-right: 0.2rem;
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
  .like {
    margin-left: 0.5rem;
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
    align-items: center;
  }

  .card-date {
    width: 100%;
    margin-bottom: ${({ $view }) => ($view === "grid" ? "0.5rem" : "0")};
  }

  .scedul-date,
  .card-date {
    color: ${({ theme }) => theme.color.commentGray};
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }

  .feedback-icon {
    display: flex;
    position: ${({ $view }) => ($view === "grid" ? "absolute" : "unset")};
    right: 1rem;
    top: 1rem;
    color: ${({ $view, theme }) => ($view === "grid" ? theme.color.white : theme.color.black)};
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};
    .image-wrapper > .inner {
      width: 100%;
      height: ${({ $view }) => ($view === "grid" ? "100px" : "150px")};
    }
  }
`;

export default PostCard;
