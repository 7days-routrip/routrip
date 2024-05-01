import icons from "@/icons/icons";
import { Post as IPost } from "@/models/post.model";

import styled from "styled-components";

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
    <PostCardStyle $profile={PostProps.profileImage} $view={view}>
      <CardImageStyle $image={PostProps.postsImg} $view={view} />
      <CardContentStyle>
        <ScheduleStyle>
          <PinIcon />
          <span>
            {PostProps.continental} • {PostProps.country}
          </span>
        </ScheduleStyle>
        <h3 className="card-title">{PostProps.title}</h3>
        <p className="card-date">{PostProps.date}</p>
        <div className="autho-info">
          <div className="writer">
            <div className="profile-img"></div>
            <p>{PostProps.author}</p>
          </div>
          <div className="feedback">
            <div className="comment">
              <Likecon />
              <span>{PostProps.commentsNum}</span>
            </div>
            <div className="like">
              <CommentIcon />
              <span>{PostProps.like}</span>
            </div>
          </div>
        </div>
      </CardContentStyle>
    </PostCardStyle>
  );
};

interface CardImageStyleProps {
  $image: string;
  $view: string;
}

export const CardImageStyle = styled.div<CardImageStyleProps>`
  display: flex;
  width: ${({ $view }) => ($view === "grid" ? "100%" : "300px")};
  height: ${({ $view }) => ($view === "grid" ? "180px" : "100%")};

  align-items: center;
  justify-content: center;
  background-image: url(${({ $image }) => $image});
  background-position: center;
  background-size: cover;

  border-radius: ${({ $view, theme }) => ($view === "grid" ? `${theme.borderRadius.tab}` : `8px 0 0 8px`)};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "100%" : "150px")};
    height: ${({ $view }) => ($view === "grid" ? "100px" : "100%")};
  }
`;

export const CardContentStyle = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 5px;
  overflow: hidden;

  .card-title {
    width: 80%;
    margin: 1px;
    font-size: ${({ theme }) => theme.fontSize.medium};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ScheduleStyle = styled.div`
  display: flex;
  justify-content: first baseline;
  align-items: center;
  width: inherit;
  span {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :first-child {
    color: ${({ theme }) => theme.color.routeGray};
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
  width: ${({ $view }) => ($view === "grid" ? "350px" : "800px")};
  height: ${({ $view }) => ($view === "grid" ? "300px" : "150px")};
  p {
    margin: 2px;
  }

  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "300px")};
    height: ${({ $view }) => ($view === "grid" ? "200px" : "110px")};
  }
`;

interface PostCardStyleProps {
  $profile: string;
  $view: string;
}

const PostCardStyle = styled(CardStyle)<PostCardStyleProps>`
  .profile-img {
    background-image: url(${({ $profile }) => $profile});
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
    margin: 2px;
  }

  .writer,
  .feedback,
  .comment,
  .like {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .autho-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    white-space: nowrap;
    padding: 5px;
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.fontSize.xsmall};
    }
  }
`;

export default PostCard;
