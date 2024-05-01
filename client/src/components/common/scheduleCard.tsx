import icons from "@/icons/icons";
import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";
import { CardContentStyle, CardImageStyle, CardStyle, ScheduleStyle, ViewMode } from "./postCard";

interface Props {
  scheduleProps: ISchedule;
  view: ViewMode;
}

const ScheduleCard = ({ scheduleProps, view }: Props) => {
  const PinIcon = icons.PinIcon;
  return (
    <ScheduleCardStyle $view={view}>
      <CardImageStyle $image={scheduleProps.image} $view={view} />
      <CardContentStyle>
        <ScheduleStyle>
          <PinIcon />
          <span>
            {scheduleProps.continental} • {scheduleProps.country}
          </span>
        </ScheduleStyle>
        <h3 className="card-title">{scheduleProps.title}</h3>
        <p className="card-date">{scheduleProps.date}</p>
      </CardContentStyle>
    </ScheduleCardStyle>
  );
};

const ScheduleCardStyle = styled(CardStyle)`
  width: ${({ $view }) => ($view === "grid" ? "300px" : "800px")};
  height: ${({ $view }) => ($view === "grid" ? "250px" : "100px")};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "300px")};
    height: ${({ $view }) => ($view === "grid" ? "160px" : "80px")};
  }
`;

export default ScheduleCard;
