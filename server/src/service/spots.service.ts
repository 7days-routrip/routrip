import { Places } from "@/models/places.model";
import { Location, PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import { AppDataSource } from "@/config/ormSetting";
import { s3 } from "@/middlewares/awsUpload";
import axios from "axios";
import { v4 } from "uuid";
import { S3_BUCKET_NAME } from "@/settings";

const placeRepository = AppDataSource.getRepository(Places);

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
  const exists = await placeRepository.existsBy({ id: id });

  if (exists) {
    throw new Error("이미 등록된 장소가 있습니다.\n해당 장소를 추가하시겠습니까?");
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

  const locationStr: string = location.lat + ", " + location.lng;
  place.location = locationStr;

  const openingHoursArr: string[] = openingHours;
  place.openingHours = openingHoursArr.join(", ");

  const savedPlace: Places = await placeRepository.save(place);
};

const checkDuplicate = async (id: string): Promise<boolean> => {
  return await placeRepository.existsBy({ id: id });
};

const getDetail = async (id: string): Promise<PlaceDetailDTO> => {
  let foundPlace: Places | null = await placeRepository.findOneBy({ id: id });

  if (!foundPlace) {
    throw new Error("장소 정보를 찾을 수 없습니다.");
  }

  const locationStrArr: string[] = foundPlace["location"].split(", ");
  const location: Location = {
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
    placeImg: foundPlace.img,
  };

  return placeDetailDTO;
};

const search = async (keyword: string, zoom: number, lat: number, lng: number): Promise<SearchPlaceDTO[]> => {
  const places = await placeRepository
    .createQueryBuilder("places")
    .where("places.name LIKE :keyword", { keyword: `%${keyword}%` })
    .getMany();

  if (places.length === 0) {
    throw new Error("등록된 장소가 없습니다.\n신규 장소를 등록해 주세요.");
  }

  let searchedPlaces: SearchPlaceDTO[] = [];

  places.forEach((place, idx) => {
    const locationStrArr: string[] = place["location"].split(", ");
    const location: Location = {
      lat: parseFloat(locationStrArr[0]),
      lng: parseFloat(locationStrArr[1]),
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

  searchedPlaces.forEach((place, idx) => {
    const distance = getDistance(place.location.lat, place.location.lng, lat, lng);
    if (distance <= searchDistance) {
      filteredPlaces.push(place);
    }
  });
  return filteredPlaces;
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // 지구 반지름 (단위: km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 두 지점 간의 거리 (단위: km)
  return distance * 1000;
}
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const placeImgUpload = async (imageUrl: string): Promise<string> => {
  let response;
  try {
    response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  } catch (error) {
    throw new Error("이미지 요청에 실패했습니다.");
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
    throw new Error("이미지 저장에 실패했습니다.");
  }
  return result.Location;
};

export const SpotsService = {
  register,
  checkDuplicate,
  getDetail,
  search,
};
