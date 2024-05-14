import { EditScheduleRequest, editSchedule } from "@/apis/schedule.api";
import { useAddPlaceStore } from "@/stores/addPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { showAlert } from "@/utils/showAlert";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useScheduleEdit = () => {
  const { setDayPlaces } = useDayPlaceStore();
  const { setAddPlaces } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { setNearPlaces } = useNearPlacesStore();
  const { setSearchPlaces } = useSearchPlacesStore();
  const { setSearchKeywordToServer, setSearchKeywordToGoogle } = useSearchKeywordStore();

  const navigate = useNavigate();

  const { mutate: editScheduleMutate } = useMutation({
    mutationFn: ({ id, title, startDate, endDate, allDaysPlaces }: EditScheduleRequest) =>
      id ? editSchedule({ id, title, startDate, endDate, allDaysPlaces }) : Promise.resolve(null),
    onSuccess: (_, variables) => {
      showAlert("일정 수정이 완료되었습니다.", "logo", () => {
        navigate(`/schedule/${variables.id}`);

        // 북마크한 상태 제외한 나머지 일정 관련 전역 스토어 모두 초기화
        setAddPlaces([]);
        setMarkerType("searchApi");
        setNearPlaces([]);
        setDayPlaces([[]]);
        setSearchPlaces([]);
        setSearchKeywordToServer("");
        setSearchKeywordToGoogle("");
      });
    },
    onError: (err: any) => {
      showAlert("일정 수정에 실패했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
      console.error(err);
    },
  });

  return { editScheduleMutate };
};
