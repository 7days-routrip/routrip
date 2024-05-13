import styled from "styled-components";
import { MainPostCardStyle } from "./MainPostCard";
import { Post as IPost } from "@/models/post.model";
import { Link } from "react-router-dom";
import { CardImageStyle } from "./postCard";
import Title from "./Title";
interface Props {
  PostPops: IPost;
}
const GuidePostCard = ({ PostPops }: Props) => {
  return (
    <GuidePostCardStyle>
      <Link to={`/posts/${PostPops.id}`}>
        <GuideCardImageStyle $image={PostPops.postsImg} $view="grid" />
        <div className="info">
          <div className="title">
            <Title size="medium">{PostPops.title}</Title>
          </div>
        </div>
      </Link>
    </GuidePostCardStyle>
  );
};

const GuidePostCardStyle = styled(MainPostCardStyle)`
  flex: 1;
  width: 100%;
  /* min-width: 200px; */

  .title {
    width: 100%;
    color: ${({ theme }) => theme.color.white};
  }

  @media (max-width: 768px) {
    /* min-width: 100px; */
    height: 140px;

    .title > h1 {
      font-size: 10px;
    }
  }
`;

const GuideCardImageStyle = styled(CardImageStyle)`
  width: 100%;
  /* max-width: 250px; */
  height: 280px;
  border-radius: ${({ theme }) => theme.borderRadius.default};

  @media (max-width: 768px) {
    /* width: 100px; */
    height: 140px;
  }
`;
export default GuidePostCard;
