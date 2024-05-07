import styled from "styled-components";
import PlaceList from "./PlaceList";

import { makeMockSearchPlace } from "@/utils/makeMockSelectedPlaces";
import { Place } from "@/models/place.model";

const mockBookmarkData: Place[] = Array.from({ length: 5 }, () => makeMockSearchPlace());

interface Props {
  buttonTitle: React.ReactNode;
}

const BookmarkPlace = ({ buttonTitle }: Props) => {
  return (
    <BookmarkPlaceStyle>
      <PlaceList place={mockBookmarkData} buttonTitle={buttonTitle} />
    </BookmarkPlaceStyle>
  );
};

const BookmarkPlaceStyle = styled.div``;

export default BookmarkPlace;
