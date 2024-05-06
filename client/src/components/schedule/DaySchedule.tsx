import { SelectedPlace } from "@/stores/addPlaceStore";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import PlaceItem from "./PlaceItem";
import Icons from "@/icons/icons";

interface Props {
  dayIdx: number;
  schedulePlaces: SelectedPlace[];
}

const DaySchedule = ({ dayIdx, schedulePlaces }: Props) => {
  const handleOnClickDay = () => {
    console.log(`Day${dayIdx + 1} 클릭`);
  };

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
