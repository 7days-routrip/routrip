import { SelectedPlace } from "@/stores/addPlaceStore";
import styled from "styled-components";
import logoImage from "/assets/images/logo-profile.png";

interface Props {
  data: SelectedPlace;
}
const InfoWindowBox = ({ data }: Props) => {
  return (
    <InfoWindowBoxStyle $imgUrl={data.placeImg ? data.placeImg : logoImage}>
      <div className="place-img"></div>
      <div className="place-name">{data.placeName}</div>
      <div className="place-address">{data.address}</div>
    </InfoWindowBoxStyle>
  );
};

interface InfoWindowBoxStyleProps {
  $imgUrl: string;
}

const InfoWindowBoxStyle = styled.div<InfoWindowBoxStyleProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .place-img {
    background-image: url(${({ $imgUrl }) => $imgUrl});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 4px;
    width: 100%;
    height: 80px;
  }

  .place-name {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    font-weight: 600;
  }

  .place-address {
    font-size: 0.75rem;
  }
`;

export default InfoWindowBox;
