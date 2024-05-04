import styled from "styled-components";
import PlaceItem from "./PlaceItem";
import { SelectedPlace } from "@/stores/placeStore";
import { Place } from "@/models/place.model";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface Props {
  place: SelectedPlace[] | SelectedPlace | Place[] | Place;
  buttonTitle: React.ReactNode; // string 또는 삭제 아이콘
  isDragDrop?: boolean;
}

const PlaceList = ({ place, buttonTitle, isDragDrop = false }: Props) => {
  const places: (SelectedPlace | Place)[] = Array.isArray(place) ? place : [place];

  if (isDragDrop) {
    return (
      <Droppable droppableId="add-places">
        {(provided) => (
          <PlaceListStyle ref={provided.innerRef} {...provided.droppableProps}>
            {places.map((data, i) => (
              <Draggable draggableId={(data as SelectedPlace).uuid} index={i} key={(data as SelectedPlace).uuid}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <PlaceItem data={data} buttonTitle={buttonTitle} isActive={snapshot.isDragging ? true : false} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </PlaceListStyle>
        )}
      </Droppable>
    );
  }

  return (
    <PlaceListStyle>
      {places.map((data, i) => (
        <PlaceItem key={i} data={data} buttonTitle={buttonTitle} />
      ))}
    </PlaceListStyle>
  );
};

const PlaceListStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin: 0.5rem 0;
  width: 100%;
`;

export default PlaceList;
