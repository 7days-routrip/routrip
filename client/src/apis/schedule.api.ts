import { SelectedPlace } from "@/stores/addPlaceStore";
import { httpClient } from "./https";
import { showAlert } from "@/utils/showAlert";
import { mockScheduleDetailData } from "@/utils/makeMockSelectedPlaces";
import { ScheduleDetails } from "@/models/schedule.model";
import { convertScheduleDetails } from "@/utils/convertDataType";

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
    showAlert("일정을 등록에 실패했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
    return;
  }
};

export const getScheduleDetails = async (id: string) => {
  try {
    // const { data } = await httpClient.get<ScheduleDetails>(`/journeys/${id}`);
    // const convertData = convertScheduleDetails(data);
    // return convertData;
    const mockScheduleData = convertScheduleDetails(mockScheduleDetailData);
    console.log(mockScheduleData);

    return mockScheduleData;
  } catch (err) {
    throw err;
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    await httpClient.delete(`/journeys/${id}`);
  } catch (err) {
    throw err;
  }
};
