import { SelectedPlace } from "@/stores/addPlaceStore";
import { httpClient } from "./https";
import { showAlert } from "@/utils/showAlert";
import { ScheduleDetails } from "@/models/schedule.model";
import { convertScheduleDetails, convertSelectedPlaceToDaysField } from "@/utils/convertDataType";

// 일정 등록 요청
export interface DaysField {
  day: number;
  spots: string[];
}

interface AddNewScheduleBody {
  title: string;
  startDate: Date;
  endDate: Date;
  days: DaysField[];
}

export interface AddNewScheduleParameter {
  title: string;
  startDate: Date;
  endDate: Date;
  allDaysPlaces: SelectedPlace[][];
}

export const addNewSchedule = async ({ title, startDate, endDate, allDaysPlaces }: AddNewScheduleParameter) => {
  try {
    const days: DaysField[] = convertSelectedPlaceToDaysField(allDaysPlaces);
    const bodyData: AddNewScheduleBody = { title, startDate, endDate, days };
    const { data } = await httpClient.post("/journeys", bodyData);
    return data;
  } catch (err: any) {
    showAlert("일정 등록에 실패했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
    return;
  }
};

// 일정 상세 조회 요청
export const getScheduleDetails = async (id: string) => {
  try {
    const { data } = await httpClient.get<ScheduleDetails>(`/journeys/${id}`);
    return data;
  } catch (err) {
    console.error("api ", err);
    throw err;
  }
};

// 일정 삭제 요청
export const deleteSchedule = async (id: string) => {
  try {
    const { data } = await httpClient.delete(`/journeys/${id}`);
    return data;
  } catch (err) {
    throw err;
  }
};

// 일정 수정 요청
export interface EditScheduleRequest extends AddNewScheduleParameter {
  id: string;
}

export const editSchedule = async ({ id, title, startDate, endDate, allDaysPlaces }: EditScheduleRequest) => {
  try {
    const days: DaysField[] = convertSelectedPlaceToDaysField(allDaysPlaces);
    const bodyData: AddNewScheduleBody = { title, startDate, endDate, days };

    const { data } = await httpClient.put(`/journeys/${id}`, bodyData);
    return data;
  } catch (err) {
    throw err;
  }
};
