import React, { useState } from "react";
import { PostComment } from "@/models/comment.model";
import styled from "styled-components";
import { Button } from "./Button";
import { DEFAULT_IMAGE } from "./ProfileCard";
import icons from "@/icons/icons";

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
      <div className="test">
        <div className="profile">
          <img src={`${commentProps.profileImg ? commentProps.profileImg : DEFAULT_IMAGE}`} alt="댓글창 프로필" />
        </div>

        <div className="comment-body">
          <div className="comment-text">
            <span>{commentProps.nickName}</span>
          </div>
          <div className="post-title">
            {isEditing ? (
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
              />
            ) : (
              <span>{commentProps.content}</span>
            )}
          </div>
        </div>
      </div>
      <div className="comment-date">
        <p>작성일: {commentProps.createdAt}</p>
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
    </CommentStyle>
  );
};

const CommentStyle = styled.div`
  width: 100%;
  min-width: 250px;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  a {
    color: ${({ theme }) => theme.color.black};
  }
  p {
    font-size: 14px;
  }
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

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
    color: ${({ theme }) => theme.color.commentGray};
  }

  .post-title {
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
