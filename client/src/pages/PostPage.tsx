import styled from "styled-components";
import icons from "@/icons/icons";

import PostCard from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useState } from "react";
import { ViewMode } from "@/components/common/postCard";
import { Link } from "react-router-dom";

export const posts: Post[] = [
  {
    id: 1,
    title: "오션뷰를 보고 싶다면? 여기 !!",
    date: "2024.03.14 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "210",
    postsImg: "../../public/assets/images/logo-footer.png",
    createdAt: "2024-04-01",
  },
  {
    id: 2,
    title: "제주에서의 3일",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "190",
    postsImg: "../../public/assets/images/logo-footer.png",
    createdAt: "2024-04-11",
  },
  {
    id: 3,
    title: "가까운 해외, 일본!",
    date: "2024.03.09 ~ 2024.03.19",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "240",
    postsImg: "../../public/assets/images/logo-footer.png",
    createdAt: "2024-04-13",
  },
  {
    id: 4,
    title: "최고의 휴양지",
    date: "2024.03.11 ~ 2024.03.20",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "280",
    postsImg: "../../public/assets/images/logo-footer.png",
    createdAt: "2024-05-05",
  },
  {
    id: 4,
    title: "겨울에 떠나는 삿포로",
    date: "2024.03.11 ~ 2024.03.15",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "120",
    postsImg: "../../public/assets/images/logo-footer.png",
    createdAt: "2024-03-17",
  },
];
interface PostPageStyleProps {
  view: string;
}

const PostPage = () => {
  const { SearchIcon, GridIcon, ListIcon } = icons;

  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<string>("recent");

  const clickListBtn = () => {
    setView("list");
  };

  const clickGridBtn = () => {
    setView("grid");
  };

  const sortedPosts =
    sortOrder === "recent"
      ? [...posts].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
      : [...posts].sort((a, b) => {
          const likesA = parseInt(a.likesNum, 10);
          const likesB = parseInt(b.likesNum, 10);
          return likesB - likesA;
        });

  return (
    <PostPageStyle view={view}>
      <div className="content-wrapper">
        <select>
          <option value="">전체</option>
          <option value="일본">일본</option>
          <option value="중국">중국</option>
          <option value="홍콩">홍콩/마카오/대만</option>
        </select>
        <div className="input-wrapper">
          <input type="search" placeholder="검색어를 입력하세요." />
          <SearchIcon />
        </div>
      </div>
      <div className="main-content">
        <div className="btn-wrapper">
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="recent">최신순</option>
            <option value="likes">인기순</option>
          </select>

          <GridIcon width="50px" height={"50px"} onClick={clickGridBtn} />
          <ListIcon onClick={clickListBtn} />
        </div>
        <hr></hr>
        <div className="post">
          {sortedPosts.map((post) => (
            <StyledLink key={post.id} to={`/post/${post.id}`}>
              <PostCard key={post.id} PostProps={post} view={view} />
            </StyledLink>
          ))}
        </div>
      </div>
    </PostPageStyle>
  );
};
const PostPageStyle = styled.div<PostPageStyleProps>`
  .content-wrapper {
    display: flex;
    margin: 0 auto;
    height: 50px;
    gap: 20px;
    max-width: 790px;
  }
  input {
    border: none;
    width: 100%;
    height: 100%;
  }

  .input-wrapper {
    width: 100%;
    display: flex;
    position: relative;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid black;
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }
  .main-content {
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    margin: 0 auto;
  }

  .btn-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    text-align:rightl
    width: 790px;
    margin-top: 20px;
  }

  .post {
    border-radius: 0px;
    display: flex;
    width: 1080px;
    gap: 14px;
    flex-wrap: wrap;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default PostPage;
