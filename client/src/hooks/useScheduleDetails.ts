import { getScheduleDetails } from "@/apis/schedule.api";
import { queryKey } from "@/constants/queryKey";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { convertScheduleDetailsToDayPlaces } from "@/utils/convertDataType";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useScheduleDetails = (id: string | undefined) => {
  const { setDayPlaces } = useDayPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();

  const { data: scheduleDetailData, isLoading: isScheduleDetailsLoading } = useQuery({
    queryKey: [queryKey.scheduleDetails, id],
    queryFn: () => (id ? getScheduleDetails(id) : Promise.resolve(null)),
  });

  useEffect(() => {
    if (scheduleDetailData) {
      setMarkerType("day", 0);
      setDayPlaces(convertScheduleDetailsToDayPlaces(scheduleDetailData));
    }
  }, [scheduleDetailData]);

  return { scheduleDetailData, isScheduleDetailsLoading };
};
