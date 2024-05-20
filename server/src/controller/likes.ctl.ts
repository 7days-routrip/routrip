import {
  ALREADY_LIKE_PLACES,
  BAD_REQUEST_LIKE_PLACE,
  CONFLICT_LIKE_POST,
  NOT_FOUND_LIKE,
  NOT_FOUND_PLACES_LIST,
  NOT_FOUND_POST,
  NOT_FOUND_USER_LIKES_POST,
  OK_LIKE_PLACE,
  OK_LIKE_POST,
  OK_UNLIKE_PLACE,
  OK_UNLIKE_POST,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import LikesService from "@/service/likes.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const likesPostAllData = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const pages = parseInt(req.query.pages as string);
      const userId = req.user.id as number;
      const listResult = await LikesService.reqLikesList(userId, pages);
      if (!listResult?.success) throw new Error(listResult?.msg);
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
      if (err.message === "find not list")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER_LIKES_POST });
    }
  }
};

const postLikeRequest = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const postId = parseInt(req.params.id);
      const userId = req.user?.id as number;

      const checkResult = await LikesService.existDataCheck("likes", userId, postId);
      if (checkResult?.success) throw new Error("it already liked exist");

      const reqResult = await LikesService.reqLikesInsertData(userId, postId);
      if (!reqResult.success) throw new Error("Invalid request");
      res.status(StatusCodes.OK).json({ message: OK_LIKE_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "it already liked exist")
        return res.status(StatusCodes.CONFLICT).json({ message: CONFLICT_LIKE_POST });
      if (err.message === "Invalid request")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: NOT_FOUND_POST });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};

const postUnlikeRequest = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const postId = parseInt(req.params.id);
      const userId = req.user.id as number;

      const checkResult = await LikesService.existDataCheck("likes", userId, postId);
      if (!checkResult?.success) throw new Error("Like does not exist");

      const reqResult = await LikesService.reqLikesDeleteData(userId, postId);
      if (!reqResult.success) throw new Error("Invalid request");
      res.status(StatusCodes.OK).json({ message: OK_UNLIKE_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Like does not exist")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: NOT_FOUND_LIKE });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};

const likesPlaceAllData = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const pages = parseInt(req.query.pages as string);
      const userId = req.user.id as number;
      const listResult = await LikesService.reqPicksList(userId);
      if (!listResult.success) throw new Error(listResult.msg);
      res.status(StatusCodes.OK).json(listResult.data);
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

const placeLikeRequest = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const placeId = req.params.id;
      const userId = req.user.id as number;

      const checkResult = await LikesService.existDataCheck("picks", userId, placeId);
      if (checkResult?.success) throw new Error("exist place");
      const reqResult = await LikesService.reqPicksInsertData(userId, placeId);
      if (!reqResult.success) throw new Error("bad request");
      res.status(StatusCodes.OK).json({ message: OK_LIKE_PLACE });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request")
        return res.status(StatusCodes.NOT_FOUND).json({ message: BAD_REQUEST_LIKE_PLACE });
      if (err.message === "exist place") return res.status(StatusCodes.CONFLICT).json({ message: ALREADY_LIKE_PLACES });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const placeUnlikeRequest = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const placeId = req.params.id;
      const userId = req.user.id as number;
      const reqResult = await LikesService.reqPicksDeleteData(userId, placeId);
      if (!reqResult.success) throw new Error(reqResult.msg);
      res.status(StatusCodes.OK).json({ message: OK_UNLIKE_PLACE });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "failed")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_LIKE_PLACE });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};

const LikesController = {
  likesPlaceAllData,
  placeLikeRequest,
  placeUnlikeRequest,
  likesPostAllData,
  postLikeRequest,
  postUnlikeRequest,
};
export default LikesController;
