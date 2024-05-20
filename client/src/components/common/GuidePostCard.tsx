import styled from "styled-components";
import { MainPostCardStyle } from "./MainPostCard";
import { Post as IPost } from "@/models/post.model";
import { Link } from "react-router-dom";
import { CardImageStyle, CardImageStyleProps } from "./postCard";
import Title from "./Title";
import { DEFAULT_IMAGE } from "./ProfileCard";
interface Props {
  PostPops: IPost;
}
const GuidePostCard = ({ PostPops }: Props) => {
  return (
    <GuidePostCardStyle>
      <Link to={`/posts/${PostPops.id}`}>
        <div className="image-wrapper">
          <GuideCardImageStyle $image={PostPops.postsImg} $view="grid" className="card-image-style" />
        </div>
        <div className="info">
          <div className="title">
            <Title size="medium">{PostPops.title}</Title>
          </div>
        </div>
      </Link>
    </GuidePostCardStyle>
  );
};

const GuidePostCardStyle = styled.div`
  flex: 1;
  max-width: 250px;
  min-width: 130px;
  position: relative;
  .image-wrapper {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }

  &:hover {
    .card-image-style {
      transform: scale(1.1);
    }
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
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0));
  }
  /* min-width: 200px; */

  .title {
    width: 100%;
    color: ${({ theme }) => theme.color.white};
  }

  @media (max-width: 768px) {
    flex: 1;
    height: 140px;
    max-width: 170px;
    .title > h1 {
      font-size: 10px;
    }
  }
`;

const GuideCardImageStyle = styled.div<CardImageStyleProps>`
  display: flex;
  height: 280px;
  background-image: url(${({ $image }) => ($image ? $image : DEFAULT_IMAGE)});
  background-position: center;
  background-size: cover;
  border: 0;
  transition: transform 0.3s;

  @media (max-width: 768px) {
    flex: 1;
    height: 140px;
  }
`;
export default GuidePostCard;
