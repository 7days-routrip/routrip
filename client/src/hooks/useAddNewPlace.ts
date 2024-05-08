import { getPlaceDetail } from "@/apis/map.api";
import { addNewPlaceApi, checkPlaceApi, getPlaceDetailApi } from "@/apis/place.api";
import { Place } from "@/models/place.model";
import { usePlaceStore } from "@/stores/addPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { useMutation } from "@tanstack/react-query";

export const useAddNewPlace = (data: Place) => {
  const { addPlace } = usePlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { googleMap } = useMapStore();

  const { mutate: addNewPlaceMutate } = useMutation({
    mutationFn: () => checkPlaceApi(data.id),
    onSuccess: async () => {
      try {
        // 1. 구글 api로 장소 상세 정보 요청(장소 이미지 포함)
        const placeDetailData = await getPlaceDetail(googleMap, data.id);
        if (!placeDetailData) return; // map 객체가 없는 경우

        // 2. 백엔드 서버로 등록 요청
        console.log(placeDetailData);
        await addNewPlaceApi(placeDetailData);

        // 추가한 장소 탭으로 이동
        const placeData: Place = {
          id: placeDetailData.id,
          placeName: placeDetailData.placeName,
          location: placeDetailData.location,
          address: placeDetailData.address,
          placeImg: placeDetailData.placeImg,
        };
        addPlace(placeData);
      } catch (err) {
        // 구글 요청 오류 처리
        showAlert("해당 장소에 대한 세부 정보를 불러올 수 없습니다.\n다른 장소를 등록해주세요.", "error");
      }
    },
    onError: (err: any) => {
      // err.message === "Duplicate place" -> 더미 api 요청 결과
      // err.response.status === 409 -> 실제 api 요청 결과
      if (err.response.status === 409) {
        showConfirm("이미 등록된 장소입니다.\n해당 장소를 추가하시겠어요?", async () => {
          try {
            const placeDataFromApi = await getPlaceDetailApi(data.id);
            const addData: Place = {
              id: placeDataFromApi.id,
              placeName: placeDataFromApi.placeName,
              address: placeDataFromApi.address,
              location: placeDataFromApi.location,
              placeImg: placeDataFromApi.placeImg,
            };
            addPlace(addData);
            setMarkerType("add");
          } catch (err: any) {
            showAlert("장소 정보를 불어오는데 실패했습니다.\n다른 장소를 등록해주세요.", "error");
          }
        });
      } else {
        showAlert("서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.", "error");
      }
    },
  });

  return { addNewPlaceMutate };
};
