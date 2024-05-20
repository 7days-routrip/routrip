import { Comment } from "@/models/comment.model";
import { showAlert } from "@/utils/showAlert";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Props {
  commentProps: Comment;
}

const CommentCard = ({ commentProps }: Props) => {
  const navigate = useNavigate();
  const navHandler = () => {
    if (commentProps.postId === undefined) {
      showAlert("삭제된 게시판입니다.", "logo");
      return;
    } else {
      navigate(`/post/${commentProps.postId}`);
    }
  };
  return (
    <CommentStyle>
      <div className="comment-body" onClick={navHandler}>
        <div className="comment-text">
          <span>{commentProps.content}</span>
        </div>
        <div className="post-title">
          <span>{commentProps.postTitle}</span>
        </div>
      </div>

      <div className="comment-date">
        <span>{commentProps.createdAt}</span>
      </div>
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  min-width: 370px;
  padding: 0 1.5rem 0.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &:last-child {
    border-bottom: unset;
  }

  .comment-body {
    width: 500px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .comment-text {
    font-weight: 600;
  }

  .post-title {
    color: ${({ theme }) => theme.color.commentGray};
  }

  a {
    color: ${({ theme }) => theme.color.black};
  }

  .comment-date span {
    color: ${({ theme }) => theme.color.commentGray};
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }
`;

export default CommentCard;
