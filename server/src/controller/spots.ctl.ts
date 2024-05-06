import { Repository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "@/config/ormSetting";
import { Places } from "@/models/places.model";
import express, { Request, Response, NextFunction } from "express";

const addToPlace = async (req: Request, res: Response, next: NextFunction) => {
  const place: Places = new Places();
  place.id = req.body.placeId;
  place.name = req.body.placeName;
  place.address = req.body.address;
  place.siteUrl = req.body.siteUrl;
  place.tel = req.body.tel;

  const locationStr: string = req.body.location.lat + ", " + req.body.location.lng;
  place.location = locationStr;

  let locationArr: string[] = req.body.openingHours;
  place.openingHours = locationArr.join(", ");

  // 이미지 추후 구현
  const placeRepository: Repository<Places> = AppDataSource.getRepository(Places);
  // todo: 구글 서버에 데이터 검증 부분 구현

  if (!place.id || !place.name || !place.location || !place.address) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 요청입니다.",
    });
  }

  const exists: boolean = await placeRepository.existsBy({ id: place.id });
  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 등록된 장소가 있습니다.\n해당 장소를 추가하시겠습니까?",
    });
  }

  const savedPlace: Places = await placeRepository.save(place);
  return res.status(StatusCodes.OK).json({
    message: "장소 등록이 완료 되었습니다.",
  });
};

const checkDuplicatePlaces = async (req: Request, res: Response, next: NextFunction) => {
  const placeRepository: Repository<Places> = AppDataSource.getRepository(Places);
  const placeId: string = req.params.id;

  const exists: boolean = await placeRepository.existsBy({ id: placeId });
  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 등록된 장소입니다.",
    });
  } else {
    return res.status(StatusCodes.OK).end();
  }
};
interface PlaceDetailDTO {
  id: string;
  placeName: string;
  location: location;
  address: string;
  siteUrl: string;
  tel: string;
  openingHours: string[];
}
interface location {
  lat: number;
  lng: number;
}

const getPlaceDetail = async (req: Request, res: Response, next: NextFunction) => {
  const placeRepository: Repository<Places> = AppDataSource.getRepository(Places);
  const placeId: string = req.params.id;

  if (!placeId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 요청입니다.",
    });
  }

  let foundPlace: Places | null = await placeRepository.findOneBy({ id: placeId });
  if (!foundPlace) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "장소 정보를 찾을 수 없습니다.",
    });
  }

  const locationStrArr: string[] = foundPlace["location"].split(", ");
  const location: location = {
    lat: parseFloat(locationStrArr[0]),
    lng: parseFloat(locationStrArr[1]),
  };

  const openingHoursArr: string[] = foundPlace["openingHours"].split(", ");

  let placeDetailDTO: PlaceDetailDTO = {
    id: foundPlace.id,
    placeName: foundPlace.name,
    location: location,
    address: foundPlace.address,
    siteUrl: foundPlace.siteUrl,
    tel: foundPlace.tel,
    openingHours: openingHoursArr,
  };

  return res.status(StatusCodes.OK).json(placeDetailDTO);
};

export { addToPlace, checkDuplicatePlaces, getPlaceDetail };
