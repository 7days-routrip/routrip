import styled from "styled-components";
import logoImage from "/assets/images/logo-profile.png"; // 임시로 사용할 장소 이미지
import { SelectedPlace, usePlaceStore } from "@/stores/placeStore";
import { Place } from "@/models/place.model";

interface Props {
  data: SelectedPlace | Place;
  buttonTitle: React.ReactNode;
  imgUrl?: string; // 추후 Place 모델에 imgUrl 넣어서 data에서 추출해야함
  isActive?: boolean;
}
const PlaceItem = ({ data, buttonTitle, imgUrl, isActive = false }: Props) => {
  const { addPlace, removePlace } = usePlaceStore();

  const handleOnClick = () => {
    if (buttonTitle === "추가") {
      addPlace(data);
    } else if (buttonTitle === "등록") {
      // 등록 요청하는 함수 호출
    } else {
      if ("uuid" in data) removePlace(data.uuid);
    }
    const title = typeof buttonTitle === "string" ? buttonTitle : "삭제";
    console.log(title);
  };

  return (
    <PlaceItemStyle $url={imgUrl ? imgUrl : logoImage} $isActive={isActive}>
      <div className="img-container">
        <div className="place-img"></div>
      </div>
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
    width: 45px;
    height: 45px;
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
  }
`;

export default PlaceItem;
