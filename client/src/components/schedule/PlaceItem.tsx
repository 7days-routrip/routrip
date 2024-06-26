import styled from "styled-components";
import logoImage from "/assets/images/logo-profile.png"; // 임시로 사용할 장소 이미지
import { SelectedPlace, useAddPlaceStore } from "@/stores/addPlaceStore";
import { Place } from "@/models/place.model";
import { ClickType, useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useAddNewPlace } from "@/hooks/useAddNewPlace";
import { useDayPlaceStore } from "@/stores/dayPlaces";

interface Props {
  data: SelectedPlace | Place;
  buttonTitle: React.ReactNode;
  type: ClickType;
  typeIdx?: number;
  isActive?: boolean;
  disabled?: boolean;
}

const PlaceItem = ({ data, buttonTitle, type, typeIdx, isActive = false, disabled = false }: Props) => {
  const { addPlace, removePlace } = useAddPlaceStore();
  const { setClickMarker, setMarkerType } = useShowMarkerTypeStore();
  const { removeDayPlace } = useDayPlaceStore();
  const { addNewPlaceMutate } = useAddNewPlace(data);

  const handleOnClickPlaceItem = () => {
    console.log(type, typeIdx);
    if (type === "day") setMarkerType(type, typeIdx);
    else setMarkerType(type);

    console.log(data);
    setClickMarker(data);
  };

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
  };

  return (
    // <div onClick={handleOnClickPlaceItem}>
    <PlaceItemStyle $url={data.placeImg ? data.placeImg : logoImage} $isActive={isActive}>
      {buttonTitle !== "등록" && <div className="place-img" />}
      <div className="detail-container" onClick={handleOnClickPlaceItem}>
        <div className="place-title">{data.placeName}</div>
        <div className="place-address">{data.address}</div>
      </div>
      {!disabled && (
        <button className="place-list-btn" onClick={handleOnClick}>
          {buttonTitle}
        </button>
      )}
    </PlaceItemStyle>
    // </div>
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

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;

export default PlaceItem;
