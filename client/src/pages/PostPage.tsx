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

  const clickListBtn = () => setView("list");
  const clickGridBtn = () => setView("grid");

  const sortedPosts =
    sortOrder === "recent"
      ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [...posts].sort((a, b) => parseInt(b.likesNum, 10) - parseInt(a.likesNum, 10));

  return (
    <PostPageStyle view={view}>
      <div className="main-content">
        <div className="control-wrapper">
          <div className="btn-wrapper">
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="recent">최신순</option>
              <option value="likes">인기순</option>
            </select>
            <div className="input-wrapper">
              <input type="search" placeholder="검색어를 입력하세요." />
              <SearchIcon />
            </div>
          </div>
          <div className="view-toggle">
            <GridIcon width="24px" height="24px" onClick={clickGridBtn} />
            <ListIcon width="24px" height="24px" onClick={clickListBtn} />
          </div>
        </div>
      </div>

      <div className="post">
        {sortedPosts.map((post) => (
          <StyledLink key={post.id} to={`/post/${post.id}`}>
            <PostCard key={post.id} PostProps={post} view={view} />
          </StyledLink>
        ))}
      </div>
    </PostPageStyle>
  );
};

const PostPageStyle = styled.div<PostPageStyleProps>`
  .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    border-bottom: 1px solid #e7e7e7;
    padding: 0px 0px 20px 0px;
    margin: 10px auto 20px auto;
  }

  .control-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 960px;
    gap: 20px;
  }

  select {
    padding: 8px;
  }

  .btn-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid black;
    width: 360px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }

  input {
    border: none;
    flex-grow: 1;
    padding: 0 8px;
    font-size: 16px;
    outline: none;
  }

  .view-toggle {
    display: flex;
    gap: 10px;
  }

  .post {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
    width: 1080px; // Adjust as needed
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default PostPage;
