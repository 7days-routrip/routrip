import { AppDataSource } from "@/config/ormSetting";
import {
  CONFLICT_LIKE_POST,
  NOT_FOUND_LIKE,
  NOT_FOUND_POST,
  NOT_FOUND_USER_LIKES_POST,
  OK_LIKE_POST,
  OK_UNLIKE_POST,
} from "@/constants/message";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import {
  alreadyLikePostCheck,
  postLikeListRequest,
  postLikeRequestResult,
  postUnlikeRequestResult,
} from "@/repository/likes.repo";
import { iListMapData } from "@/types/likes.types";
import { setDate } from "@/utils/common";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getLikesPostsList = async (req: Request, res: Response) => {
  const postsRepo = AppDataSource.getRepository(Posts);
  // const userId = req.user.id;
  const userId = 1;

  const postLikeListResult = await postLikeListRequest(postsRepo, userId);
  if (postLikeListResult.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER_LIKES_POST });
  }
  const result = postLikeListResult.map((list: iListMapData) => {
    const startDate = setDate(list.startDate);
    const endDate = setDate(list.endDate);
    const data = {
      id: list.id,
      author: list.nickName,
      profileImg: list.profileImg,
      title: list.title,
      date: startDate + "~" + endDate,
      continent: list.continent,
      country: list.country,
      postsImg: list.postsImg,
      commentsNum: list.commentsNum,
      likesNum: list.likesNum,
    };
    return data;
  });
  res.status(StatusCodes.OK).json(result);
};
export const postLikeRequest = async (req: Request, res: Response) => {
  try {
    const likesRepo = AppDataSource.getRepository(Likes);
    const postId = parseInt(req.params.id);
    // const userId = req.user?.id;
    const userId = 8;
    const checkPost = await alreadyLikePostCheck(likesRepo, userId, postId);
    if (!checkPost) throw new Error("Like does not exist");
    const requsetResult = await postLikeRequestResult(likesRepo, userId, postId);
    if (!requsetResult) throw new Error("post isn't exist");
    res.status(StatusCodes.OK).json({ message: OK_LIKE_POST });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Like does not exist.")
        return res.status(StatusCodes.CONFLICT).json({ message: CONFLICT_LIKE_POST });
      if (err.message === "post isn't exist")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: NOT_FOUND_POST });
    }
  }
};
export const postUnlikeRequest = async (req: Request, res: Response) => {
  try {
    const likesRepo = AppDataSource.getRepository(Likes);
    const postId = parseInt(req.params.id);
    // const userId = req.user?.id;
    const userId = 1;
    const checkPost = await alreadyLikePostCheck(likesRepo, userId, postId);
    if (checkPost) throw new Error("Like does not exist");
    await postUnlikeRequestResult(likesRepo, userId, postId);
    res.status(StatusCodes.OK).json({ message: OK_UNLIKE_POST });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Like does not exist")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: NOT_FOUND_LIKE });
    }
  }
};
