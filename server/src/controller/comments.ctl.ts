import {
  BAD_REQUEST_COMMENT,
  INTERNAL_SERVER_ERROR,
  OK_DELETE_COMMENT,
  OK_UPDATE_COMMENT,
  OK_UPLOAD_COMMENT,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import CommentsService from "@/service/comments.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const postAllCommentsList = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const commentsResult = await CommentsService.reqPostCommentsList(postId);
    if (!commentsResult.success) {
      res.status(StatusCodes.OK).json([]);
    } else {
      res.status(StatusCodes.OK).json(commentsResult.data);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR });
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
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }

    if (err.message === BAD_REQUEST_COMMENT) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_COMMENT });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const user = req.user;
  const commentId = parseInt(req.params.id);
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

    if (err.message === BAD_REQUEST_COMMENT) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_COMMENT });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR });
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

    if (err.message === BAD_REQUEST_COMMENT) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_COMMENT });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR });
  }
};

const CommentsController = { postAllCommentsList, addComment, updateComment, deleteComment };
export default CommentsController;
