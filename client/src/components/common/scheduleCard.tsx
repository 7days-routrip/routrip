import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";
import { DEFAULT_IMAGE } from "./ProfileCard";
import { CardContentStyle, CardImageStyle, CardImageStyleProps, CardStyle, ViewMode } from "./postCard";

interface Props {
  scheduleProps?: ISchedule; // scheduleProps를 선택적(prop)을로 변경
  view: ViewMode;
  disableLink?: boolean; // 링크 사용 여부를 결정하는 prop 추가
}

const ScheduleCard = ({ scheduleProps, view, disableLink }: Props) => {
  if (!scheduleProps) {
    // scheduleProps가 없을 경우 기본 내용을 표시하거나 null을 반환
    return <div>해당하는 항목이 없습니다.</div>;
  }

  return (
    <ScheduleCardStyle $view={view}>
      <div className="image-wrapper">
        <div className="inner">
          {disableLink ? (
            <>
              <SchedulerImageStyle
                $image={scheduleProps.thumbnail ? scheduleProps.thumbnail : ""}
                $view={view}
                className="card-image-style"
              />
            </>
          ) : (
            <SchedulerImageStyle
              $image={scheduleProps.thumbnail ? scheduleProps.thumbnail : ""}
              $view={view}
              className="card-image-style"
            />
          )}
        </div>
      </div>
      <CardContentStyle $view={view}>
        <h3 className="card-title">{scheduleProps.title}</h3>
        <div className="card-data">
          <small className="date-start">{scheduleProps.startDate} ~ </small>
          <small className="date-end">{scheduleProps.endDate}</small>
        </div>
      </CardContentStyle>
    </ScheduleCardStyle>
  );
};

const SchedulerImageStyle = styled(CardImageStyle)<CardImageStyleProps>`
  background-image: url(${({ $image }) => ($image ? $image : DEFAULT_IMAGE)});
  transform: unset;
  position: unset;
  top: unset;
  left: unset;

  &::after {
    /* background: unset; */
  }
  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "100px")};
    height: ${({ $view }) => ($view === "grid" ? "100px" : "100px")};
  }
`;

const ScheduleCardStyle = styled(CardStyle)`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: ${({ $view }) => ($view === "grid" ? "column" : "row")};

  a {
    display: flex;
    width: 100%;
    color: ${({ theme }) => theme.color.black};
  }
  .image-wrapper {
    overflow: hidden;
    position: relative;
    height: ${({ $view }) => ($view === "grid" ? "160px" : "120px")};
    width: ${({ $view }) => ($view === "grid" ? "100%" : "120px")};
  }

  .inner {
    transition: transform 0.3s;
    height: ${({ $view }) => ($view === "grid" ? "160px" : "120px")};
  }
  &:hover {
    .inner {
      transform: scale(1.1);
    }
  }
  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "auto")};
    height: ${({ $view }) => ($view === "grid" ? "160px" : "auto")};

    .image-wrapper {
      height: ${({ $view }) => ($view === "grid" ? "auto" : "120px")};
    }
    .inner {
      height: ${({ $view }) => ($view === "grid" ? "100px" : "120px")};
    }
  }
`;

export default ScheduleCard;
