import { useParams } from "react-router-dom";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import icons from "@/icons/icons";
import Dropdown from "@/components/common/Dropdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

import { useEffect, useState } from "react";
import { Post } from "@/models/post.model";

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const { LikeIcon, CommentIcon, DotIcon, PinIcon } = icons;
  const [post, setPost] = useState<Post | null>(null);
  const [likeBtn, setLikeBtn] = useState("primary");

  const StyledLikeIcon = styled(LikeIcon)`
    fill: ${({ theme }) => theme.color.primary};
  `;

  const StyledCommentIcon = styled(CommentIcon)`
    fill: ${({ theme }) => theme.color.primary};
  `;

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`http://localhost:1234/api/posts/${postId}`);
      const data = await response.json();
      setPost(data);
    };
  }, [postId]);

  return post ? (
    <PostDetailPageStyle>
      <h1>{post.title}</h1>
      <div className="info-container">
        <p color={theme.color.commentGray}>작성일 :{post.date}</p>
        <div className="btn-wrapper">
          <div>
            <StyledLikeIcon />
            {post.likesNum}
          </div>
          <div>
            <StyledCommentIcon />
            {post.commentsNum}
          </div>
          {post.author}
          <Dropdown toggleIcon={<DotIcon />}>
            <ul>
              <Link to="/">수정</Link>
              <li>삭제</li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className="trip-container">
        <p>
          <span>여행한 날짜</span> {post.date}
        </p>
        <p>
          <span>총 여행 경비</span> 100000
        </p>
      </div>
      <div className="place-container">
        <PinIcon /> DAY 1 - 장소1 • 장소2
        <br></br>
        <PinIcon /> DAY 2 - 장소1 • 장소2
      </div>
      <div className="plan">🗒️ 전체 일정 담아가기</div>
      <div className="content-container">
        <p>여행 1일차 즐거웠습니다!</p>
      </div>
      <div className="btn-wrapper">
        <Button $size="medium" $scheme="primary" $radius="default">
          <LikeIcon /> {post.likesNum}
        </Button>
        <Button $size="medium" $scheme="secondary" $radius="default">
          목록
        </Button>
      </div>
      <div className="comment-container">댓글</div>
    </PostDetailPageStyle>
  ) : null;
};

const PostDetailPageStyle = styled.div`
  .info-container {
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    margin-top: -20px;
  }
  .btn-wrapper {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
  .trip-container {
    display: flex;
    justify-content: space-between;
  }
  span {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
  }
  .place-container {
    color: ${({ theme }) => theme.color.routeGray};
  }

  .plan,
  .content-container,
  .comment-container {
    border-bottom: 1px solid #e7e7e7;
  }
`;

export default PostDetailPage;
