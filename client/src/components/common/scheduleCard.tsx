import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";

// props 로 받아야할꺼
// - 이미지 값
// - 여행경로
// - 제목
// - 일정 날짜
interface Props {
  scheduleProps: ISchedule;
}

const ScheduleCard = ({ scheduleProps }: Props) => {
  return (
    <ScheduleCardStyle $img={scheduleProps.image}>
      <div className="img"></div>
      <div className="content">
        <p>{scheduleProps.schedule}</p>
        <h3>{scheduleProps.title}</h3>
        <p>{scheduleProps.date}</p>
      </div>
    </ScheduleCardStyle>
  );
};

interface ScheduleCardStyleProps {
  $img: string;
}

const ScheduleCardStyle = styled.div<ScheduleCardStyleProps>`
  .img {
    background-image: url(${({ $img }) => $img});
    background-size: 100%;
  }

  .content {
  }
`;

export default ScheduleCard;
