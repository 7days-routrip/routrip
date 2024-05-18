import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";
import { CardContentStyle, CardImageStyle, CardImageStyleProps, CardStyle, ViewMode } from "./postCard";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE } from "./ProfileCard";

interface Props {
  scheduleProps: ISchedule;
  view: ViewMode;
  disableLink?: boolean; // 링크 사용 여부를 결정하는 prop 추가
}

const ScheduleCard = ({ scheduleProps, view, disableLink }: Props) => {
  return (
    <ScheduleCardStyle $view={view}>
      {disableLink ? (
        <SchedulerImageStyle $image={scheduleProps.thumbnail ? scheduleProps.thumbnail : ""} $view={view} />
      ) : (
        <Link to={`/schedule/${scheduleProps.id}`}>
          <SchedulerImageStyle $image={scheduleProps.thumbnail ? scheduleProps.thumbnail : ""} $view={view} />
        </Link>
      )}
      <CardContentStyle>
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
  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "auto")};
    height: ${({ $view }) => ($view === "grid" ? "160px" : "auto")};
  }
`;

export default ScheduleCard;
