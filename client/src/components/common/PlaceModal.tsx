import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Button } from "./Button";
import Icons from "@/icons/icons";
import logoImage from "/assets/images/logo-profile2.png";
import { usePlaceDetails } from "@/hooks/usePlaceDetails";
import { Link } from "react-router-dom";
import { deleteBookmark, requestBookmark } from "@/apis/place.api";

interface Props {
  placeId: string;
  onClosed: () => void;
}

const PlaceModal = ({ placeId, onClosed }: Props) => {
  const [isFadeout, setIsFadeOut] = useState(false);
  const { placeDetailsData, isplaceDetailsDataLoading, getPlaceDetailRefetch } = usePlaceDetails(placeId);
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, () => setIsFadeOut(true));

  const handleBookmark = async () => {
    if (!placeDetailsData) return;

    if (placeDetailsData.isPicked) {
      await deleteBookmark(placeId);
      await getPlaceDetailRefetch();
    } else if (!placeDetailsData.isPicked) {
      await requestBookmark(placeId);
      await getPlaceDetailRefetch();
    }
  };

  const handleClose = () => {
    setIsFadeOut(true);
  };

  const handleAnimationEnd = () => {
    if (isFadeout) {
      onClosed();
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  if (!placeDetailsData || isplaceDetailsDataLoading) return null;

  return createPortal(
    <PlaceModalStyle className={isFadeout ? "fade-out" : "fade-in"} onAnimationEnd={handleAnimationEnd}>
      <div className="modal-body" ref={modalRef}>
        <div className="modal-contents">
          <div className="place-name-bookmark">
            <div className="place-name">{placeDetailsData.placeName}</div>
            <Button
              $size="medium"
              $scheme={placeDetailsData.isPicked ? "primary" : "secondary"}
              $radius="default"
              onClick={handleBookmark}
            >
              <Icons.CheckIcon /> <span>찜하기</span>
            </Button>
          </div>
          <div className="place-image">
            <img src={placeDetailsData.placeImg || logoImage} alt="place-img" />
          </div>
          <div className="place-details-container">
            <div className="place-details">
              <span className="content-title">주소</span>
              <span className="content">{placeDetailsData.address}</span>
            </div>
            <div className="place-details">
              <span className="content-title">연락처</span>
              <span className="content">{placeDetailsData.tel}</span>
            </div>
            <div className="place-details hours">
              <span className="content-title">영업 시간</span>
              <div className="opening-hours-content">
                {placeDetailsData.openingHours.length > 0 &&
                  placeDetailsData.openingHours.map((hour, i) => (
                    <span className="opening-hours" key={i}>
                      {hour}
                    </span>
                  ))}
              </div>
            </div>
            <div className="place-details">
              <span className="content-title">홈페이지</span>
              <Link to={placeDetailsData.siteUrl} className="content">
                {placeDetailsData.siteUrl}
              </Link>
            </div>
          </div>
          <div className="closed-btn">
            <Button $size="medium" $scheme="primary" $radius="default" onClick={handleClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </PlaceModalStyle>,
    document.body,
  );
};

const PlaceModalStyle = styled.div`
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  &.fade-in {
    animation: fade-in 0.3s ease-in-out forwards;
  }

  &.fade-out {
    animation: fade-out 0.3s ease-in-out forwards;
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);

  .modal-body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    padding: 2rem;
    background-color: #ffffff;
    box-shadow: ${({ theme }) => theme.boxShadow.default};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    width: 450px;
  }

  .place-image {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
    overflow: hidden;
    position: relative;
    height: 200px;
    margin: 1rem 0;
    img {
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .place-details-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .place-name-bookmark {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;

    .place-name {
      font-size: ${({ theme }) => theme.fontSize.large};
      font-weight: 600;
      overflow-wrap: break-word; /* 단어를 자동으로 줄바꿈 */
      word-break: break-all; /* 단어 중간에 줄바꿈을 허용 */
      white-space: normal; /* 공백 처리를 기본값으로 */
    }

    button {
      align-self: flex-start;
      flex: 0;
    }
  }

  .place-details {
    display: flex;
    gap: 1rem;
  }

  .content-title {
    font-size: ${({ theme }) => theme.fontSize.small};
    font-weight: 600;
    white-space: nowrap;
    width: 70px;
  }

  .content {
    overflow-wrap: break-word; /* 단어를 자동으로 줄바꿈 */
    word-break: break-all; /* 단어 중간에 줄바꿈을 허용 */
    white-space: normal; /* 공백 처리를 기본값으로 */
    flex: 1;
  }

  .opening-hours-content {
    display: flex;
    flex-direction: column;
  }

  .closed-btn {
    padding-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) {
    .modal-body {
      width: 80%;
    }

    .place-details.hours {
      display: none;
    }
  }
`;

export default PlaceModal;
