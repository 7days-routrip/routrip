import Slider from "react-slick";
import styled from "styled-components";
import bannerSchedule from "/assets/images/banner-schedule.png";
import bannerWrite from "/assets/images/banner-write.png";
import bannerKorea from "/assets/images/banner-korea.png";
import bannerAbroad from "/assets/images/banner-abroad.png";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/slickDots.css";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    appendDots: (dots: any) => (
      <div
        style={{
          width: "100%",
          position: "absolute",
          bottom: "0",
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
    <BannerStyle>
      <Slider {...settings}>
        <div className="img-container">
          <Link to="/schedule">
            <img className="banner-img" src={bannerSchedule} alt="banner-schedule" />
          </Link>
        </div>
        <div className="img-container">
          <Link to="/write">
            <img className="banner-img" src={bannerWrite} alt="banner-write" />
          </Link>
        </div>
        <div className="img-container">
          <Link to="/post?area=home">
            <img className="banner-img" src={bannerKorea} alt="banner-korea" />
          </Link>
        </div>
        <div className="img-container">
          <Link to="/post?area=abroad">
            <img className="banner-img" src={bannerAbroad} alt="banner-abroad" />
          </Link>
        </div>
      </Slider>
    </BannerStyle>
  );
};

export const BannerStyle = styled.section`
  width: 100%;
  padding: 0 0 1.5rem 0;

  .banner-img {
    width: 100%;
  }

  .slick-prev {
    left: 1.25rem;
    z-index: 500;
  }

  .slick-next {
    right: 1.25rem;
    z-index: 500;
  }

  .slick-prev:before,
  .slick-next:before {
    color: ${({ theme }) => theme.color.primary};
    font-size: ${({ theme }) => theme.fontSize.xlarge};
  }

  .img-container {
    margin: 0;
  }
`;

export default Banner;
