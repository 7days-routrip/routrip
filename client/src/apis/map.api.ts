import { Location, Place, PlaceDetails } from "@/models/place.model";
import { showAlert } from "@/utils/showAlert";

export interface SearchNearByPlacesParams {
  keyword: string;
  location: Location;
  radius: number;
}

export const searchNearByPlaces = async (
  map: google.maps.Map | null,
  params: SearchNearByPlacesParams,
  setPlaces: (places: Place[]) => void,
) => {
  try {
    if (!map) {
      console.error("Map object is null");
      return null;
    }

    const { keyword, location, radius } = params;
    const { lat, lng } = location;

    //검색어 키워드를 이용한 주변 검색 요청
    const pyrmont = new google.maps.LatLng(lat, lng);
    const request = {
      location: pyrmont,
      radius,
      keyword,
    };

    const callback = (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus,
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const places: Place[] = results.map((res) => ({
          id: res.place_id || "",
          placeName: res.name || "",
          location: {
            lat: res.geometry?.location?.lat() || 0,
            lng: res.geometry?.location?.lng() || 0,
          },
          address: res.vicinity || "",
        }));

        setPlaces(places);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        showAlert("검색 결과가 없습니다.\n검색할 장소 주변으로 지도를 이동시키고 다시 검색해주세요.", "logo");
        return;
      } else {
        console.error("Places service request failed:", status);
      }
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  } catch (err: any) {
    throw err;
  }
};

export const getPlaceDetail = async (map: google.maps.Map | null, placeId: string) => {
  try {
    if (!map) {
      console.error("Map object is null");
      return null;
    }

    const request = {
      placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "geometry.location",
        "opening_hours",
        "photo",
        "website",
      ],
    };

    return new Promise<PlaceDetails>((resolve, reject) => {
      const callback = (
        results: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus,
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const placeDetailData: PlaceDetails = {
            id: placeId,
            placeName: results.name || "",
            location: {
              lat: results.geometry?.location?.lat() || 0,
              lng: results.geometry?.location?.lng() || 0,
            },
            address: results.formatted_address || "",
            tel: results.formatted_phone_number || "",
            openingHours: results.opening_hours?.weekday_text || [],
            siteUrl: results.website || "",
            placeImg: results.photos ? results.photos[0].getUrl() : "",
          };

          resolve(placeDetailData);
        } else {
          reject(new Error("Failed to fetch place details"));
        }
      };

      const service = new google.maps.places.PlacesService(map);
      service.getDetails(request, callback);
    });
  } catch (err: any) {
    throw err;
  }
};
