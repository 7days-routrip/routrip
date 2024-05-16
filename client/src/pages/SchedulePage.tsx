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
import { SelectedPlace, useAddPlaceStore } from "@/stores/addPlaceStore";
import ScheduleGoogleMap from "@/components/map/ScheduleGoogleMap";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { Button } from "@/components/common/Button";
import { addNewSchedule } from "@/apis/schedule.api";
import { useNavigate } from "react-router-dom";
import { showConfirm } from "@/utils/showConfirm";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { onDragDropEnd } from "@/utils/onDragDropEnd";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";
import { useMapStore } from "@/stores/mapStore";

const SchedulePage = () => {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { dayPlaces, setDayPlaces } = useDayPlaceStore();
  const { addPlaces, setAddPlaces } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { setNearPlaces } = useNearPlacesStore();
  const { setSearchPlaces } = useSearchPlacesStore();
  const { setBookmarkPlaces } = useBookmarkPlacesStore();
  const { setSearchKeywordToServer, setSearchKeywordToGoogle } = useSearchKeywordStore();
  const { mapCenter, setCenter } = useMapStore();

  const navigate = useNavigate();

  const resetStore = () => {
    setCenter({ lat: 38, lng: 128 });
    setAddPlaces([]);
    setMarkerType("searchApi");
    setNearPlaces([]);
    setDayPlaces([[]]);
    setSearchPlaces([]);
    setBookmarkPlaces([]);
    setSearchKeywordToServer("");
    setSearchKeywordToGoogle("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSchedule = async () => {
    if (title && startDate && endDate) {
      if (startDate > endDate) {
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo");
        return;
      }

      // 일정 등록 요청
      await addNewSchedule({ title, startDate, endDate, allDaysPlaces: dayPlaces });

      showConfirm(
        "일정 등록이 완료되었습니다.\n등록된 일정 리스트를 확인하러 갈까요?",
        () => {
          navigate(`/mypage?tag=schedules`);
          resetStore();
        },
        () => {
          navigate("/");
          resetStore();
        },
      );

      return;
    }

    showAlert("여행 제목 또는 여행 일자는\n반드시 작성하셔야 합니다.", "logo");
  };

  const onDragEnd = (result: DropResult) => {
    onDragDropEnd({ result, dayPlaces, addPlaces, setDayPlaces, setAddPlaces });
  };

  useEffect(() => {
    // 새로고침 누를 시, confirm창 보이도록
    resetStore();
    console.log(mapCenter);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      resetStore();
    };
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo", () => {
          if (dayPlaces.flat().length > 0) {
            const updatedSelectedPlaces = [...dayPlaces.flat(), ...addPlaces];
            useAddPlaceStore.setState({ addPlaces: updatedSelectedPlaces });
          }

          setMarkerType("add"); // day 클릭한 상태에서 여행 일자를 잘못 선택할 경우 오류 발생 -> markerType을 "add"로 지정해줌으로써 버그 해결
          setDuration(0);
          setDayPlaces([[]]);
        });

        return;
      }

      if (dayPlaces.flat().length > 0) {
        const updatedSelectedPlaces = [...dayPlaces.flat(), ...addPlaces];
        useAddPlaceStore.setState({ addPlaces: updatedSelectedPlaces });
      }

      const due = getDuration(startDate, endDate);
      setDuration(due);

      const defaultPlaces: SelectedPlace[][] = Array.from({ length: due }, () => []);
      setDayPlaces(defaultPlaces);
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
              <div className="title-schedule-btn">
                <input
                  className="input-title"
                  type="text"
                  placeholder="여행 일정 제목을 입력해주세요."
                  onChange={(e) => handleInputChange(e)}
                />
                <Button
                  className="schedule-btn"
                  $size="medium"
                  $scheme="primary"
                  $radius="default"
                  onClick={handleSchedule}
                >
                  일정 등록
                </Button>
              </div>

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
            <div className="days">
              {duration > 0 &&
                dayPlaces.map((data, i) => <DaySchedule key={i} dayIdx={i} schedulePlaces={data} isDragDrop={true} />)}
            </div>
          </div>
        </div>
      </SchedulePageStyle>
    </DragDropContext>
  );
};

export const SchedulePageStyle = styled.div`
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

      .title-schedule-btn {
        display: flex;
        gap: 0.5rem;

        button {
          padding: 0.5rem 0.8rem;
        }
      }

      input::placeholder {
        font-size: ${({ theme }) => theme.fontSize.xsmall};
      }

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
