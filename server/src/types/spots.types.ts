interface PlaceDetailDTO {
  id: string;
  placeName: string;
  location: Location;
  address: string;
  siteUrl: string;
  tel: string;
  openingHours: string[];
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
}

export type { PlaceDetailDTO, Location, SearchPlaceDTO };
