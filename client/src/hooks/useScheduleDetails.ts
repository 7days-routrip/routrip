import { getScheduleDetails } from "@/apis/schedule.api";
import { queryKey } from "@/constants/queryKey";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { useMapStore } from "@/stores/mapStore";
import { convertScheduleDetailsWithUuidToDayPlaces } from "@/utils/convertDataType";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useScheduleDetails = (id: string | undefined) => {
  const { googleMap, setCenter } = useMapStore();
  const { setDayPlaces } = useDayPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();

  const { data: scheduleDetailData, isLoading: isScheduleDetailsLoading } = useQuery({
    queryKey: [queryKey.scheduleDetails, id],
    queryFn: () => (id ? getScheduleDetails(id) : Promise.resolve(null)),
    retry: 0,
  });

  useEffect(() => {
    if (scheduleDetailData) {
      setDayPlaces(convertScheduleDetailsWithUuidToDayPlaces(scheduleDetailData));

      if (scheduleDetailData.days[0].spots.length === 0) {
        googleMap?.setZoom(6);
        setCenter({ lat: 38, lng: 128 });
        return;
      }

      setMarkerType("day", 0);
    }
  }, [scheduleDetailData]);

  return { scheduleDetailData, isScheduleDetailsLoading };
};
