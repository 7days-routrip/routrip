import { SelectedPlace } from "@/stores/addPlaceStore";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import PlaceItem from "./PlaceItem";
import Icons from "@/icons/icons";
import { useCallback } from "react";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useMapStore } from "@/stores/mapStore";

interface Props {
  dayIdx: number;
  schedulePlaces: SelectedPlace[];
  isDragDrop?: boolean;
}

const DaySchedule = ({ dayIdx, schedulePlaces, isDragDrop = false }: Props) => {
  const { setMarkerType } = useShowMarkerTypeStore();
  const { googleMap, updateMapBounds } = useMapStore();

  const handleOnClickDay = useCallback(() => {
    setMarkerType("day", dayIdx);
    updateMapBounds(googleMap, schedulePlaces);
  }, [dayIdx, schedulePlaces, googleMap]);

  if (isDragDrop) {
    return (
      <DayScheduleStyle>
        <div className="day-box" onClick={handleOnClickDay}>
          Day {dayIdx + 1}
        </div>
        <Droppable droppableId={`day-schedule-index${dayIdx}`}>
          {(provided) => (
            <div className="day-places-container" {...provided.droppableProps} ref={provided.innerRef}>
              {schedulePlaces.map((item, i) => (
                <Draggable key={item.uuid} draggableId={item.uuid.toString()} index={i}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <PlaceItem
                        data={item}
                        buttonTitle={<Icons.TrashIcon />}
                        isActive={snapshot.isDragging ? true : false}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DayScheduleStyle>
    );
  }

  return (
    <DayScheduleStyle>
      <div className="day-box" onClick={handleOnClickDay}>
        Day {dayIdx + 1}
      </div>
      <div className="day-places-container">
        {schedulePlaces.map((item) => (
          <PlaceItem key={item.uuid} data={item} buttonTitle={<Icons.TrashIcon />} disabled={true} />
        ))}
      </div>
    </DayScheduleStyle>
  );
};

const DayScheduleStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  .day-box {
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.color.primary};
    color: ${({ theme }) => theme.color.white};
    font-weight: 600;

    &:hover {
      opacity: 0.8;
    }
  }

  .day-places-container {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 0.5rem;
    min-height: 80px;
  }
`;

export default DaySchedule;
