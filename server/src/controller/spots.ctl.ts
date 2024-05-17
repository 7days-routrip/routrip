import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SpotsService } from "@/service/spots.service";
import { PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import { Location } from "aws-sdk";

const addToPlace = async (req: Request, res: Response, next: NextFunction) => {
  const { id, placeName, address, siteUrl, tel, location, openingHours, placeImg } = req.body;

  try {
    await SpotsService.register(id, placeName, address, siteUrl, tel, location, openingHours, placeImg);
    return res.status(StatusCodes.OK).json({
      message: "장소 등록이 완료 되었습니다.",
    });
  } catch (error: any) {
    if (error.message === "이미 등록된 장소가 있습니다.\n해당 장소를 추가하시겠습니까?") {
      return res.status(StatusCodes.CONFLICT).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
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
        message: "이미 등록된 장소입니다.",
      });
    } else {
      return res.status(StatusCodes.OK).end();
    }
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
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
    if (error.message === "장소 정보를 찾을 수 없습니다.") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
};

const searchPlace = async (req: Request, res: Response, next: NextFunction) => {
  const keyword: string = req.query.keyword as string;
  if (!keyword)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "검색어를 입력해주세요.",
    });

  const zoom: number = req.query.zoom ? parseInt(req.query.zoom as string) : 6;
  const lat: number = req.query.lat ? parseFloat(req.query.lat as string) : 38;
  const lng: number = req.query.lng ? parseFloat(req.query.lng as string) : 128;

  try {
    const searchedPlaces: SearchPlaceDTO[] = await SpotsService.search(keyword, zoom, lat, lng);
    return res.status(StatusCodes.OK).json(searchedPlaces);
  } catch (error: any) {
    if (error.message === "등록된 장소가 없습니다.\n신규 장소를 등록해 주세요.") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
};

export { addToPlace, checkDuplicatePlaces, getPlaceDetail, searchPlace };
