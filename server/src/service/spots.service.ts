import { Places } from "@/models/places.model";
import { Location, PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import { AppDataSource } from "@/config/ormSetting";

const placeRepository = AppDataSource.getRepository(Places);

const register = async (
  id: string,
  name: string,
  address: string,
  siteUrl: string,
  tel: string,
  location: Location,
  openingHours: string[],
  img: string,
): Promise<boolean> => {
  const place: Places = new Places();
  place.id = id;
  place.name = name;
  place.address = address;
  place.siteUrl = siteUrl;
  place.tel = tel;
  place.img = img;

  const locationStr: string = location.lat + ", " + location.lng;
  place.location = locationStr;

  const openingHoursArr: string[] = openingHours;
  place.openingHours = openingHoursArr.join(", ");

  const exists = await placeRepository.existsBy({ id: place.id });

  if (exists) {
    return false;
  }
  const savedPlace: Places = await placeRepository.save(place);
  return true;
};

const checkDuplicate = async (id: string): Promise<boolean> => {
  return await placeRepository.existsBy({ id: id });
};

const getDetail = async (id: string): Promise<boolean | PlaceDetailDTO> => {
  let foundPlace: Places | null = await placeRepository.findOneBy({ id: id });

  if (!foundPlace) {
    return false;
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

const search = async (keyword: string): Promise<boolean | SearchPlaceDTO[]> => {
  const places = await placeRepository
    .createQueryBuilder()
    .where("places.name LIKE :keyword", { keyword: `%${keyword}%` })
    .getMany();

  if (places.length === 0) {
    return false;
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

  return searchedPlaces;
};
export const SpotsService = {
  register,
  checkDuplicate,
  getDetail,
  search,
};
