import { AppDataSource } from "@/config/ormSetting";
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
} from "@/constants/message";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Posts } from "@/models/posts.model";
import {
  PlaceLikesListResult,
  alreadyLikePlaceCheck,
  alreadyLikePostCheck,
  placeLikeRequestResult,
  placeUnlikeRequestResult,
  postLikeListRequest,
  postLikeRequestResult,
  postUnlikeRequestResult,
} from "@/repository/likes.repo";
import { iListMapData } from "@/types/likes.types";
import { setDate } from "@/utils/common";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getPlaceLikesList = async (req: Request, res: Response) => {
  const userId = 1;
  // const userId = req.user.id;
  try {
    const listResult = await PlaceLikesListResult(userId);
    if (!listResult || listResult.length === 0) throw new Error("does not exist Like Place");
    const responsePlaceLikesList = listResult?.map((place) => {
      const locationSplit = place.location.split(",");
      return {
        id: place.id,
        placeName: place.name,
        address: place.address,
        location: {
          lat: locationSplit[0].trim(),
          lng: locationSplit[1].trim(),
        },
        placeImg: place.img,
      };
    });
    res.status(StatusCodes.OK).json(responsePlaceLikesList);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "does not exist Like Place")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_PLACES_LIST });
    }
  }
};

export const placeLikeRequest = async (req: Request, res: Response) => {
  const userId = 1;
  // const userId = req.user.id;
  const placeId = req.params.id;
  try {
    const checkPlace = await alreadyLikePlaceCheck(userId, placeId);
    console.log(checkPlace);
    if (!checkPlace) throw new Error("exist place");
    const requestResult = await placeLikeRequestResult(userId, placeId);
    if (!requestResult) throw new Error("bad request");
    res.status(StatusCodes.OK).json({ message: OK_LIKE_PLACE });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request")
        return res.status(StatusCodes.NOT_FOUND).json({ message: BAD_REQUEST_LIKE_PLACE });
      if (err.message === "exist place") return res.status(StatusCodes.CONFLICT).json({ message: ALREADY_LIKE_PLACES });
    }
  }
};

export const placeUnlikeRequest = async (req: Request, res: Response) => {
  const placeId = req.params.id;
  const userId = 1;
  // const userId = req.user.id;
  try {
    const requestResult = await placeUnlikeRequestResult(userId, placeId);
    if (!requestResult) throw new Error("failed");
    res.status(StatusCodes.OK).json({ message: OK_UNLIKE_PLACE });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "failed")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_LIKE_PLACE });
    }
  }
};
export const getLikesPostsList = async (req: Request, res: Response) => {
  // const userId = req.user.id;
  const userId = 1;

  try {
    const postLikeListResult = await postLikeListRequest(userId);
    if (postLikeListResult && postLikeListResult.length === 0) throw new Error("find not list");
    const result = postLikeListResult?.map((list: iListMapData) => {
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
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "find not list")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER_LIKES_POST });
    }
  }
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
