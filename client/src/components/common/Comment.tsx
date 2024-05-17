import { Comment } from "@/models/comment.model";
import { showAlert } from "@/utils/showAlert";
import { Link } from "react-router-dom";
import styled from "styled-components";
interface Props {
  commentProps: Comment;
}

const CommentCard = ({ commentProps }: Props) => {
  return (
    <CommentStyle>
      <Link
        to={commentProps.postId === 0 ? `` : `/post/${commentProps.postId}`}
        onClick={() => {
          commentProps.postId === 0 && showAlert("삭제된 게시판입니다.", "logo");
        }}
      >
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
        <span>작성일: {commentProps.createdAt}</span>
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
