import { getPlaceDetailApi } from "@/apis/place.api";
import { queryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const usePlaceDetails = (id: string) => {
  const {
    data: placeDetailsData,
    isLoading: isplaceDetailsDataLoading,
    refetch: getPlaceDetailRefetch,
  } = useQuery({
    queryKey: [queryKey.placeDetails, id],
    queryFn: () => getPlaceDetailApi(id),
  });

  return { placeDetailsData, isplaceDetailsDataLoading, getPlaceDetailRefetch };
};
