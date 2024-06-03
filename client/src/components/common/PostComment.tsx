import { useState } from "react";
import { PostComment } from "@/models/comment.model";
import styled from "styled-components";
import { Button } from "./Button";
import icons from "@/icons/icons";
import { DEFAULT_IMAGE } from "@/constants/defaultImage";

interface Props {
  commentProps: PostComment;
  currentUser: string | null;
  onDelete: () => void;
  onEdit: (updatedComment: string) => void;
}

const PostCommentCard = ({ commentProps, currentUser, onDelete, onEdit }: Props) => {
  const { TrashIcon, EditIcon } = icons;
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(commentProps.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedComment);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedComment(commentProps.content);
  };

  return (
    <CommentStyle>
      <div className="comment-wrapper">
        <div className="comment-top">
          <div className="comment-profile">
            <img src={`${commentProps.profileImg ? commentProps.profileImg : DEFAULT_IMAGE}`} alt="댓글창 프로필" />

            <span>{commentProps.nickName}</span>
          </div>
          <div className="comment-right">
            <p>{commentProps.createdAt}</p>
            <div className="edit-panel">
              {isEditing ? (
                <>
                  <Button $size="small" $scheme="primary" $radius="default" onClick={handleSaveClick}>
                    저장
                  </Button>
                  <Button $size="small" $scheme="secondary" $radius="default" onClick={handleCancelClick}>
                    취소
                  </Button>
                </>
              ) : (
                currentUser === commentProps.nickName && (
                  <>
                    <div onClick={handleEditClick} className="edit-btn">
                      <EditIcon />
                    </div>
                    <div onClick={onDelete} className="edit-btn">
                      <TrashIcon />
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
        <div className="comment-btm">
          {isEditing ? (
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          ) : (
            <pre>{commentProps.content}</pre>
          )}
        </div>
      </div>
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  min-width: 250px;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.color.borderGray};

  p {
    font-size: 14px;
  }
  .comment-wrapper {
    display: flex;
    flex-flow: column;
  }

  .comment-top {
    display: flex;
    justify-content: space-between;

    .comment-profile {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      img {
        width: 2.5rem;
        height: 2.5rem;

        border: 1px solid ${({ theme }) => theme.color.borderGray};
        border-radius: 50%;
      }
      span {
        font-size: ${({ theme }) => theme.fontSize.normal};
      }
    }
    .comment-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  }

  .comment-btm {
    pre {
      font-weight: 400;
      font-size: ${({ theme }) => theme.fontSize.small};
      white-space: pre-wrap;
    }
  }

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
    color: ${({ theme }) => theme.color.black};
    > span {
      font-size: ${({ theme }) => theme.fontSize.small};
    }
  }

  .comment-content {
    > span {
      font-size: ${({ theme }) => theme.fontSize.small};
      font-weight: 400;
    }
  }

  .comment-date {
    position: absolute;
    right: 1.5rem;
    bottom: 0.6rem;
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
