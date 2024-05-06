export interface LikePlace {
  placeId: string;
  placeName: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  tel: string;
  img?: string; // 구글 placePhoto api  -> buffer 형태로 전달받음 -> base64 인코딩해서 저장
}

export interface PlaceDetails extends Place {
  openingHours: string[];
  siteUrl: string;
}
