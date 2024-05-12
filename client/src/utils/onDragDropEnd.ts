import { DropResult } from "@hello-pangea/dnd";
import { SelectedPlace } from "@/stores/addPlaceStore";

interface Parameter {
  result: DropResult;
  dayPlaces: SelectedPlace[][];
  addPlaces: SelectedPlace[];
  setDayPlaces: (data: SelectedPlace[][]) => void;
  setAddPlaces: (data: SelectedPlace[]) => void;
}

export const onDragDropEnd = ({ result, dayPlaces, addPlaces, setDayPlaces, setAddPlaces }: Parameter) => {
  if (!result.destination) return;

  const { source, destination } = result;
  const destinationId = destination.droppableId === "add-places" ? -1 : Number(destination.droppableId.at(-1));
  const sourceId = source.droppableId === "add-places" ? -1 : Number(source.droppableId.at(-1));

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
    const movedItem = addPlaces[source.index];
    const updatedSourceArr = [...addPlaces];
    updatedSourceArr.splice(source.index, 1);
    updatedSourceArr.splice(destination.index, 0, movedItem);

    setAddPlaces(updatedSourceArr);
  } else {
    if (sourceId > -1) {
      // 출발지는 DaySchedule 컴포넌트 -> 도착지는 전역 상태 selectedPlaces
      const movedItem = dayPlaces[sourceId][source.index];
      const updatedSourceArr = [...dayPlaces[sourceId]];
      updatedSourceArr.splice(source.index, 1);

      let updatedDestinationArr = [...addPlaces];
      if (destinationId !== -1) {
        updatedDestinationArr = [...dayPlaces[destinationId]];
      }
      updatedDestinationArr.splice(destination.index, 0, movedItem);

      const updatedDayPerPlaces = [...dayPlaces];
      updatedDayPerPlaces[sourceId] = updatedSourceArr;

      setDayPlaces(updatedDayPerPlaces);
      setAddPlaces(updatedDestinationArr);
    } else {
      // 출발지는 전역 상태 selectedPlaces -> 도착지는 DaySchedule
      const movedItem = addPlaces[source.index];
      const updatedSourceArr = addPlaces.filter((_, index) => index !== source.index);

      let updatedDestinationArr = [...dayPlaces[destinationId]];
      updatedDestinationArr.splice(destination.index, 0, movedItem);

      const updatedDayPerPlaces = [...dayPlaces];
      updatedDayPerPlaces[destinationId] = updatedDestinationArr;

      setDayPlaces(updatedDayPerPlaces);
      setAddPlaces(updatedSourceArr);
    }
  }
};
