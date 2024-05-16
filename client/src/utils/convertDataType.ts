import { DaysField } from "@/apis/schedule.api";
import { Place, PlaceDetails } from "@/models/place.model";
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
      location: {
        lat: Number(spot.location.lat),
        lng: Number(spot.location.lng),
      },
    })),
  }));

  return {
    ...data,
    days: daysWithUuid,
  };
};

// ScheduleDetailsWithUuid -> SelectedPlace[][]
export const convertScheduleDetailsWithUuidToDayPlaces = (data: ScheduleDetailsWithUuid): SelectedPlace[][] => {
  const dayPlacesData: SelectedPlace[][] = data.days.map((item) => item.spots);
  return dayPlacesData;
};

// PlaceDetails[] -> 각 요소의 location 필드를 number 타입으로
export const convertBookmarkPlaces = (data: PlaceDetails[]): Place[] => {
  return data.map((item) => ({
    ...item,
    location: { lat: Number(item.location.lat), lng: Number(item.location.lng) },
  }));
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

// SelectedPlace[][] -> DaysField
export const convertSelectedPlaceToDaysField = (allDaysPlaces: SelectedPlace[][]): DaysField[] => {
  return allDaysPlaces.map((preDayPlaces, dayIndex) => {
    const spots = preDayPlaces.map((place) => place.id);
    return { day: dayIndex, spots };
  });
};
