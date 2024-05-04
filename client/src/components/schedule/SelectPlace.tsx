import styled from "styled-components";
import SearchBox from "./SearchBox";
import { useState } from "react";
import { useSearchPlace } from "@/hooks/useSearchPlace";
import PlaceList from "./PlaceList";
import Loading from "@/components/common/Loading";

const SelectPlace = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { placeData, isSearchLoading } = useSearchPlace(searchKeyword); // tanstack query

  if (isSearchLoading) return <Loading />;

  return (
    <SelectPlaceStyle>
      <SearchBox placeholder="장소명을 검색하세요." onSearch={setSearchKeyword} />
      <PlaceList place={placeData} buttonTitle={"추가"} />
    </SelectPlaceStyle>
  );
};

const SelectPlaceStyle = styled.div``;

export default SelectPlace;
