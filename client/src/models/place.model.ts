// 일정 등록 페이지 - 장소 검색에서 사용할 타입
export interface Location {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  placeName: string;
  address: string;
  location: Location;
  placeImg?: string;
}

// 장소 찜 컴포넌트에서 사용할 타입
export interface PlaceDetails extends Place {
  tel: string;
  openingHours: string[];
  siteUrl: string;
  isPicked: boolean; // 장소 찜 했는지 여부
}
