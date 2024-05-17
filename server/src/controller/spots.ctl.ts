import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SpotsService } from "@/service/spots.service";
import { PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import {
  OK_UPLOAD_PLACE,
  CONFLICT_PLACE_ADD,
  CONFLICT_PLACE,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_PLACE,
  BAD_REQUEST_SEARCH_PLACE,
  NOT_FOUND_PLACE_ADD,
  INTERNAL_SERVER_ERROR_REQUEST_IMAGE,
  INTERNAL_SERVER_ERROR_SAVE_IMAGE,
  NOT_FOUND_USER,
} from "@/constants/message";

const addToPlace = async (req: Request, res: Response, next: NextFunction) => {
  const { id, placeName, address, siteUrl, tel, location, openingHours, placeImg } = req.body;

  try {
    await SpotsService.register(id, placeName, address, siteUrl, tel, location, openingHours, placeImg);
    return res.status(StatusCodes.OK).json({
      message: OK_UPLOAD_PLACE,
    });
  } catch (error: any) {
    if (error.message === CONFLICT_PLACE_ADD) {
      return res.status(StatusCodes.CONFLICT).json({
        message: error.message,
      });
    } else if (error.message === INTERNAL_SERVER_ERROR_REQUEST_IMAGE) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR_REQUEST_IMAGE,
      });
    } else if (error.message === INTERNAL_SERVER_ERROR_SAVE_IMAGE) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR_SAVE_IMAGE,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const checkDuplicatePlaces = async (req: Request, res: Response, next: NextFunction) => {
  const placeId: string = req.params.id;

  try {
    const exists: boolean = await SpotsService.checkDuplicate(placeId);
    if (exists) {
      return res.status(StatusCodes.CONFLICT).json({
        message: CONFLICT_PLACE,
      });
    } else {
      return res.status(StatusCodes.OK).end();
    }
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: INTERNAL_SERVER_ERROR,
    });
  }
};

const getPlaceDetail = async (req: Request, res: Response, next: NextFunction) => {
  const placeId: string = req.params.id;
  const user: any = req.user;

  try {
    const foundPlace: PlaceDetailDTO = await SpotsService.getDetail(placeId, user);
    return res.status(StatusCodes.OK).json(foundPlace);
  } catch (error: any) {
    if (error.message === NOT_FOUND_PLACE) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else if (error.message === NOT_FOUND_USER) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const searchPlace = async (req: Request, res: Response, next: NextFunction) => {
  const keyword: string = req.query.keyword as string;
  if (!keyword)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: BAD_REQUEST_SEARCH_PLACE,
    });

  const zoom: number = req.query.zoom ? parseInt(req.query.zoom as string) : 6;
  const lat: number = req.query.lat ? parseFloat(req.query.lat as string) : 38;
  const lng: number = req.query.lng ? parseFloat(req.query.lng as string) : 128;

  try {
    const searchedPlaces: SearchPlaceDTO[] = await SpotsService.search(keyword, zoom, lat, lng);
    return res.status(StatusCodes.OK).json(searchedPlaces);
  } catch (error: any) {
    if (error.message === NOT_FOUND_PLACE_ADD) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

export { addToPlace, checkDuplicatePlaces, getPlaceDetail, searchPlace };
