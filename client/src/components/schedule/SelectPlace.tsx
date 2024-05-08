import styled from "styled-components";
import SearchBox from "./SearchBox";
import PlaceList from "./PlaceList";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { searchPlaceApi } from "@/apis/place.api";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";

const SelectPlace = () => {
  const { searchKeywordToServer, setSearchKeywordToServer } = useSearchKeywordStore();
  const { searchPlace, setSearchPlace } = useSearchPlacesStore();
  const { setMarkerType } = useShowMarkerTypeStore();

  const requestHandler = async (keyword: string) => {
    // 서버로 검색 요청
    await searchPlaceApi(keyword, setSearchPlace);
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
      {searchPlace && <PlaceList place={searchPlace} buttonTitle={"추가"} />}
    </SelectPlaceStyle>
  );
};

const SelectPlaceStyle = styled.div``;

export default SelectPlace;
