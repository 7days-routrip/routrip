import { AppDataSource } from "@/config/ormSetting";
import {
  ALREADY_LIKE_PLACES,
  BAD_REQUEST_LIKE_PLACE,
  NOT_FOUND_PLACES_LIST,
  OK_LIKE_PLACE,
  OK_UNLIKE_PLACE,
} from "@/constants/message";
import { Picks } from "@/models/picks.model";
import {
  PlaceLikesListResult,
  alreadyLikePlaceCheck,
  placeLikeRequestResult,
  placeUnlikeRequestResult,
} from "@/repository/likes.repo";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
export const getPlaceLikesList = async (req: Request, res: Response) => {
  const picksRepo = AppDataSource.getRepository(Picks);
  const userId = 1;
  // const userId = req.user.id;

  const listResult = await PlaceLikesListResult(picksRepo, userId);
  if (!listResult || listResult.length === 0)
    return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_PLACES_LIST });
  res.status(StatusCodes.OK).json(listResult);
};

export const placeLikeRequest = async (req: Request, res: Response) => {
  const userId = 1;
  // const userId = req.user.id;
  const placeId = parseInt(req.params.id);
  const picksRepo = AppDataSource.getRepository(Picks);

  const checkPlace = await alreadyLikePlaceCheck(picksRepo, userId, placeId);
  if (checkPlace) {
    return res.status(StatusCodes.CONFLICT).json({ message: ALREADY_LIKE_PLACES });
  }

  const requestResult = await placeLikeRequestResult(picksRepo, userId, placeId);
  if (!requestResult) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_LIKE_PLACE });
  }
  res.status(StatusCodes.OK).json({ message: OK_LIKE_PLACE });
};

export const placeUnlikeRequest = async (req: Request, res: Response) => {
  const picksRepo = AppDataSource.getRepository(Picks);
  const placeId = parseInt(req.params.id);
  const userId = 1;
  // const userId = req.user.id;

  const requestResult = await placeUnlikeRequestResult(picksRepo, userId, placeId);

  if (requestResult?.affected === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_LIKE_PLACE });
  }
  res.status(StatusCodes.OK).json({ message: OK_UNLIKE_PLACE });
};
