import {
  NOT_FOUND_COMMENTS,
  NOT_FOUND_PLACES_LIST,
  NOT_FOUND_POSTS,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import CommentsSevice from "@/service/comments.service";
import MypagesService from "@/service/mypages.service";
import PostsService from "@/service/posts.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const commentUserAllList = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const pages = parseInt(req.query.pages as string);
      const userId = req.user.id as number;
      const listResult = await CommentsSevice.reqCommentsList(userId, pages);
      if (!listResult.success) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json({
        comments: listResult.data,
        pagination: {
          page: pages,
          totalItems: listResult.count,
        },
      });
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
      const pages = parseInt(req.query?.pages as string);
      const listResult = await PostsService.reqAllPostsList(pages, undefined, userId, undefined, "list");
      if (listResult.success === false) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json({
        posts: listResult.data,
        pagination: {
          page: pages,
          totalItems: listResult.count,
        },
      });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS });
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
    const pages = parseInt(req.query.pages as string);
    if (!user?.isLoggedIn) throw new Error("사용자 정보가 없습니다.\n로그인이 필요한 서비스입니다.");
    const userId = req.user?.id as number;
    const listResult = await MypagesService.getJourneysList(userId, pages);
    if (!listResult.success) throw new Error(listResult.msg);

    res.status(StatusCodes.OK).json({
      schedules: listResult.data,
      pagination: {
        page: pages,
        totalItems: listResult.count,
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
};

const getPlaceAllList = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user?.id as number;
      const pages = parseInt(req.query.pages as string);
      const listResult = await MypagesService.getPlaces(userId, pages);
      if (!listResult.success) throw new Error(listResult.msg);

      res.status(StatusCodes.OK).json({
        places: listResult.data,
        pagination: {
          page: pages,
          totalItems: listResult.count,
        },
      });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "does not exist Like Place")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_PLACES_LIST });
    }
  }
};

const MypagesController = { commentUserAllList, postUserAllList, userTotalData, getJourneysList, getPlaceAllList };
export default MypagesController;
