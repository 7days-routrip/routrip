import styled from "styled-components";
import { CardStyle } from "./postCard";
import icons from "@/icons/icons";
import { PlaceDetails } from "@/models/place.model";
import PlaceModal from "./PlaceModal";
import { useState } from "react";

interface Props {
  PlaceProps: PlaceDetails;
  likePlaceRefetch: () => void;
  profileRefetch: () => void;
}

const LikePlaceCard = ({ PlaceProps, likePlaceRefetch, profileRefetch }: Props) => {
  const MarkIcon = icons.BookmarkIcon;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hondleOnClosed = () => {
    setIsModalOpen(false);
    likePlaceRefetch();
    profileRefetch();
  };

  return (
    <>
      <LikePlaceCardStyle $view={"grid"} onClick={() => setIsModalOpen(true)}>
        <div className="card-header">
          <h3 className="card-title">{PlaceProps.placeName}</h3>
          <MarkIcon />
        </div>
        <div className="card-address">
          <span>주소</span>
          <span>{PlaceProps.address}</span>
        </div>
        <div className="card-tel">
          <span>연락처</span>
          <span>{PlaceProps.tel}</span>
        </div>
      </LikePlaceCardStyle>
      {isModalOpen && <PlaceModal placeId={PlaceProps.id} onClosed={hondleOnClosed} />}
    </>
  );
};

const LikePlaceCardStyle = styled(CardStyle)`
  cursor: pointer;
  max-width: 500px;
  height: 130px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  h3 {
    font-size: ${({ theme }) => theme.fontSize.large};
    margin: 0 0 5px;
  }
  .card-header,
  .card-address,
  .card-tel {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 10px;
  }

  .card-header {
    justify-content: space-between;
  }

  .card-title {
    width: 80%;
  }

  .card-header > :nth-child(2) {
    color: ${({ theme }) => theme.color.primary};
    width: 2rem;
    height: auto;
  }

  .card-address,
  .card-tel {
    justify-content: flex-start;
  }

  .card-address > span:first-child,
  .card-tel > span:first-child {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
    margin-right: 1rem;
    width: 4rem;
  }

  .card-title,
  .card-address:nth-child(2),
  .card-tel > :nth-child(2) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    min-width: 250px;
    height: 100px;
  }
`;

export default LikePlaceCard;
