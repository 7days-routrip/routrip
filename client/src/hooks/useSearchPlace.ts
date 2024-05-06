// import { searchPlaceApi } from "@/apis/place.api";
// import { queryKey } from "@/constants/queryKey";
// import { Place } from "@/models/place.model";
// import { makeMockPlaces, makeMockSearchPlace } from "@/utils/makeMockSelectedPlaces";
// import { useQuery } from "@tanstack/react-query";

// export const useSearchPlace = (keyword: string) => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: [queryKey.searchPlace, keyword],
//     queryFn: () => (keyword ? searchPlaceApi(keyword) : Promise.resolve(null)),
//   });

//   const mockData = makeMockSearchPlace();

//   return {
//     placeData: data,
//     // isSearchLoading: isLoading,
//     // searchPlaceError: error
//   };
// };
