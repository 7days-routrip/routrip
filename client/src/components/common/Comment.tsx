import { Comment } from "@/models/comment.model";
import { Link } from "react-router-dom";
import styled from "styled-components";
interface Props {
  CommentProps: Comment;
}

const CommentCard = ({ CommentProps }: Props) => {
  return (
    <CommentStyle>
      <Link to={`/posts/${CommentProps.postId}`}>
        <div className="comment-body">
          <div className="comment-text">
            <span>{CommentProps.content}</span>
          </div>
          <div className="post-title">
            <span>{CommentProps.postTitle}</span>
          </div>
        </div>
      </Link>
      <div className="comment-date">
        <span>작성일: {CommentProps.createDate}</span>
      </div>
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  padding: 0 1.5rem 0.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  a {
    color: ${({ theme }) => theme.color.black};
  }

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .omment-body {
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
