import { SelectedPlace } from "@/stores/addPlaceStore";
import { httpClient } from "./https";

// 일정 등록 요청
interface DaysField {
  day: number;
  spots: string[];
}

interface AddNewScheduleBody {
  title: string;
  startDate: Date;
  endDate: Date;
  days: DaysField[];
}

export const addNewSchedule = async (
  title: string,
  startDate: Date,
  endDate: Date,
  allDaysPlaces: SelectedPlace[][],
) => {
  try {
    const days = allDaysPlaces.map((preDayPlaces, dayIndex) => {
      const spots = preDayPlaces.map((place) => place.id);
      return { day: dayIndex, spots };
    });

    const bodyData: AddNewScheduleBody = {
      title,
      startDate,
      endDate,
      days,
    };

    console.log(bodyData);
    return bodyData;
    // const { data } = await httpClient.post("/journeys", bodyData);
    // return data;
  } catch (err: any) {
    throw err;
  }
};
