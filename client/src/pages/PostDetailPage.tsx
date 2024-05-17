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
import { Comment } from "@/models/comment.model";
import CommentCard from "@/components/common/Comment";

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const { LikeIcon, CommentIcon, DotIcon, PinIcon } = icons;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
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
        const response = await httpClient.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await httpClient.get(`/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (postId !== undefined) {
      fetchPost();
      fetchComments();
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await httpClient.post("/comments", { postId, content: newComment });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await httpClient.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentEdit = async (commentId: number, updatedComment: string) => {
    try {
      await httpClient.put(`/comments/${commentId}`, { postId, content: updatedComment });
      setComments(
        comments.map((comment) => (comment.id === commentId ? { ...comment, content: updatedComment } : comment)),
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
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
        <p color={theme.color.commentGray}>작성일 :{post.createAt}</p>
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
            <DropdownMenu>
              <DropdownItem>
                <StyledLink to={`/post/${postId}/edit`}>수정</StyledLink>
              </DropdownItem>
              <DropdownItem onClick={confirmDelete}>삭제</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="trip-container">
        <p>
          <span>여행한 날짜</span> {post.date}
        </p>
      </div>
      <div className="place-container">
        <PinIcon /> DAY 1 - 장소1 • 장소2
        <br />
        <PinIcon /> DAY 2 - 장소1 • 장소2
      </div>
      <div className="plan">🗒️ 전체 일정 담아가기</div>
      <div className="content-container" dangerouslySetInnerHTML={{ __html: post.contents }} />
      <div className="btn-wrapper">
        <Button $size="medium" $scheme="primary" $radius="default">
          <LikeIcon /> {post.likesNum}
        </Button>
        <Button $size="medium" $scheme="secondary" $radius="default">
          목록
        </Button>
      </div>
      <div className="comment-container">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해주세요."
            rows={3}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <div className="btn-submit">
            <Button type="submit" $size="medium" $scheme="primary" $radius="default">
              등록
            </Button>
          </div>
        </form>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            commentProps={comment}
            onDelete={() => handleCommentDelete(comment.id)}
            onEdit={(updatedComment) => handleCommentEdit(comment.id, updatedComment)}
          />
        ))}
      </div>
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
    margin-top: 10px;
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
  .btn-submit {
    text-align: right;
  }

  .plan,
  .content-container,
  .comment-container {
    border-bottom: 1px solid #e7e7e7;
  }
  .content-container .image {
    width: unset;
    height: unset;
  }
  .content-container img {
    width: 100%;
    height: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DropdownMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
`;

const DropdownItem = styled.li`
  margin: 5px 0;
  font-size: 0.8rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;
  width: 100px;
  text-align: center;
`;

export default PostDetailPage;
