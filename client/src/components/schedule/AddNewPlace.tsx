import styled from "styled-components";
import SearchBox from "./SearchBox";
import PlaceList from "./PlaceList";
import { useState } from "react";
import { Place } from "@/models/place.model";

const dataArr: Place[] = [
  {
    placeId: "0",
    placeName: "롯데 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "1",
    placeName: "도쿄 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
];

const AddNewPlace = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  // 구글 api 장소 검색 요청

  return (
    <AddNewPlaceStyle>
      <SearchBox placeholder="장소명을 검색하세요." onSearch={setSearchKeyword} />
      <PlaceList place={dataArr} buttonTitle={"등록"} />
    </AddNewPlaceStyle>
  );
};

const AddNewPlaceStyle = styled.div``;

export default AddNewPlace;
