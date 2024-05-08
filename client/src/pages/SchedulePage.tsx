import AddNewPlace from "@/components/schedule/AddNewPlace";
import { PlaceTabContent, PlaceTabs } from "@/components/schedule/PlaceTabs";
import SelectPlace from "@/components/schedule/SelectPlace";
import styled from "styled-components";
import AddPlaceSchedule from "@/components/schedule/AddPlaceSchedule";
import Icons from "@/icons/icons";
import { useEffect, useState } from "react";
import BookmarkPlace from "@/components/schedule/BookmarkPlace";
import { showAlert } from "@/utils/showAlert";
import DaySchedule from "@/components/schedule/DaySchedule";
import { getDuration } from "@/utils/getDuration";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { SelectedPlace, usePlaceStore } from "@/stores/addPlaceStore";
import ScheduleGoogleMap from "@/components/map/ScheduleGoogleMap";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { Button } from "@/components/common/Button";

const SchedulePage = () => {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const { dayPlaces, setDayPlaces } = useDayPlaceStore();
  const { places, setPlaces } = usePlaceStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSchedule = () => {
    if (title && startDate && endDate) {
      if (startDate > endDate) {
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo");
        return;
      }

      // 일정 등록 요청
      console.log("등록 완료");
      return;
    }

    showAlert("여행 제목 또는 여행 일자는\n반드시 작성하셔야 합니다.", "logo");
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // console.log(result);
    // console.log(places);
    const { source, destination } = result;
    const destinationId = destination.droppableId === "add-places" ? -1 : Number(destination.droppableId.at(-1));
    const sourceId = source.droppableId === "add-places" ? -1 : Number(source.droppableId.at(-1));
    // console.log(sourceId, destinationId);

    if (destinationId === sourceId && destinationId > -1 && sourceId > -1) {
      // 동일한 DaySchedule 내부에서 장소 아이템을 옮길 때
      const updatedArr = Array.from(dayPlaces[destinationId]);
      const movedItem = updatedArr[source.index];
      updatedArr.splice(source.index, 1); // 원래 위치에서 아이템 제거
      updatedArr.splice(destination.index, 0, movedItem); // 목적지에 아이템 추가

      const updatedDayPerPlaces = [...dayPlaces];
      updatedDayPerPlaces[destinationId] = updatedArr;

      setDayPlaces(updatedDayPerPlaces);
    } else if (destinationId !== sourceId && destinationId > -1 && sourceId > -1) {
      // 서로 다른 DaySchedule에 존재하는 장소 아이템을 옮길 때
      const movedItem = dayPlaces[sourceId][source.index];
      const updatedSourceArr = [...dayPlaces[sourceId]];
      updatedSourceArr.splice(source.index, 1); // 원래 위치에서 아이템 제거

      const updatedDestinationArr = [...dayPlaces[destinationId]];
      updatedDestinationArr.splice(destination.index, 0, movedItem); // 목적지에 아이템 추가

      const updatedDayPerPlaces = [...dayPlaces];
      updatedDayPerPlaces[sourceId] = updatedSourceArr;
      updatedDayPerPlaces[destinationId] = updatedDestinationArr;

      setDayPlaces(updatedDayPerPlaces);
    } else if (destinationId === -1 && sourceId === -1) {
      // 전역으로 관리되는 selectedPlaces 내부에서의 이동
      const movedItem = places[source.index];
      const updatedSourceArr = [...places];
      updatedSourceArr.splice(source.index, 1);
      updatedSourceArr.splice(destination.index, 0, movedItem);

      setPlaces(updatedSourceArr);
    } else {
      if (sourceId > -1) {
        // 출발지는 DaySchedule 컴포넌트 -> 도착지는 전역 상태 selectedPlaces
        const movedItem = dayPlaces[sourceId][source.index];
        const updatedSourceArr = [...dayPlaces[sourceId]];
        updatedSourceArr.splice(source.index, 1);

        let updatedDestinationArr = [...places];
        if (destinationId !== -1) {
          updatedDestinationArr = [...dayPlaces[destinationId]];
        }
        updatedDestinationArr.splice(destination.index, 0, movedItem);

        const updatedDayPerPlaces = [...dayPlaces];
        updatedDayPerPlaces[sourceId] = updatedSourceArr;

        setDayPlaces(updatedDayPerPlaces);
        setPlaces(updatedDestinationArr);
      } else {
        // 출발지는 전역 상태 selectedPlaces -> 도착지는 DaySchedule
        const movedItem = places[source.index];
        const updatedSourceArr = places.filter((_, index) => index !== source.index);

        let updatedDestinationArr = [...dayPlaces[destinationId]];
        updatedDestinationArr.splice(destination.index, 0, movedItem);

        const updatedDayPerPlaces = [...dayPlaces];
        updatedDayPerPlaces[destinationId] = updatedDestinationArr;

        setDayPlaces(updatedDayPerPlaces);
        setPlaces(updatedSourceArr);
      }
    }
  };

  useEffect(() => {
    // 새로고침 누를 시, confirm창 보이도록
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo");

        if (dayPlaces.flat().length > 0) {
          console.log(dayPlaces.flat());
          const updatedSelectedPlaces = [...dayPlaces.flat(), ...places];
          usePlaceStore.setState({ places: updatedSelectedPlaces });
        }

        setDuration(0);
        setDayPlaces([]);
        return;
      }

      if (dayPlaces.flat().length > 0) {
        console.log(dayPlaces.flat());
        const updatedSelectedPlaces = [...dayPlaces.flat(), ...places];
        usePlaceStore.setState({ places: updatedSelectedPlaces });
      }

      const due = getDuration(startDate, endDate);
      setDuration(due);

      const defaultPlaces: SelectedPlace[][] = Array.from({ length: due }, () => []);
      setDayPlaces(defaultPlaces);
      console.log(getDuration(startDate, endDate));
    }
  }, [startDate, endDate]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <SchedulePageStyle>
        <div className="map">
          <ScheduleGoogleMap />
        </div>
        <div className="trip-schedule-container">
          <div className="place-select-form">
            <div className="input-data">
              <input
                className="input-title"
                type="text"
                placeholder="여행 일정 제목을 입력해주세요."
                onChange={(e) => handleInputChange(e)}
              />
              <div className="input-container">
                <fieldset className="input-data-container">
                  <legend>여행 시작일</legend>
                  <input className="input-date" type="date" onChange={(e) => setStartDate(new Date(e.target.value))} />
                </fieldset>
                <fieldset className="input-data-container">
                  <legend>여행 종료일</legend>
                  <input className="input-date" type="date" onChange={(e) => setEndDate(new Date(e.target.value))} />
                </fieldset>
              </div>
            </div>

            {/* 장소 선택/신규 장소 등록 탭 */}
            <PlaceTabs>
              <PlaceTabContent title="장소 선택">
                <SelectPlace />
              </PlaceTabContent>
              <PlaceTabContent title="신규 장소 등록">
                <AddNewPlace />
              </PlaceTabContent>
            </PlaceTabs>

            {/* 추가한 장소/내가 찜한 장소 탭 */}
            <PlaceTabs>
              <PlaceTabContent title="추가한 장소">
                <AddPlaceSchedule buttonTitle={<Icons.TrashIcon />} />
              </PlaceTabContent>
              <PlaceTabContent title="내가 찜한 장소">
                <BookmarkPlace buttonTitle={"추가"} />
              </PlaceTabContent>
            </PlaceTabs>
          </div>
          <div className="day-schedule">
            <Button
              className="schedule-btn"
              $size="medium"
              $scheme="primary"
              $radius="default"
              onClick={handleSchedule}
            >
              일정 등록
            </Button>
            <div className="days">
              {duration > 0 && dayPlaces.map((data, i) => <DaySchedule key={i} dayIdx={i} schedulePlaces={data} />)}
            </div>
          </div>
        </div>
      </SchedulePageStyle>
    </DragDropContext>
  );
};

