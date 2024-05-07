import styled from "styled-components";
import PlaceList from "./PlaceList";
import { Place } from "@/models/place.mode";

const bookmarkPlaces: Place[] = [
  {
    placeId: "0",
    placeName: "롯데 월드 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "1",
    placeName: "도쿄 타워",
    address: "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011 일본",
    tel: "3-3433-5111",
  },
];

interface Props {
  buttonTitle: React.ReactNode;
}

const BookmarkPlace = ({ buttonTitle }: Props) => {
  return (
    <BookmarkPlaceStyle>
      <PlaceList place={bookmarkPlaces} buttonTitle={buttonTitle} />
    </BookmarkPlaceStyle>
  );
};

const BookmarkPlaceStyle = styled.div``;

export default BookmarkPlace;
