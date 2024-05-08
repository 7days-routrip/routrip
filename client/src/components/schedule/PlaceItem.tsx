import styled from "styled-components";
import logoImage from "/assets/images/logo-profile.png"; // 임시로 사용할 장소 이미지
import { SelectedPlace, usePlaceStore } from "@/stores/addPlaceStore";
import { Place } from "@/models/place.model";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useAddNewPlace } from "@/hooks/useAddNewPlace";
import { useDayPlaceStore } from "@/stores/dayPlaces";

interface Props {
  data: SelectedPlace | Place;
  buttonTitle: React.ReactNode;
  isActive?: boolean;
}
const PlaceItem = ({ data, buttonTitle, isActive = false }: Props) => {
  const { addPlace, removePlace } = usePlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { removeDayPlace } = useDayPlaceStore();
  const { addNewPlaceMutate } = useAddNewPlace(data);

  const handleOnClick = async () => {
    if (buttonTitle === "추가") {
      addPlace(data);
      setMarkerType("add");
    } else if (buttonTitle === "등록") {
      addNewPlaceMutate();
    } else {
      // 삭제 버튼 클릭 -> 삭제 버튼이 존재하는 장소 아이템의 타입은 반드시 uuid를 가진다.
      // uuid는 절대 중복될 수 없으므로, 아래의 remove 액션 함수를 모두 호출하여 처리하는 것이 가능하다.
      if ("uuid" in data) {
        removePlace(data.uuid); // 추가한 장소 탭에 있는 아이템 삭제 버튼을 눌렀다면, 이 함수에 의해 삭제됨
        removeDayPlace(data.uuid); // 각 day에 있는 아이템 삭제 버튼을 눌렀다면, 이 함수에 의해 삭제됨
      }
    }
    const title = typeof buttonTitle === "string" ? buttonTitle : "삭제";
    console.log(title);
  };

  return (
    <PlaceItemStyle $url={data.placeImg ? data.placeImg : logoImage} $isActive={isActive}>
      {buttonTitle !== "등록" && <div className="place-img"></div>}
      <div className="detail-container">
        <div className="place-title">{data.placeName}</div>
        <div className="place-address">{data.address}</div>
      </div>
      <button className="place-list-btn" onClick={handleOnClick}>
        {buttonTitle}
      </button>
    </PlaceItemStyle>
  );
};

interface PlaceItemStyleProps {
  $url: string;
  $isActive: boolean;
}

const PlaceItemStyle = styled.div<PlaceItemStyleProps>`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.color.white};
  border: ${({ theme, $isActive }) =>
    $isActive ? `2px solid ${theme.color.primary}` : `1px solid ${theme.color.borderGray}`};
  box-shadow: ${({ theme, $isActive }) => ($isActive ? theme.boxShadow.itemShadow : "none")};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 0.5rem;

  .place-img {
    background-image: url(${({ $url }) => $url});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 4px;
    width: 50px;
    height: auto;
  }

  .detail-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .place-title {
      font-weight: 600;
      font-size: ${({ theme }) => theme.fontSize.xsmall};
    }

    .place-address {
      font-size: ${({ theme }) => theme.fontSize.xsmall};
      line-height: 1;
    }
  }

  .place-list-btn {
    cursor: pointer;
    border: none;
    color: ${({ theme }) => theme.color.primary};
    font-weight: 600;
    background-color: ${({ theme }) => theme.color.white};
    padding: 0;
  }
`;

export default PlaceItem;
