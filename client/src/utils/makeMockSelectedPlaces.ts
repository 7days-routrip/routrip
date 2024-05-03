import { SelectedPlace } from "@/stores/placeStore";
import { fakerKO as faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

// faker api 사용
export const makeMockPlaces = (): SelectedPlace[] => {
  return Array.from({ length: 3 }, (_, i) => ({
    placeId: String(i),
    placeName: faker.lorem.word(),
    address: faker.lorem.word(),
    tel: faker.phone.number().toString(),
    uuid: uuidv4(),
  }));
};
