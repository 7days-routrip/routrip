import styled from "styled-components";
import PlaceList from "./PlaceList";
import { usePlaceStore } from "@/stores/addPlaceStore";

interface Props {
  buttonTitle: React.ReactNode;
}

const AddPlaceSchedule = ({ buttonTitle }: Props) => {
  const selectedPlaces = usePlaceStore((state) => state.places);

  return (
    <AddPlaceScheduleStyle>
      <PlaceList place={selectedPlaces} buttonTitle={buttonTitle} isDragDrop={true} />
    </AddPlaceScheduleStyle>
  );
};

const AddPlaceScheduleStyle = styled.div``;

export default AddPlaceSchedule;
