import Slider from "react-slick";
import styled from "styled-components";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/slickDots.css";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
  title: string;
  children?: React.ReactNode;
}

const SlideSection = ({ title, children }: Props) => {
  const { isMobile } = useMediaQuery();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 3 : 4,
    slidesToScroll: isMobile ? 3 : 4,
    appendDots: (dots: any) => (
      <div
        style={{
          width: "100%",
          position: "absolute",
          bottom: "-3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: "dots-custom",
  };
  return (
    <SlideSectionStyle>
      <h2>{title}</h2>
      <Slider {...settings}>{children}</Slider>
    </SlideSectionStyle>
  );
};

const SlideSectionStyle = styled.section`
  width: 100%;
  padding: 0 0 1.5rem 0;

  h2 {
    margin-bottom: 0.1rem;
  }

  .children-container {
    display: flex;
  }

  .slick-slide > div {
    margin: 0 0.5rem;
  }
  .slick-prev {
    left: 1.25rem;
    z-index: 500;
  }

  .slick-next {
    right: 1.35rem;
    z-index: 500;
  }

  .slick-prev:before,
  .slick-next:before {
    color: ${({ theme }) => theme.color.primary};
    font-size: ${({ theme }) => theme.fontSize.xlarge};
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    .slick-list {
      /* margin-right: -0.5rem; */
    }

    .slick-slide {
      /* padding-right: 0.5rem; */
    }
  }
`;

export default SlideSection;
