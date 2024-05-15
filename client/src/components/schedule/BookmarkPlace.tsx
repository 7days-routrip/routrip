import styled from "styled-components";
import PlaceList from "./PlaceList";
import { useBookmarkPlaces } from "@/hooks/useBookmarkPlaces";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";
import Loading from "../common/Loading";

interface Props {
  buttonTitle: React.ReactNode;
}

const BookmarkPlace = ({ buttonTitle }: Props) => {
  const { bookmarkPlacesData } = useBookmarkPlaces();
  const { bookmarkPlaces } = useBookmarkPlacesStore();

  if (!bookmarkPlacesData) return <Loading />;

  return (
    <BookmarkPlaceStyle>
      {bookmarkPlacesData && bookmarkPlaces.length > 0 ? (
        <PlaceList place={bookmarkPlaces} buttonTitle={buttonTitle} type="bookmarkList" />
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
