import styled from "styled-components";
import { CardImageStyle } from "./postCard";
import Title from "./Title";
import { Post as IPost } from "@/models/post.model";
import icons from "@/icons/icons";
import { Link } from "react-router-dom";
interface Props {
  PostPops: IPost;
}

const MainPostCard = ({ PostPops }: Props) => {
  const { LikeIcon } = icons;
  return (
    <MainPostCardStyle>
      <Link to={`/posts/${PostPops.id}`}>
        <MainCardImageStyle $image={PostPops.postsImg} $view="grid" />
        <div className="info">
          <div className="date">
            <small>{PostPops.date}</small>
          </div>
          <div className="items">
            <div className="title">
              <div className="category">[{PostPops.country}]</div>
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
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  }

  .items {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    display: flex;
    width: 80%;
    align-items: center;
    gap: 0.3rem;
  }
  .category {
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .icon {
    display: flex;
    gap: 0.3rem;

    > :first-child {
      color: ${({ theme }) => theme.color.primary};
    }

    > :last-child {
      color: ${({ theme }) => theme.color.white};
    }
  }

  @media (max-width: 768px) {
    width: 170px;
    height: 100px;
  }
`;

const MainCardImageStyle = styled(CardImageStyle)`
  border-radius: ${({ theme }) => theme.borderRadius.default};
`;
export default MainPostCard;
