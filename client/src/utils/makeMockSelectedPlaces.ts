import { SelectedPlace } from "@/stores/placeStore";
import { fakerKO as faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const getImgSrc = (id: number) => {
  return `https://picsum.photos/id/${id}/600/600`;
};

// faker api 사용
export const makeMockPlaces = (): SelectedPlace[] => {
  return Array.from({ length: 4 }, (_) => ({
    placeId: faker.helpers.rangeToNumber({ min: 0, max: 50 }).toString(),
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
