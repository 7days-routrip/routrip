import { Comment } from "@/models/comment.model";
import styled from "styled-components";
interface Props {
  CommentProps: Comment;
}

const CommentCard = ({ CommentProps }: Props) => {
  return (
    <CommentStyle>
      <span>{CommentProps.content}</span>
      <span>{CommentProps.postId}</span>
      <span>작성일</span>
    </CommentStyle>
  );
};

const CommentStyle = styled.div``;

export default CommentCard;
