import { NOT_FOUND_COMMENTS } from "@/constants/message";
import CommentsSevice from "@/service/comments.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const postAllCommentsList = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const commentsResult = await CommentsSevice.reqPostCommentsList(postId);
    if (!commentsResult.success) throw new Error(commentsResult.msg);
    res.status(StatusCodes.OK).json(commentsResult.data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "does not exist comments")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_COMMENTS });
    }
  }
};

const CommentsController = { postAllCommentsList };
export default CommentsController;
