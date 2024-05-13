import styled from "styled-components";
import { CardImageStyle } from "./postCard";
import Title from "./Title";
import { Post as IPost } from "@/models/post.model";
import icons from "@/icons/icons";
interface Props {
  PostPops: IPost;
}

const MainPostCard = ({ PostPops }: Props) => {
  const { LikeIcon } = icons;
  return (
    <MainPostCardStyle>
      <MainCardImageStyle $image={PostPops.postsImg} $view="grid" />
      <div className="info">
        <div className="date">
          <small>{PostPops.date}</small>
        </div>
        <div className="items">
          <div className="category">[{PostPops.country}]</div>
          <Title size="small">{PostPops.title}</Title>
          <div className="icon">
            <LikeIcon />
            <small>{PostPops.likesNum}</small>
          </div>
        </div>
      </div>
    </MainPostCardStyle>
  );
};

const MainPostCardStyle = styled.div`
  position: relative;

  h1 {
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
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  }

  .items {
    display: flex;
  }

  .category {
    font-weight: 600;
    text-align: center;
  }

  .icon {
    > :first-child {
      color: ${({ theme }) => theme.color.primary};
    }

    > :last-child {
      color: ${({ theme }) => theme.color.white};
    }
  }
`;

const MainCardImageStyle = styled(CardImageStyle)``;
export default MainPostCard;
