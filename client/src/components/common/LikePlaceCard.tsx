import styled from "styled-components";
import { CardStyle } from "./postCard";
import icons from "@/icons/icons";
import { LikePlace } from "@/models/place.model";

interface Props {
  PlaceProps: LikePlace;
}

const LikePlaceCard = ({ PlaceProps }: Props) => {
  const MarkIcon = icons.BookmarkIcon;
  return (
    <LikePlaceCardStyle $view={"grid"}>
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
  );
};

const LikePlaceCardStyle = styled(CardStyle)`
  width: 400px;
  height: 130px;
  display: flex;
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

  .card-address:nth-child(2),
  .card-tel > :nth-child(2) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    width: 300px;
    height: 100px;
  }
`;

export default LikePlaceCard;
