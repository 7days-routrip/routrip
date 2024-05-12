import { Place } from "@/models/place.model";
import { SelectedPlace } from "@/stores/addPlaceStore";

export const isExistedInPlace = (places: (Place | SelectedPlace)[], clickMarkerId: string) => {
  return places.some((place) => ("uuid" in place ? place.uuid === clickMarkerId : place.id === clickMarkerId));
};
