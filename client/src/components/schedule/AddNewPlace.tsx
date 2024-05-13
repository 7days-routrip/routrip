import styled from "styled-components";
import SearchBox from "./SearchBox";
import PlaceList from "./PlaceList";

import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { SearchNearByPlacesParams, searchNearByPlaces } from "@/apis/map.api";
import { useMapStore } from "@/stores/mapStore";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { calculateSearchRadius } from "@/utils/calculateSearchRadius";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";

const AddNewPlace = () => {
  const { nearPlaces, setNearPlaces } = useNearPlacesStore();
  const { mapCenter, googleMap } = useMapStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { searchKeywordToGoogle, setSearchKeywordToGoogle } = useSearchKeywordStore();

  const requestHandler = async (keyword: string) => {
    // 구글 api 장소 검색 요청
    const currentZoom = googleMap?.getZoom() || 6;
    const radius = calculateSearchRadius(currentZoom);
    // console.log(currentZoom, radius, mapCenter);
    const params: SearchNearByPlacesParams = {
      keyword,
      location: { lat: mapCenter.lat, lng: mapCenter.lng },
      radius,
    };

    await searchNearByPlaces(googleMap, params, setNearPlaces);
    setMarkerType("searchGoogle");
  };

  return (
    <AddNewPlaceStyle>
      <small className="menual">
        <span>💡 검색할 장소가 있는 나라 주변으로 지도를 먼저 움직여주세요. </span>
        <span className="sub-menual">
          (지도 중심에서 최대 {calculateSearchRadius(googleMap?.getZoom() || 6) / 1000}km 주변을 검색합니다.)
        </span>
      </small>

      <SearchBox
        placeholder="장소명을 검색하세요."
        searchKeyword={searchKeywordToGoogle}
        requestHandler={requestHandler}
        setSearchKeyword={setSearchKeywordToGoogle}
      />
      <PlaceList place={nearPlaces} buttonTitle={"등록"} type="searchGoogle" />
    </AddNewPlaceStyle>
  );
};

const AddNewPlaceStyle = styled.div`
  .menual {
    font-weight: 600;

    .sub-menual {
      color: ${({ theme }) => theme.color.commentGray};
    }
  }
`;

export default AddNewPlace;
