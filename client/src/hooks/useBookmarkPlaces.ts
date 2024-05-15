// import { mockRealPlaceDetailWithoutUuid } from "./../utils/makeMockSelectedPlaces";
import { getBookmarkPlaces } from "@/apis/place.api";
import { queryKey } from "@/constants/queryKey";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useBookmarkPlaces = () => {
  const { setBookmarkPlaces } = useBookmarkPlacesStore();
  const { data: bookmarkPlacesData, isLoading: isBookmarkLoading } = useQuery({
    queryKey: [queryKey.bookmarkPlaces],
    queryFn: getBookmarkPlaces,
    retry: 0,
  });

  useEffect(() => {
    if (!bookmarkPlacesData || bookmarkPlacesData.length === 0) {
      setBookmarkPlaces([]);
    } else {
      setBookmarkPlaces(bookmarkPlacesData);
    }
  }, [bookmarkPlacesData]);

  return { bookmarkPlacesData, isBookmarkLoading };
};
