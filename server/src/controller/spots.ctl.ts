import { Repository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "@/config/ormSetting";
import { Places } from "@/models/places.model";
import express, { Request, Response, NextFunction } from "express";

const regNewPlace = async (req: Request, res: Response, next: NextFunction) => {
  const place: Places = new Places();
  place.id = req.body.placeId;
  place.name = req.body.placeName;
  place.location = req.body.location;
  place.address = req.body.address;
  place.siteUrl = req.body.siteUrl;
  place.tel = req.body.tel;
  place.openingHours = req.body.openingHours;
  // 이미지 추후 구현
  const placeRepository: Repository<Places> = AppDataSource.getRepository(Places);
  // todo: 구글 서버에 데이터 검증 부분 구현

  if (!place.id || !place.name || !place.location || !place.address) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 요청입니다.",
    });
  }

  const exists = await placeRepository.existsBy({ id: place.id });
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

export { regNewPlace };
