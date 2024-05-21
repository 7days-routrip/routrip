import { regions } from "@/data/region";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MainPostCardStyle } from "./MainPostCard";
import Title from "./Title";
import { CardImageStyle } from "./postCard";

interface Props {
  id: number;
  name: string;
  img: string;
}
const getRegionByCountryId = (countryId: number) => {
  for (const region of regions) {
    for (const country of region.countries) {
      if (country.id === countryId) {
        return { regionId: region.id, countryId: country.id, regionName: region.name, countryName: country.name };
      }
    }
  }
  return null;
};

const CategoryCard = ({ id, name, img }: Props) => {
  const regionInfo = getRegionByCountryId(id);
  return (
    <CategoryCardStyle>
      <Link
        to={`/post?area=abroad&filter=${id}&region=${regionInfo?.regionId}&country=${regionInfo?.countryId}&page=1`}
      >
        <div className="image-wrapper">
          <CategoryImageStyle $image={img} $view="grid" className="card-image-style" />
        </div>
        <div className="info">
          <div className="title">
            <Title size="medium">{name}</Title>
          </div>
        </div>
      </Link>
    </CategoryCardStyle>
  );
};

const CategoryCardStyle = styled(MainPostCardStyle)`
  width: 80px;
  height: 80px;

  .image-wrapper {
    border-radius: 50%;
  }

  .card-image-style {
    position: unset;
    height: 80px;
    transform: scale(1);
    transition: transform 0.3s;
  }
  &:hover {
    .card-image-style {
      transform: scale(1.4);
    }
  }
  .info {
    justify-content: center;
    align-self: center;
    text-align: center;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0));
    border-radius: 50%;
    padding: 0;
  }
  .title {
    width: 100%;
    justify-content: center;
    color: ${({ theme }) => theme.color.white};
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;

    .title > h1 {
      font-size: 1rem;
    }

    .card-image-style {
      height: 60px;
    }
  }
`;

const CategoryImageStyle = styled(CardImageStyle)`
  width: 80px;
  height: 80px;
  border-radius: 50%;

  &::after {
    background: none;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

export default CategoryCard;
