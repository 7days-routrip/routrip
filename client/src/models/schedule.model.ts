import { SelectedPlace } from "@/stores/addPlaceStore";
import { Place } from "./place.model";

export interface Days {
  day: number; // dayIndex 0부터 시작
  spots: Place[];
}

export interface DaysWithUuid {
  day: number; // dayIndex 0부터 시작
  spots: SelectedPlace[];
}

export interface Schedule {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  thumbnail?: string;
}

export interface ScheduleDetails extends Schedule {
  days: Days[];
}

export interface ScheduleDetailsWithUuid extends Schedule {
  days: DaysWithUuid[];
}
