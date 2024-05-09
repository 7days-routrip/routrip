import to from "await-to-js";
import { getPlaceDetail } from "@/apis/map.api";
import { addNewPlaceApi, getPlaceDetailApi } from "@/apis/place.api";
import { Place, PlaceDetails } from "@/models/place.model";
import { useAddPlaceStore } from "@/stores/addPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { showConfirm } from "@/utils/showConfirm";
import { useMutation } from "@tanstack/react-query";

export const useAddNewPlace = (data: Place) => {
  const { addPlace } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { googleMap } = useMapStore();

  const { mutate: addNewPlaceMutate } = useMutation({
    mutationFn: async () => {
      let isNew = false;
      let placeDetailData: PlaceDetails;

      // 1. 백엔드 서버로 세부 장소 조회 요청
      const [getPlaceDetailApiError, detailFromApi] = await to(getPlaceDetailApi(data.id));

      if (detailFromApi) {
        // 200 OK 응답
        placeDetailData = detailFromApi;
      } else {
        if (getPlaceDetailApiError && (getPlaceDetailApiError as any).response?.status !== 404) {
          throw getPlaceDetailApiError;
        }

        // 404 에러인 경우 -> 아직 DB에 저장되지 않은 장소이므로, 추가 요청 로직 수행
        // a. 구글 api로 장소 상세 정보 요청(장소 이미지 포함)
        const [placeDataFromApiError, placeDataFromApi] = await to(getPlaceDetail(googleMap, data.id));

        if (!placeDataFromApi) throw placeDataFromApiError;

        // b. 백엔드 서버로 신규 장소 등록 요청
        const [addNewPlaceApiError] = await to(addNewPlaceApi(placeDataFromApi));

        if (addNewPlaceApiError) throw addNewPlaceApiError;

        isNew = true;
        placeDetailData = placeDataFromApi;
      }

      return { placeDetailData, isNew };
    },

    onSuccess: ({ placeDetailData, isNew }) => {
      // 2. 받은 데이터를 가공
      const addData: Place = {
        id: placeDetailData.id,
        placeName: placeDetailData.placeName,
        address: placeDetailData.address,
        location: placeDetailData.location,
        placeImg: placeDetailData.placeImg,
      };

      if (isNew) {
        // 3. 백엔드 장소 세부 정보 요청에 대해 404 에러를 받고, 추가 로직을 진행한 경우
        showConfirm("이미 등록된 장소입니다.\n해당 장소를 추가하시겠어요?", () => {
          addPlace(addData);
          setMarkerType("add");
        });

        return;
      }

      // 4. 백엔드 장소 세부 정보 요청에 대해 200 OK를 받은 경우
      // 사용자의 선택을 확인하고 해당 장소를 프론트 전역 상태에 추가
      addPlace(addData);
      setMarkerType("add");
    },

    onError: async (err: any) => {
      console.error(err);
    },
  });

  return { addNewPlaceMutate };
};
