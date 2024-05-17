import { Places } from "@/models/places.model";
import { Location, PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import { AppDataSource } from "@/config/ormSetting";
import { s3 } from "@/middlewares/awsUpload";
import axios from "axios";
import { v4 } from "uuid";
import { S3_BUCKET_NAME } from "@/settings";
import { Picks } from "@/models/picks.model";
import {
  CONFLICT_PLACE_ADD,
  INTERNAL_SERVER_ERROR_REQUEST_IMAGE,
  INTERNAL_SERVER_ERROR_SAVE_IMAGE,
  NOT_FOUND_PLACE,
  NOT_FOUND_PLACE_ADD,
  NOT_FOUND_USER,
} from "@/constants/message";

const placeRepository = AppDataSource.getRepository(Places);
const picksRepository = AppDataSource.getRepository(Picks);

const register = async (
  id: string,
  name: string,
  address: string,
  siteUrl: string,
  tel: string,
  location: Location,
  openingHours: string[],
  placeImg: string,
): Promise<void> => {
  const exists = await placeRepository.findOneBy({ id: id });

  if (exists) {
    throw new Error(CONFLICT_PLACE_ADD);
  }

  let placeS3Img: string = "";
  if (placeImg.length > 0) placeS3Img = await placeImgUpload(placeImg);

  const place: Places = new Places();
  place.id = id;
  place.name = name;
  place.address = address;
  place.siteUrl = siteUrl;
  place.tel = tel;
  place.img = placeS3Img;
  place.location = `${location.lat}, ${location.lng}`;

  const openingHoursArr: string[] = openingHours;
  place.openingHours = openingHoursArr.join(", ");

  await placeRepository.save(place);
};

const checkDuplicate = async (id: string): Promise<boolean> => {
  return (await placeRepository.findOneBy({ id: id })) !== null;
};

const getDetail = async (
  id: string,
  user: { id?: number; nickName?: string; isLoggedIn: boolean },
): Promise<PlaceDetailDTO> => {
  let foundPlace: Places | null = await placeRepository.findOneBy({ id: id });

  if (!foundPlace) {
    throw new Error(NOT_FOUND_PLACE);
  }

  const [lat, lng] = foundPlace.location;
  const location = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  const openingHoursArr: string[] = foundPlace.openingHours.split(", ");

  let isPicked: boolean;

  if (!user) {
    throw new Error(NOT_FOUND_USER);
  } else if (user.isLoggedIn) {
    isPicked = await picksRepository.existsBy({ user: { id: user.id }, place: { id: id } });
  } else {
    isPicked = false;
  }

  let placeDetailDTO: PlaceDetailDTO = {
    id: foundPlace.id,
    placeName: foundPlace.name,
    location: location,
    address: foundPlace.address,
    siteUrl: foundPlace.siteUrl,
    tel: foundPlace.tel,
    openingHours: openingHoursArr,
    placeImg: foundPlace.img,
    isPicked: isPicked,
  };

  return placeDetailDTO;
};

const search = async (keyword: string, zoom: number, lat: number, lng: number): Promise<SearchPlaceDTO[]> => {
  const places = await placeRepository
    .createQueryBuilder("places")
    .where("places.name LIKE :keyword", { keyword: `%${keyword}%` })
    .getMany();

  if (places.length === 0) {
    throw new Error(NOT_FOUND_PLACE_ADD);
  }

  let searchedPlaces: SearchPlaceDTO[] = [];

  places.forEach((place) => {
    const [lat, lng] = place.location;
    const location = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    const searchedPlace: SearchPlaceDTO = {
      id: place.id,
      placeName: place.name,
      address: place.address,
      location: location,
      placeImg: place.img,
    };
    searchedPlaces.push(searchedPlace);
  });

  let filteredPlaces: SearchPlaceDTO[] = [];
  let searchDistance: number;

  if (zoom < 10) searchDistance = 50000;
  else if (zoom < 15) searchDistance = 30000;
  else searchDistance = 10000;

  searchedPlaces.forEach((place) => {
    const distance = getDistance(place.location.lat, place.location.lng, lat, lng);
    if (distance <= searchDistance) {
      filteredPlaces.push(place);
    }
  });
  if (filteredPlaces.length === 0) {
    throw new Error(NOT_FOUND_PLACE_ADD);
  }
  return filteredPlaces;
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const PI = Math.PI;
  const radius = 6371; // 지구 반지름 (단위: km)
  const dLat = (lat2 - lat1) * (PI / 180);
  const dLon = (lng2 - lng1) * (PI / 180);
  const temp1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (PI / 180)) * Math.cos(lat2 * (PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const temp2 = 2 * Math.atan2(Math.sqrt(temp1), Math.sqrt(1 - temp1));
  const distance = radius * temp2;
  return distance * 1000; // 거리 (단위: m)
}

const placeImgUpload = async (imageUrl: string): Promise<string> => {
  let response;
  try {
    response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  } catch (error) {
    throw new Error(INTERNAL_SERVER_ERROR_REQUEST_IMAGE);
  }

  const imageBuffer = Buffer.from(response.data, "binary");
  const imageName = `placeImg/${Date.now() + v4() + ".jpg"}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: imageName,
    Body: imageBuffer,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  let result;
  try {
    result = await s3.upload(params).promise();
  } catch (error) {
    throw new Error(INTERNAL_SERVER_ERROR_SAVE_IMAGE);
  }
  return result.Location;
};

export const SpotsService = {
  register,
  checkDuplicate,
  getDetail,
  search,
};
