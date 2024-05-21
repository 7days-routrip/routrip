import styled from "styled-components";
import { CardImageStyle } from "./postCard";
import Title from "./Title";
import icons from "@/icons/icons";
import { Link } from "react-router-dom";
import { Post } from "@/models/post.model";
import { BestPosts } from "@/apis/main.api";
interface Props {
  PostPops: Post | BestPosts;
}

const MainPostCard = ({ PostPops }: Props) => {
  const { LikeIcon } = icons;
  return (
    <MainPostCardStyle>
      <Link to={`/post/${PostPops.id}`}>
        <div className="image-wrapper">
          <MainCardImageStyle $image={PostPops.postsImg} $view="grid" className="card-image-style" />
        </div>
        <div className="info">
          <div className="date">
            <small>{PostPops.date}</small>
          </div>
          <div className="items">
            <div className="title">
              <div className="category">[{PostPops.country.name}]</div>
              <Title size="small">{PostPops.title}</Title>
            </div>
            <div className="icon">
              <LikeIcon />
              <small>{PostPops.likesNum}</small>
            </div>
          </div>
        </div>
      </Link>
    </MainPostCardStyle>
  );
};

export const MainPostCardStyle = styled.div`
  position: relative;
  width: 100%;

  a {
    display: flex;
  }

  .image-wrapper {
    overflow: hidden;
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }

  .card-image-style {
    position: unset;
    transform: unset;
    height: 180px;
  }
  &:hover {
    .card-image-style {
      transform: scale(1.1);
    }
  }

  h1 {
    margin: 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date > small {
    color: ${({ theme }) => theme.color.routeGray};
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: end;
    text-align: left;
    bottom: 0px;
    height: 100%;
    width: 100%;
    position: absolute;
    padding: 0 0.5rem 0.5rem;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    background: linear-gradient(to top, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0));
  }

  .items {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .title {
    display: flex;
    width: 80%;
    align-items: center;
    gap: 0.3rem;
    h1 {
      line-height: 1.5;
    }
  }

  .category {
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .icon {
    display: flex;
    gap: 0.3rem;
    align-items: center;

    > :first-child {
      color: ${({ theme }) => theme.color.primary};
    }

    > :last-child {
      color: ${({ theme }) => theme.color.black};
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    /* max-width: 170px; */
    /* height: 100px; */
  }
`;

const MainCardImageStyle = styled(CardImageStyle)`
  border-radius: ${({ theme }) => theme.borderRadius.default};
  width: 100%;
  background-size: cover;
  &::after {
    background: none;
  }
`;
export default MainPostCard;
