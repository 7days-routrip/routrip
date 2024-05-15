import styled from "styled-components";
import SearchBox from "./SearchBox";
import PlaceList from "./PlaceList";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { SearchPlaceApiParams, searchPlaceApi } from "@/apis/place.api";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";

const SelectPlace = () => {
  const { searchKeywordToServer, setSearchKeywordToServer } = useSearchKeywordStore();
  const { searchPlaces, setSearchPlaces } = useSearchPlacesStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { googleMap } = useMapStore();

  const requestHandler = async (searchKeyword: string) => {
    // 서버로 검색 요청
    const zoom = googleMap?.getZoom() || 6;
    const lat = googleMap?.getCenter()?.lat() || 38;
    const lng = googleMap?.getCenter()?.lng() || 128;
    const keyword = searchKeyword.trim();

    if (!keyword) return;

    const params: SearchPlaceApiParams = { keyword, zoom, lat, lng };
    console.log(params);

    await searchPlaceApi(params, setSearchPlaces);
    setMarkerType("searchApi");
  };

  return (
    <SelectPlaceStyle>
      <SearchBox
        placeholder="장소명을 검색하세요."
        searchKeyword={searchKeywordToServer}
        requestHandler={requestHandler}
        setSearchKeyword={setSearchKeywordToServer}
      />
      {searchPlaces && <PlaceList place={searchPlaces} buttonTitle={"추가"} type="searchApi" />}
    </SelectPlaceStyle>
  );
};

const SelectPlaceStyle = styled.div``;

export default SelectPlace;
