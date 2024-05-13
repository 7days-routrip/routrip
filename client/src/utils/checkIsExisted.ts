import { Place } from "@/models/place.model";
import { SelectedPlace } from "@/stores/addPlaceStore";

export const isExistedInSelectedPlaceType = (places: SelectedPlace[], clickMarkerUuId: string) => {
  return places.some((place) => place.uuid === clickMarkerUuId);
};

export const isExistedInPlaceType = (places: Place[], clickMarkerId: string) => {
  return places.some((place) => place.id === clickMarkerId);
};
