import { NOT_FOUND_COMMENTS, OK_DELETE_COMMENT, OK_UPDATE_COMMENT, OK_UPLOAD_COMMENT, UNAUTHORIZED_NOT_LOGIN } from "@/constants/message";
import CommentsService from "@/service/comments.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const postAllCommentsList = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const commentsResult = await CommentsService.reqPostCommentsList(postId);
    if (!commentsResult.success) throw new Error(commentsResult.msg);
    res.status(StatusCodes.OK).json(commentsResult.data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "does not exist comments")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_COMMENTS });
    }
  }
};

const addComment = async (req: Request, res: Response) => {
  const user = req.user;
  const { postId, content } = req.body;
  try {
    if (!user?.isLoggedIn) throw new Error(UNAUTHORIZED_NOT_LOGIN);
    const result = await CommentsService.addComment(user.id as number, postId, content);
    if (!result) throw new Error("failed upload");
    res.status(StatusCodes.OK).json({
      message: OK_UPLOAD_COMMENT,
    });
  } catch (err: any) {
    if (err.message === UNAUTHORIZED_NOT_LOGIN) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const user = req.user;
  const commentId = parseInt(req.params.id);
  console.log(commentId)
  const { postId, content } = req.body;
  try {
    if (!user?.isLoggedIn) throw new Error(UNAUTHORIZED_NOT_LOGIN);
    const result = await CommentsService.updateComment(user.id as number, postId, content, commentId);
    if (!result) throw new Error("failed update");
    res.status(StatusCodes.OK).json({
      message: OK_UPDATE_COMMENT,
    });
  } catch (err: any) {
    if (err.message === UNAUTHORIZED_NOT_LOGIN) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const user = req.user;
  const commentId = parseInt(req.params.id);
  try {
    if (!user?.isLoggedIn) throw new Error(UNAUTHORIZED_NOT_LOGIN);
    const result = await CommentsService.deleteComment(user.id as number, commentId);
    if (!result) throw new Error("failed delete");
    res.status(StatusCodes.OK).json({
      message: OK_DELETE_COMMENT,
    });
  } catch (err: any) {
    if (err.message === UNAUTHORIZED_NOT_LOGIN) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const CommentsController = { postAllCommentsList, addComment, updateComment, deleteComment };
export default CommentsController;