const SchedulePageStyle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
  width: 100%;
  height: 100%;

  user-select: none; /* 모든 요소의 사용자 선택 비활성화 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  -webkit-user-select: none; /* Chrome, Safari, Opera */

  .map {
    height: 100%;
    width: 50%;
    min-height: 45vh;
  }

  .trip-schedule-container {
    padding: 0 0.8rem;
    width: 50%;
    display: flex;
    justify-content: space-between;
    gap: 1em;
    flex-wrap: wrap;
    flex: 1;

    .place-select-form,
    .day-schedule {
      min-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
      flex: 1;

      .schedule-btn {
        font-weight: 600;
        align-self: end;
      }
    }

    .days {
      width: 100%;
      max-height: 78vh;
      overflow-y: auto;

      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-data {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;

      .input-title,
      .input-date {
        flex: 1;
        width: 100%;
        border-radius: ${({ theme }) => theme.borderRadius.default};
        border: 1px solid ${({ theme }) => theme.color.borderGray};
        font-size: ${({ theme }) => theme.fontSize.small};
        padding: 6px 10px;
        color: ${({ theme }) => theme.color.black};

        &:focus {
          outline: none;
          border: 1px solid ${({ theme }) => theme.color.primary};
        }
      }
    }

    .input-container {
      display: flex;
      width: 100%;
      padding: 0.2rem;
      gap: 0.2rem;
      border-radius: ${({ theme }) => theme.borderRadius.default};
      border: 1px solid ${({ theme }) => theme.color.borderGray};

      .input-data-container {
        border: none;
        padding: 0;
        width: 50%;
      }

      legend {
        font-size: ${({ theme }) => theme.fontSize.xsmall};
        font-weight: 600;
        text-align: center;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .map {
      width: 100%;
    }

    .trip-schedule-container {
      width: 100%;
      flex-direction: column;
      align-items: center;

      .place-select-form,
      .day-schedule {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
  @media (max-width: 1379px) {
    .trip-schedule-container .days {
      max-height: 40vh;
    }
  }
`;

export default SchedulePage;
