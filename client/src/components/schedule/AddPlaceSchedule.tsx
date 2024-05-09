import styled from "styled-components";
import PlaceList from "./PlaceList";
import { useAddPlaceStore } from "@/stores/addPlaceStore";

interface Props {
  buttonTitle: React.ReactNode;
}

const AddPlaceSchedule = ({ buttonTitle }: Props) => {
  const selectedPlaces = useAddPlaceStore((state) => state.addPlaces);

  return (
    <AddPlaceScheduleStyle>
      <PlaceList place={selectedPlaces} buttonTitle={buttonTitle} isDragDrop={true} />
    </AddPlaceScheduleStyle>
  );
};

const AddPlaceScheduleStyle = styled.div``;

export default AddPlaceSchedule;
