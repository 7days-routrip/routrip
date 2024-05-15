import Loading from "@/components/common/Loading";
import ScheduleGoogleMap from "@/components/map/ScheduleGoogleMap";
import DaySchedule from "@/components/schedule/DaySchedule";
import { useScheduleDetails } from "@/hooks/useScheduleDetails";
import { convertDateToDay, convertDateToISOString } from "@/utils/convertDataType";
import { showConfirm } from "@/utils/showConfirm";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "@/components/common/Button";
import { useScheduleDelete } from "@/hooks/useScheduleDelete";
import { useDayPlaceStore } from "@/stores/dayPlaces";

const ScheduleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { scheduleDetailData, isScheduleDetailsLoading } = useScheduleDetails(id);
  const { dayPlaces } = useDayPlaceStore();
  const { deleteScheduleMutate } = useScheduleDelete(id);

  if (!scheduleDetailData || isScheduleDetailsLoading) return <Loading />;

  const onClickEditBtn = () => {
    navigate(`/schedule/${id}/edit`);
  };

  const onClickDeleteBtn = () => {
    showConfirm("해당 여행 일정을 삭제하시겠어요?", () => deleteScheduleMutate());
  };

  return (
    <ScheduleDetailPageStyle>
      <div className="map">
        <ScheduleGoogleMap />
      </div>
      <div className="day-schedule">
        <div className="schedule-title">{scheduleDetailData.title}</div>
        <div className="duration-btn-container">
          <div className="schedule-duration">
            <span>
              {`${convertDateToISOString(scheduleDetailData.startDate)}(${convertDateToDay(scheduleDetailData.startDate)})`}
            </span>
            <span>~</span>
            <span>
              {`${convertDateToISOString(scheduleDetailData.endDate)}(${convertDateToDay(scheduleDetailData.endDate)})`}
            </span>
            <span>📆</span>
          </div>
          <div className="edit-delete-btn-container">
            <Button $size="small" $scheme="secondary" $radius="default" onClick={onClickEditBtn}>
              수정
            </Button>
            <Button $size="small" $scheme="secondary" $radius="default" onClick={onClickDeleteBtn}>
              삭제
            </Button>
          </div>
        </div>
        <div className="days">
          {dayPlaces.map((place, i) => (
            <DaySchedule key={i} dayIdx={i} schedulePlaces={place} />
          ))}
        </div>
      </div>
    </ScheduleDetailPageStyle>
  );
};

const ScheduleDetailPageStyle = styled.div`
  display: flex;
  gap: 1em;
  width: 100%;
  height: 100%;

  .map {
    height: 100%;
    width: 50%;
    min-height: 45vh;
  }

  .day-schedule {
    min-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    padding-right: 0.5rem;
  }

  .schedule-title {
    font-weight: 600;
    font-size: ${({ theme }) => theme.fontSize.large};
  }

  .duration-btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .schedule-duration {
      display: flex;
      gap: 0.3rem;

      font-size: ${({ theme }) => theme.fontSize.medium};
      color: ${({ theme }) => theme.color.routeGray};
    }

    .edit-delete-btn-container {
      display: flex;
      gap: 0.2rem;
    }
  }

  .days {
    width: 100%;
    max-height: 70vh;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    flex-direction: column;

    .map {
      width: 100%;
    }

    .day-schedule {
      flex: 1;
      width: 100%;
      display: flex;
      padding-right: 0;
    }
  }
`;

export default ScheduleDetailPage;
