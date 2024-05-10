import { NOT_FOUND_COMMENTS, UNAUTHORIZED_NOT_LOGIN } from "@/constants/message";
import CommentsSevice from "@/service/comments.service";
import MypagesService from "@/service/mypages.service";
import PostsService from "@/service/posts.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const commentUserAllList = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const listResult = await CommentsSevice.reqCommentsList(userId);
      if (!listResult.success) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json(listResult.data);
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "does not exist comments")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_COMMENTS });
    }
  }
};
const postUserAllList = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const sort = req.query?.sort as string;
      const pages = parseInt(req.query?.pages as string);
      const listResult = await PostsService.reqPostsList(pages, undefined, userId, sort, undefined, "list");
      if (!listResult.success) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json(listResult.data);
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const userTotalData = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const allDataResult = await MypagesService.getAllUserData(userId);
      res.status(StatusCodes.OK).json(allDataResult);
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const MypagesController = { commentUserAllList, postUserAllList, userTotalData };
export default MypagesController;
