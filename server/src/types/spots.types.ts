interface PlaceDetailDTO {
  id: string;
  placeName: string;
  location: Location;
  address: string;
  siteUrl: string;
  tel: string;
  openingHours: string[];
  placeImg: string;
  isPicked: boolean;
}

interface Location {
  lat: number;
  lng: number;
}

interface SearchPlaceDTO {
  id: string;
  placeName: string;
  address: string;
  location: Location;
  placeImg: string;
}

export type { PlaceDetailDTO, Location, SearchPlaceDTO };
