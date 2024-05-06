import { Place } from "@/models/place.model";
import { makeMockPlaces } from "@/utils/makeMockSelectedPlaces";
import { useQuery } from "@tanstack/react-query";

const mockDataArr = makeMockPlaces();
export const useSearchPlace = (keyword: string) => {
  // const {data, isLoading} = useQuery({

  // })
  return { placeData: mockDataArr, isSearchLoading: false };
};
