import { DaysWithUuid, ScheduleDetails, ScheduleDetailsWithUuid } from "@/models/schedule.model";
import { SelectedPlace } from "@/stores/addPlaceStore";
import { v4 as uuidv4 } from "uuid";

// ScheduleDetails -> ScheduleDetailsWithUuid
export const convertScheduleDetails = (data: ScheduleDetails): ScheduleDetailsWithUuid => {
  const daysWithUuid: DaysWithUuid[] = data.days.map((item) => ({
    day: item.day,
    spots: item.spots.map((spot) => ({
      ...spot,
      uuid: uuidv4(),
    })),
  }));

  return {
    ...data,
    days: daysWithUuid,
  };
};

// ScheduleDetails -> SelectedPlace[][]
export const convertScheduleDetailsToDayPlaces = (data: ScheduleDetails): SelectedPlace[][] => {
  const daysWithUuid = convertScheduleDetails(data);
  const dayPlacesData: SelectedPlace[][] = daysWithUuid.days.map((item) => item.spots);

  return dayPlacesData;
};

// Date -> YYYY-MM-DD
export const convertDateToISOString = (date: string): string => {
  return date.slice(0, 10);
};

// Date -> 요일
export const convertDateToDay = (date: string): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayIndex = new Date(date).getDay();
  return days[dayIndex];
};
