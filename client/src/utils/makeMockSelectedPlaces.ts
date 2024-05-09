import { Place, PlaceDetails } from "@/models/place.model";
import { SelectedPlace } from "@/stores/addPlaceStore";
import { fakerKO as faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const getImgSrc = (id: number) => {
  return `https://picsum.photos/id/${id}/600/600`;
};

// faker api 사용
export const makeMockPlaces = (): SelectedPlace[] => {
  return Array.from({ length: 4 }, (_) => ({
    id: faker.helpers.rangeToNumber({ min: 0, max: 50 }).toString(),
    placeName: faker.lorem.word(),
    address: faker.lorem.sentence().slice(0, 30),
    location: {
      lat: 37.56226770000001,
      lng: 126.9921278,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  }));
};

export const makeMockSearchPlace = (): Place => ({
  id: faker.helpers.rangeToNumber({ min: 0, max: 50 }).toString(),
  placeName: faker.lorem.word(),
  address: faker.lorem.sentence().slice(0, 30),
  location: {
    lat: 37.56226770000001,
    lng: 126.9921278,
  },
  placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
});

// 추가한 장소 탭에 들어갈 실제 장소 데이터(지도에 마커 찍는 테스트를 하기 위한 데이터)
export const mockRealPlaceWithUuid: SelectedPlace[] = [
  {
    id: "ChIJeV24aepLZTURilEBIwX0GgQ",
    placeName: "도미노피자 대전월평점",
    address: "서구 월평1동 524",
    location: {
      lat: 36.356299,
      lng: 127.3649905,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  },
  {
    id: "ChIJGeYDXX9JZTURsFJQxqnBPws",
    placeName: "한밭수목원",
    address: "서구 둔산대로 169",
    location: {
      lat: 36.3683723,
      lng: 127.3880555,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  },
  {
    id: "ChIJW5uYTErLejUR6bNzZWaUIYk",
    placeName: "국립세종수목원",
    address: "세종특별자치시 수목원로 136",
    location: {
      lat: 36.4978379,
      lng: 127.2854901,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  },
  {
    id: "ChIJYYs2WETgZDURj1oD8SSByXQ",
    placeName: "미동산수목원",
    address: "청주시 상당구 미원면 수목원길 51",
    location: {
      lat: 36.62596,
      lng: 127.6671925,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  },
  {
    id: "ChIJ-2aoP6TibzURLxExwXnmHWU",
    placeName: "대아수목원",
    address: "완주군 동상면 대아수목로 94-34",
    location: {
      lat: 35.9734045,
      lng: 127.3037553,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    uuid: uuidv4(),
  },
];

// 추가한 장소 탭에 들어갈 실제 장소 데이터(지도에 마커 찍는 테스트를 하기 위한 데이터)
export const mockRealPlaceWithoutUuid: Place[] = [
  {
    id: "ChIJeV24aepLZTURilEBIwX0GgQ",
    placeName: "도미노피자 대전월평점",
    address: "서구 월평1동 524",
    location: {
      lat: 36.356299,
      lng: 127.3649905,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
  },
  {
    id: "ChIJGeYDXX9JZTURsFJQxqnBPws",
    placeName: "한밭수목원",
    address: "서구 둔산대로 169",
    location: {
      lat: 36.3683723,
      lng: 127.3880555,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
  },
  {
    id: "ChIJW5uYTErLejUR6bNzZWaUIYk",
    placeName: "국립세종수목원",
    address: "세종특별자치시 수목원로 136",
    location: {
      lat: 36.4978379,
      lng: 127.2854901,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
  },
  {
    id: "ChIJYYs2WETgZDURj1oD8SSByXQ",
    placeName: "미동산수목원",
    address: "청주시 상당구 미원면 수목원길 51",
    location: {
      lat: 36.62596,
      lng: 127.6671925,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
  },
  {
    id: "ChIJ-2aoP6TibzURLxExwXnmHWU",
    placeName: "대아수목원",
    address: "완주군 동상면 대아수목로 94-34",
    location: {
      lat: 35.9734045,
      lng: 127.3037553,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
  },
];

export const mockRealPlaceDetailWithoutUuid: PlaceDetails[] = [
  {
    id: "ChIJeV24aepLZTURilEBIwX0GgQ",
    placeName: "도미노피자 대전월평점",
    address: "서구 월평1동 524",
    location: {
      lat: 36.356299,
      lng: 127.3649905,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    tel: "034-545-7879",
    openingHours: ["aaaaa"],
    siteUrl: "",
  },
  {
    id: "ChIJGeYDXX9JZTURsFJQxqnBPws",
    placeName: "한밭수목원",
    address: "서구 둔산대로 169",
    location: {
      lat: 36.3683723,
      lng: 127.3880555,
    },
    placeImg: getImgSrc(faker.helpers.rangeToNumber({ min: 0, max: 50 })),
    tel: "034-545-7879",
    openingHours: ["aaaaa"],
    siteUrl: "",
  },
];
