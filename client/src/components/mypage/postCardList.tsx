import styled from "styled-components";
import PostCard from "../common/postCard";
import PlaceCard from "../common/LikePlaceCard";

const dummyCards = {
  id: 1,
  title: "string",
  date: "2024-05-04",
  author: "testAuthor",
  userProfile: "",
  continental: "대한민국",
  country: "서울",
  commentsNum: "50",
  likesNum: "60",
  postsImg: "https://picsum.photos/id/1/400/500",
};

interface Props {}

const PostCardList = () => {
  const arr = Array.from({ length: 8 }).fill(0);
  return (
    <PostCardListStyle>
      {arr.map((_, idx) => (
        <PostCard PostProps={dummyCards} view="grid" key={idx} />
      ))}
    </PostCardListStyle>
  );
};
// https://wisesilver.tistory.com/25
const PostCardListStyle = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  flex-wrap: wrap;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default PostCardList;
