import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";
import { CardContentStyle, CardImageStyle, CardImageStyleProps, CardStyle, ViewMode } from "./postCard";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE } from "./ProfileCard";

interface Props {
  scheduleProps: ISchedule;
  view: ViewMode;
}

const ScheduleCard = ({ scheduleProps, view }: Props) => {
  return (
    <ScheduleCardStyle $view={view}>
      <Link to={`/schedule/${scheduleProps.id}`}>
        <SchedulerImageStyle $image={scheduleProps.thumbnail ? scheduleProps.thumbnail : ""} $view={view} />
      </Link>
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
  width: ${({ $view }) => ($view === "grid" ? "300px" : "280px")};
  height: ${({ $view }) => ($view === "grid" ? "150px" : "150px")};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "150px")};
    height: ${({ $view }) => ($view === "grid" ? "100px" : "110px")};
  }
`;

const ScheduleCardStyle = styled(CardStyle)`
  width: ${({ $view }) => ($view === "grid" ? "300px" : "800px")};
  height: ${({ $view }) => ($view === "grid" ? "250px" : "100px")};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "300px")};
    height: ${({ $view }) => ($view === "grid" ? "160px" : "80px")};
  }
`;

export default ScheduleCard;
