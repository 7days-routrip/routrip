import { getPlaceDetail } from "@/apis/map.api";
import { addNewPlaceApi, checkPlaceApi } from "@/apis/place.api";
import { Place } from "@/models/place.model";
import { usePlaceStore } from "@/stores/addPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { useMutation } from "@tanstack/react-query";

export const useAddNewPlace = (placeData: Place) => {
  const { addPlace } = usePlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { googleMap } = useMapStore();

  const { mutate: addNewPlaceMutate } = useMutation({
    mutationFn: () => checkPlaceApi(placeData.id),
    onSuccess: async () => {
      try {
        // 1. 구글 api로 장소 상세 정보 요청(장소 이미지 포함)
        const detailData = await getPlaceDetail(googleMap, placeData.id);
        if (!detailData) return; // map 객체가 없는 경우

        // 2. 백엔드 서버로 등록 요청
        // addNewPlaceApi();

        addPlace(detailData);
      } catch (err) {
        // 구글 요청 오류 처리
        showAlert("해당 장소에 대한 세부 정보를 불러올 수 없습니다.\n다른 장소를 등록해주세요.", "error");
      }
    },
    onError: (err: any) => {
      // err.message === "Duplicate place" -> 더미 api 요청 결과
      // err.response.status === 409 -> 실제 api 요청 결과
      if (err.response.status === 409) {
        showConfirm("이미 등록된 장소입니다.\n해당 장소를 추가하시겠어요?", () => {
          addPlace(placeData);
          setMarkerType("add");
        });
      } else {
        showAlert("서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.", "error");
      }
    },
  });

  return { addNewPlaceMutate };
};
