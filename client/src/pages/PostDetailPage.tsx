import { useParams } from "react-router-dom";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import icons from "@/icons/icons";
import Dropdown from "@/components/common/Dropdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { httpClient } from "@/apis/https";
import { useEffect, useState } from "react";
import { Post } from "@/models/post.model";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { useNavigate } from "react-router-dom";

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const { LikeIcon, CommentIcon, DotIcon, PinIcon } = icons;
  const [post, setPost] = useState<Post | null>(null);
  const nav = useNavigate();

  const StyledLikeIcon = styled(LikeIcon)`
    fill: ${({ theme }) => theme.color.primary};
  `;

  const StyledCommentIcon = styled(CommentIcon)`
    fill: ${({ theme }) => theme.color.primary};
  `;

useEffect(() => {
  const fetchPost = async () => {
    try {
      console.log(`ID: ${postId}`);
      const response = await httpClient.get(`/posts/${postId}`);
      console.log("Fetched data:", response.data);
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  if (postId !== undefined) {
    fetchPost();
  }
}, [postId]);

    if (postId !== undefined) {
      fetchPost();
    }
  }, [postId]);

  const handleDelete = async () => {
    try {
      await httpClient.delete(`/posts/${postId}`);
      showAlert("게시물이 삭제되었습니다.", "error", () => {
        if (post?.country.id === 1) {
          nav("/post?area=home");
        } else {
          nav("/post?area=abroad");
        }
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  const confirmDelete = () => {
    showConfirm("정말 삭제하시겠습니까?", handleDelete);
  };

  if (!post) {
    return null;
  }

  return (
    <PostDetailPageStyle>
      <PinIcon />
      <span>
        {post.continent.name} ﹥ {post.country.name}
      </span>
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
              <li onClick={confirmDelete}>삭제</li>
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
        <br />
        <PinIcon /> DAY 2 - 장소1 • 장소2
      </div>
      <div className="plan">🗒️ 전체 일정 담아가기</div>
      <div className="content-container" dangerouslySetInnerHTML={{ __html: post.conetents }} />
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
  );
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
  .content-container img {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  }
`;

export default PostDetailPage;
