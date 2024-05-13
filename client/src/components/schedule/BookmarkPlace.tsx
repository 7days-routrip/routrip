import styled from "styled-components";
import PlaceList from "./PlaceList";
import { useBookmarkPlaces } from "@/hooks/useBookmarkPlaces";

interface Props {
  buttonTitle: React.ReactNode;
}

const BookmarkPlace = ({ buttonTitle }: Props) => {
  const { bookmarkPlacesData } = useBookmarkPlaces();

  return (
    <BookmarkPlaceStyle>
      {bookmarkPlacesData && bookmarkPlacesData.length > 0 ? (
        <PlaceList place={bookmarkPlacesData} buttonTitle={buttonTitle} />
      ) : (
        <div className="empty-bookmark-list">찜한 장소 목록이 비어있습니다.</div>
      )}
    </BookmarkPlaceStyle>
  );
};

const BookmarkPlaceStyle = styled.div`
  .empty-bookmark-list {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    color: ${({ theme }) => theme.color.commentGray};
  }
`;

export default BookmarkPlace;
