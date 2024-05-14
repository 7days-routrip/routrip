import { BestPosts } from "@/apis/main.api";
import CategoryCard from "@/components/common/CategoryCard";
import GuidePostCard from "@/components/common/GuidePostCard";
import Loading from "@/components/common/Loading";
import MainPostCard from "@/components/common/MainPostCard";
import Banner from "@/components/main/Banner";
import SlideSection from "@/components/main/SlideSection";
import { categories } from "@/constants/categories";
import { useMain } from "@/hooks/useMain";
import { Post } from "@/models/post.model";
import styled from "styled-components";

const dummyPost: Post = {
  id: 1,
  title: "서울 여행 가이드",
  date: "2024.05.18-2024.05.22",
  author: "김아무개",
  userProfile: "",
  continental: "대한민국",
  country: "서울",
  commentsNum: "999",
  likesNum: "999",
  postsImg: "https://picsum.photos/seed/picsum/200/300",
  createdAt: "2024.03.12",
};

const MainPage = () => {
  const { bestPosts, homePosts, abroadPosts, isBestPostsLoading, isHomePostsLoading, isAbroadPostsLoading } = useMain();

  // if (!bestPosts || !homePosts || !abroadPosts || isBestPostsLoading || isHomePostsLoading || isAbroadPostsLoading)
  //   return <Loading />;

  return (
    <MainPageStyle>
      <Banner />
      <SlideSection title="🔥HOT한 여행지는 여기!">
        {/* {Array.from({ length: 10 }, (_, i) => (
          <MainPostCard key={i} PostPops={dummyPost} />
        ))} */}
        {bestPosts && bestPosts.map((post: BestPosts) => <MainPostCard key={post.id} PostPops={post} />)}
      </SlideSection>

      <div className="categories-container">
        <div className="category-group">
          {categories.slice(0, 4).map((item) => (
            <CategoryCard key={item.id} id={item.id} name={item.name} img={item.img} />
          ))}
        </div>
        <div className="category-group">
          {categories.slice(4).map((item) => (
            <CategoryCard key={item.id} id={item.id} name={item.name} img={item.img} />
          ))}
        </div>
      </div>

      <div className="guide-post-container">
        <h2>📌루트립의 추천 루트</h2>
        <div className="guide-posts">
          {Array.from({ length: 4 }, (_, i) => (
            <GuidePostCard key={i} PostPops={dummyPost} />
          ))}
        </div>
      </div>

      <SlideSection title="🚗국내 여행지">
        {homePosts && homePosts.posts.map((post: Post) => <MainPostCard key={post.id} PostPops={post} />)}
      </SlideSection>

      <SlideSection title="✈️해외 여행지">
        {Array.from({ length: 10 }, (_, i) => (
          <MainPostCard key={i} PostPops={dummyPost} />
        ))}
        {/* {abroadPosts && abroadPosts.posts.map((post: Post) => <MainPostCard key={post.id} PostPops={post} />)} */}
      </SlideSection>
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;

  h2 {
    margin-left: 0.8rem;
    margin-bottom: 0.1rem;
  }

  ul {
    padding: 0;
  }
  .guide-post-container {
    width: 100%;
    display: flex;
    flex-direction: column;

    .guide-posts {
      margin: 0 0.5rem;
      margin-bottom: 1.25rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
  }

  .categories-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    padding: 0.5rem;

    .category-group {
      display: flex;
      gap: 1rem;
    }
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    .guide-post-container .guide-posts {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .categories-container {
      flex-wrap: wrap;
    }
  }
`;

export default MainPage;
