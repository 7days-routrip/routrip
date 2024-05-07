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
  placeImg?: string; // 구글 placePhoto api  -> buffer 형태로 전달받음 -> base64 인코딩해서 저장
}

// 장소 찜 컴포넌트에서 사용할 타입
export interface PlaceDetails extends Place {
  tel: string;
  openingHours: string[];
  siteUrl: string;
}
