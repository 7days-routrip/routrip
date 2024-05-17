import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { httpClient } from "@/apis/https";
import { Post } from "@/models/post.model";
import { Button } from "@/components/common/Button";
import { showAlert } from "@/utils/showAlert";
import icons from "@/icons/icons";
import { theme } from "@/styles/theme";

const PostEditPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState(0);
  const nav = useNavigate();
  const { PinIcon, LikeIcon, CommentIcon } = icons;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await httpClient.get(`/posts/${postId}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.contents);
        setDate(response.data.date);
        setCost(response.data.cost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId !== undefined) {
      fetchPost();
    }
  }, [postId]);

  const handleSave = async () => {
    try {
      await httpClient.put(`/posts/${postId}`, { title, contents: content, date, cost });
      // showAlert("게시물이 수정되었습니다.", "success", () => {
      //   nav(`/post/${postId}`);
      // });
    } catch (error) {
      console.error("Error updating post:", error);
      alert("게시물 수정에 실패했습니다.");
    }
  };

  if (!post) {
    return null;
  }

  return (
    <PostEditPageStyle>
      <PinIcon />
      <span>
        {post.continent.name} ﹥ {post.country.name}
      </span>
      <h1>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </h1>
      <div className="info-container">
        <p color={theme.color.commentGray}>작성일 : {post.date}</p>
        <div className="btn-wrapper">
          <div>
            <LikeIcon /> {post.likesNum}
          </div>
          <div>
            <CommentIcon /> {post.commentsNum}
          </div>
          {post.author}
        </div>
      </div>
      <div className="trip-container">
        <p>
          <span>여행한 날짜</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </p>
        <p>
          <span>총 여행 경비</span>
          <input type="number" value={cost} onChange={(e) => setCost(parseInt(e.target.value, 10))} />
        </p>
      </div>
      <div className="place-container">
        <PinIcon /> DAY 1 - 장소1 • 장소2
        <br />
        <PinIcon /> DAY 2 - 장소1 • 장소2
      </div>
      <div className="plan">🗒️ 전체 일정 담아가기</div>
      <div className="content-container">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="btn-wrapper">
        <Button $size="medium" $scheme="primary" $radius="default" onClick={handleSave}>
          저장
        </Button>
        <Button $size="medium" $scheme="secondary" $radius="default" onClick={() => nav(-1)}>
          취소
        </Button>
      </div>
    </PostEditPageStyle>
  );
};

const PostEditPageStyle = styled.div`
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  input[type="text"],
  input[type="date"],
  input[type="number"],
  textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: ${({ theme }) => theme.fontSize.large};
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin-top: 10px;
  }

  textarea {
    min-height: 200px;
  }
`;

export default PostEditPage;
