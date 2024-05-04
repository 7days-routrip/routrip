import styled from "styled-components";
import icons from "@/icons/icons";

import PostCard from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useState } from "react";
import { ViewMode } from "@/components/common/postCard";

const posts: Post[] = [
  {
    id: 1,
    title: "오션뷰를 보고 싶다면? 여기 !!",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "200",
    postsImg: "../../public/assets/images/logo-footer.png",
  },
  {
    id: 2,
    title: "오션뷰를 보고 싶다면? 여기!",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "200",
    postsImg: "../../public/assets/images/logo-footer.png",
  },
  {
    id: 3,
    title: "오션뷰를 보고 싶다면? 여기!",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "200",
    postsImg: "../../public/assets/images/logo-footer.png",
  },
  {
    id: 4,
    title: "오션뷰를 보고 싶다면? 여기!",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "200",
    postsImg: "../../public/assets/images/logo-footer.png",
  },
  {
    id: 4,
    title: "오션뷰를 보고 싶다면? 여기!",
    date: "2024.03.12 ~ 2024.03.18",
    author: "여행조아",
    userProfile: "../../public/assets/images/logo-profile.png",
    continental: "Asia",
    country: "Japan",
    commentsNum: "12",
    likesNum: "200",
    postsImg: "../../public/assets/images/logo-footer.png",
  },
];

const PostPage = () => {
  const { SearchIcon, GridIcon, ListIcon } = icons;

  const [view, setView] = useState<ViewMode>("grid");

  const clickListBtn = () => {
    setView("list");
  };

  const clickGridBtn = () => {
    setView("grid");
  };

  return (
    <PostPageStyle>
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
      <div className="btn-wrapper">
        <select>
          <option value="">최신순</option>
          <option value="">인기순</option>
        </select>

        <GridIcon width="50px" height={"50px"} onClick={clickGridBtn} />
        <ListIcon onClick={clickListBtn} />
      </div>
      <hr></hr>
      <div className="post">
        {posts.map((post) => (
          <PostCard key={post.id} PostProps={post} view={view} />
        ))}
      </div>
    </PostPageStyle>
  );
};
const PostPageStyle = styled.div`
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

  .btn-wrapper {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 20px;
  }

  .post {
    border-radius: 0px;
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }
`;

export default PostPage;
