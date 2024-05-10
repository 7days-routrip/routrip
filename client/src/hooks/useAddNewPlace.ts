import to from "await-to-js";
import { getPlaceDetail } from "@/apis/map.api";
import { addNewPlaceApi, getPlaceDetailApi } from "@/apis/place.api";
import { Place, PlaceDetails } from "@/models/place.model";
import { useAddPlaceStore } from "@/stores/addPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";
import { showConfirm } from "@/utils/showConfirm";
import { useMutation } from "@tanstack/react-query";
import { showAlert } from "@/utils/showAlert";

const errorType = {
  getPlaceDetailApiError: "getPlaceDetailApiError",
  placeDataFromGoogleError: "placeDataFromGoogleError",
  addNewPlaceApiError: "addNewPlaceApiError",
};

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
          throw { type: errorType.getPlaceDetailApiError, error: getPlaceDetailApiError };
        }

        // 404 에러 -> 추가 요청 진행
        // a. 구글 api로 장소 상세 정보 요청
        const [placeDataFromGoogleError, placeDataFromGoogle] = await to(getPlaceDetail(googleMap, data.id));

        if (!placeDataFromGoogle) throw { type: errorType.placeDataFromGoogleError, error: placeDataFromGoogleError };

        // b. 백엔드 서버로 신규 장소 등록 요청
        const [addNewPlaceApiError] = await to(addNewPlaceApi(placeDataFromGoogle));

        if (addNewPlaceApiError) throw { type: errorType.addNewPlaceApiError, error: addNewPlaceApiError };

        isNew = true;
        placeDetailData = placeDataFromGoogle;
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
        // 3. 신규 장소 등록 요청 성공한 경우
        addPlace(addData);
        setMarkerType("add");

        return;
      }

      // 4. 백엔드 장소 세부 정보 요청 성공한 경우
      showConfirm("이미 등록된 장소입니다.\n해당 장소를 추가하시겠어요?", () => {
        addPlace(addData);
        setMarkerType("add");
      });
    },

    onError: async (err: any) => {
      if (err.type === errorType.getPlaceDetailApiError) {
        showAlert("장소 정보를 불어오는데 실패했습니다.\n잠시 후에 다시 시도해주세요.", "error");
      } else if (err.type === errorType.placeDataFromGoogleError) {
        showAlert("해당 장소에 대한 정보를 불러올 수 없습니다.\n다른 장소를 등록해주세요.", "error");
      } else if (err.type === errorType.addNewPlaceApiError) {
        showAlert("해당 장소를 등록하는데 문제가 발생했습니다.\n잠시 후에 다시 시도해주세요.", "error");
      } else {
        showAlert("알 수 없는 오류가 발생했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
        console.error(err);
      }
    },
  });

  return { addNewPlaceMutate };
};
