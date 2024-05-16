import { NOT_FOUND_COMMENTS, UNAUTHORIZED_NOT_LOGIN } from "@/constants/message";
import CommentsSevice from "@/service/comments.service";
import MypagesService from "@/service/mypages.service";
import PostsService from "@/service/posts.service";
import JourneysService from "@/service/journeys.service";
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
      console.log(userId);
      const pages = parseInt(req.query?.pages as string);
      const listResult = await PostsService.reqAllPostsList(pages, undefined, userId, undefined, "list");
      const pageResult = await PostsService.reqAllPostsList(pages, undefined, userId, undefined);
      if (listResult.success === false || pageResult.success === false) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json({
        posts: listResult.data,
        pagination: {
          page: pages,
          totalPosts: pageResult.count,
        },
      });
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
const getJourneysList = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    if (!user?.isLoggedIn) throw new Error("사용자 정보가 없습니다.\n로그인이 필요한 서비스입니다.");
    const journeys = await JourneysService.getJourneysList(user.id as number);

    res.status(200).json(journeys);
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
};

const MypagesController = { commentUserAllList, postUserAllList, userTotalData, getJourneysList };
export default MypagesController;
