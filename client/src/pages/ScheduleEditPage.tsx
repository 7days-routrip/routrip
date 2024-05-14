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
import { useParams } from "react-router-dom";
import { convertDateToISOString } from "@/utils/convertDataType";
import { SchedulePageStyle } from "./SchedulePage";
import { useScheduleDetails } from "@/hooks/useScheduleDetails";
import Loading from "@/components/common/Loading";
import { onDragDropEnd } from "@/utils/onDragDropEnd";
import { useScheduleEdit } from "@/hooks/useScheduleEdit";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";

const ScheduleEditPage = () => {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { dayPlaces, setDayPlaces } = useDayPlaceStore();
  const { addPlaces, setAddPlaces } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();

  const { id } = useParams();
  const { scheduleDetailData, isScheduleDetailsLoading } = useScheduleDetails(id);
  const { editScheduleMutate } = useScheduleEdit();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSchedule = () => {
    if (!id) return;

    if (title && scheduleDetailData) {
      const editStartDate = startDate ? startDate : new Date(scheduleDetailData.startDate);
      const editEndDate = endDate ? endDate : new Date(scheduleDetailData.endDate);

      if (editStartDate > editEndDate) {
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo");
        return;
      }

      console.log(title, editStartDate, editEndDate, dayPlaces);

      // 일정 수정 요청
      editScheduleMutate({ id, title, startDate: editStartDate, endDate: editEndDate, allDaysPlaces: dayPlaces });
    } else {
      showAlert("여행 제목 또는 여행 일자는\n반드시 작성하셔야 합니다.", "logo");
    }
  };

  const onDragEnd = (result: DropResult) => {
    onDragDropEnd({ result, dayPlaces, addPlaces, setDayPlaces, setAddPlaces });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (scheduleDetailData) {
      setDuration(getDuration(new Date(scheduleDetailData.startDate), new Date(scheduleDetailData.endDate)));
      setTitle(scheduleDetailData.title);
    }
  }, [scheduleDetailData]);

  useEffect(() => {
    if (!scheduleDetailData || (!startDate && !endDate)) return;

    if (!startDate && endDate) setStartDate(new Date(scheduleDetailData.startDate));
    else if (startDate && !endDate) setEndDate(new Date(scheduleDetailData.endDate));

    if (startDate && endDate) {
      if (startDate > endDate) {
        console.log(startDate, endDate, dayPlaces, addPlaces);
        // 시작일이 종료일보다 이후인 경우 => 날짜 잘못 선택한 경우
        showAlert("여행 시작일 또는 도착일을 잘못 입력했어요.\n여행 일자를 다시 선택해주세요.", "logo", () => {
          if (dayPlaces.flat().length > 0) {
            const updatedSelectedPlaces = [...dayPlaces.flat(), ...addPlaces];
            useAddPlaceStore.setState({ addPlaces: updatedSelectedPlaces });
          }

          setMarkerType("add");
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
  }, [startDate, endDate, scheduleDetailData]);

  if (!scheduleDetailData || isScheduleDetailsLoading) return <Loading isFull={true} />;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScheduleEditPageStyle>
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
                value={title}
                onChange={(e) => handleInputChange(e)}
              />
              <div className="input-container">
                <fieldset className="input-data-container">
                  <legend>여행 시작일</legend>
                  <input
                    className="input-date"
                    type="date"
                    value={
                      startDate
                        ? convertDateToISOString(startDate.toISOString() as string)
                        : convertDateToISOString(scheduleDetailData.startDate)
                    }
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                  />
                </fieldset>
                <fieldset className="input-data-container">
                  <legend>여행 종료일</legend>
                  <input
                    className="input-date"
                    type="date"
                    value={
                      endDate
                        ? convertDateToISOString(endDate.toISOString() as string)
                        : convertDateToISOString(scheduleDetailData.endDate)
                    }
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                  />
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
              수정 완료
            </Button>
            <div className="days">
              {duration > 0 &&
                dayPlaces.map((data, i) => <DaySchedule key={i} dayIdx={i} schedulePlaces={data} isDragDrop={true} />)}
            </div>
          </div>
        </div>
      </ScheduleEditPageStyle>
    </DragDropContext>
  );
};

const ScheduleEditPageStyle = styled(SchedulePageStyle)``;

export default ScheduleEditPage;
