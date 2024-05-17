import { Comment } from "@/models/comment.model";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props {
  commentProps: Comment;
  onDelete: () => void;
  onEdit: (updatedComment: string) => void;
}

const CommentCard = ({ commentProps, onDelete, onEdit }: Props) => {
  const handleEdit = () => {
    const updatedComment = prompt("댓글을 수정하세요", commentProps.content);
    if (updatedComment) {
      onEdit(updatedComment);
    }
  };

  return (
    <CommentStyle>
      <Link to={`/posts/${commentProps.postId}`}>
        <div className="comment-body">
          <div className="comment-text">
            <span>{commentProps.content}</span>
          </div>
          <div className="post-title">
            <span>{commentProps.postTitle}</span>
          </div>
        </div>
      </Link>
      <div className="comment-date">
        <span>작성일: {commentProps.createDate}</span>
        <div>
          <button onClick={handleEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      </div>
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  min-width: 370px;
  padding: 0 1.5rem 0.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  a {
    color: ${({ theme }) => theme.color.black};
  }

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .comment-body {
    width: 500px;
    display: flex;
    flex-direction: column;
  }

  .comment-text {
    font-weight: 600;
  }

  .post-title {
    color: ${({ theme }) => theme.color.commentGray};
  }
`;

export default CommentCard;
