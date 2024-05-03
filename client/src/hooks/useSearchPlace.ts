import { Place } from "@/models/place.model";
import { useQuery } from "@tanstack/react-query";

const data: Place = {
  placeId: "0",
  placeName: "롯데 타워",
  address: "서울특별시 송파구 올림픽로 300",
  tel: "02-3213-5000",
};

const dataArr: Place[] = [
  {
    placeId: "0",
    placeName: "롯데 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "1",
    placeName: "도쿄 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "2",
    placeName: "도쿄 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "3",
    placeName: "도쿄 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
  {
    placeId: "4",
    placeName: "도쿄 타워",
    address: "서울특별시 송파구 올림픽로 300",
    tel: "02-3213-5000",
  },
];

export const useSearchPlace = (keyword: string) => {
  // const {data, isLoading} = useQuery({

  // })
  return { placeData: dataArr, isSearchLoading: false };
};
