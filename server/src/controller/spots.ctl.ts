import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SpotsService } from "@/service/spots.service";
import { PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";

const addToPlace = async (req: Request, res: Response, next: NextFunction) => {
  const { id, placeName, address, siteUrl, tel, location, openingHours } = req.body;
  const result: boolean = await SpotsService.register(id, placeName, address, siteUrl, tel, location, openingHours);

  if (result) {
    return res.status(StatusCodes.OK).json({
      message: "장소 등록이 완료 되었습니다.",
    });
  } else {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 등록된 장소가 있습니다.\n해당 장소를 추가하시겠습니까?",
    });
  }
};

const checkDuplicatePlaces = async (req: Request, res: Response, next: NextFunction) => {
  const placeId: string = req.params.id;

  const exists: boolean = await SpotsService.checkDuplicate(placeId);

  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 등록된 장소입니다.",
    });
  } else {
    return res.status(StatusCodes.OK).end();
  }
};

const getPlaceDetail = async (req: Request, res: Response, next: NextFunction) => {
  const placeId: string = req.params.id;

  let foundPlace: PlaceDetailDTO | boolean = await SpotsService.getDetail(placeId);

  if (!foundPlace) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "장소 정보를 찾을 수 없습니다.",
    });
  }

  return res.status(StatusCodes.OK).json(foundPlace);
};

const searchPlace = async (req: Request, res: Response, next: NextFunction) => {
  const keyword: string | undefined = req.query.keyword as string | undefined;

  if (!keyword) return res.status(StatusCodes.BAD_REQUEST).end();

  const searchedPlaces: boolean | SearchPlaceDTO[] = await SpotsService.search(keyword);

  if (!searchedPlaces) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "등록된 장소가 없습니다.\n신규 장소를 등록해 주세요.",
    });
  }
  return res.status(StatusCodes.OK).json(searchedPlaces);
};

export { addToPlace, checkDuplicatePlaces, getPlaceDetail, searchPlace };
