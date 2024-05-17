import { PostComment } from "@/models/comment.model";
import styled from "styled-components";
import { DEFAULT_IMAGE } from "./ProfileCard";
import icons from "@/icons/icons";

interface Props {
  commentProps: PostComment;
  onDelete: () => void;
  onEdit: (updatedComment: string) => void;
}

const PostCommentCard = ({ commentProps, onDelete, onEdit }: Props) => {
  const { TrashIcon, EditIcon } = icons;
  const handleEdit = () => {
    const updatedComment = prompt("댓글을 수정하세요", commentProps.content);
    if (updatedComment) {
      onEdit(updatedComment);
    }
  };

  return (
    <CommentStyle>
      <div className="test">
        <div className="profile">
          <img src={`${commentProps.profileImg ? commentProps.profileImg : DEFAULT_IMAGE}`} alt="댓글창 프로필" />
        </div>

        <div className="comment-body">
          <div className="comment-text">
            <span>{commentProps.content}</span>
          </div>
          <div className="post-title">
            <span>{commentProps.postTitle}</span>
          </div>
        </div>
      </div>
      <div className="comment-date">
        <span>작성일: {commentProps.createdAt}</span>
        <div className="edit-panel">
          <div onClick={handleEdit} className="edit-btn">
            <EditIcon />
          </div>
          <div onClick={onDelete} className="edit-btn">
            <TrashIcon />
          </div>
        </div>
      </div>
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  min-width: 250px;
  padding: 0 1.5rem 0.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  a {
    color: ${({ theme }) => theme.color.black};
  }

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .profile > img {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    box-shadow: 1px 1px 1px 1px ${({ theme }) => theme.color.borderGray};
  }

  .test {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

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

  .comment-date {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .edit-panel {
    display: flex;
    gap: 0.5rem;
  }

  .edit-btn {
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  }
`;

export default PostCommentCard;
