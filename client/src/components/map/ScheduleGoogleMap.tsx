import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Loading from "@/components/common/Loading";
import { useMapStore } from "@/stores/mapStore";
import { SelectedPlace, usePlaceStore } from "@/stores/addPlaceStore";
import InfoWindowBox from "./InfoWindowBox";
import dayPlacePin from "/assets/images/pin-day-place.png";
import addPlacePin from "/assets/images/pin-add-place.png";
import searchPin from "/assets/images/pin-search-place.png";
import bookmarkPin from "/assets/images/pin-bookmark-place.png";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { Place } from "@/models/place.model";
import { isExistedInPlaceType, isExistedInSelectedPlaceType } from "@/utils/checkIsExisted";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";

const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY || "";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 20,
  lng: 90,
};

const createMarkers = (
  places: (SelectedPlace | Place)[],
  onClickMarker: (place: SelectedPlace | Place) => void,
  iconUrl: string,
) => {
  return places.map((place, i) => (
    <div key={i}>
      <MarkerF
        position={{ lat: place.location.lat, lng: place.location.lng }}
        icon={{
          url: iconUrl,
          scaledSize: new window.google.maps.Size(38, 38),
        }}
        onClick={() => onClickMarker(place)}
      />
    </div>
  ));
};

const ScheduleGoogleMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    language: "ko",
  });

  const { googleMap, mapCenter, setCenter, setGoogleMap, updateMapBounds } = useMapStore();
  const { addPlaces } = usePlaceStore(); // 실제로 사용할 전역 상태. 임시로 mockRealPlaceData를 사용
  const { markerType, dayIndex } = useShowMarkerTypeStore();
  const { dayPlaces } = useDayPlaceStore();
  const { searchPlaces } = useSearchPlacesStore();
  const { nearPlaces } = useNearPlacesStore();
  const { bookmarkPlaces } = useBookmarkPlacesStore();
  const [clickMarker, setClickMarker] = useState<SelectedPlace | Place | null>(null);

  const handleChanged = useCallback(() => {
    if (googleMap && googleMap.getCenter()) {
      setCenter({
        lat: googleMap.getCenter()?.lat() || center.lat,
        lng: googleMap.getCenter()?.lng() || center.lng,
      });
      // console.log(googleMap.getCenter()?.lat(), googleMap.getCenter()?.lng());
    }
  }, [googleMap, center]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setGoogleMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setGoogleMap(null);
  }, []);

  const onclickMarker = (place: SelectedPlace | Place) => {
    setClickMarker(place);

    if (googleMap) {
      googleMap.panTo(place.location); // 1. 마커 위치로 지도 이동
      const currentZoom = googleMap.getZoom() || 6;
      // console.log(currentZoom);
      const targetZoom = Math.max(currentZoom, 15);
      googleMap.setZoom(targetZoom); // 2. 줌 비율 조정(확대)
    }
  };

  const onClickMap = () => {
    if (clickMarker) {
      setClickMarker(null);
    }
  };

  useEffect(() => {
    if (!clickMarker) return;

    if (markerType === "add" && "uuid" in clickMarker) {
      if (!isExistedInSelectedPlaceType(addPlaces, clickMarker.uuid)) setClickMarker(null);
    } else if (markerType === "day" && "uuid" in clickMarker) {
      if (!isExistedInSelectedPlaceType(dayPlaces[dayIndex as number], clickMarker.uuid)) setClickMarker(null);
    } else if (markerType === "searchApi" && clickMarker) {
      if (!isExistedInPlaceType(searchPlaces, clickMarker.id)) setClickMarker(null);
    } else if (markerType === "searchGoogle" && clickMarker) {
      if (!isExistedInPlaceType(nearPlaces, clickMarker.id)) setClickMarker(null);
    } else if (markerType === "bookmarkList" && clickMarker) {
      if (!isExistedInPlaceType(bookmarkPlaces, clickMarker.id)) setClickMarker(null);
    }
  }, [addPlaces, dayPlaces, markerType, dayIndex]);

  useEffect(() => {
    // 지도에 표시할 마커가 전부 보이도록 지도 경계선을 계산
    if (!googleMap) return;

    let placeArr;
    switch (markerType) {
      case "add":
        placeArr = addPlaces;
        break;
      case "day":
        placeArr = dayPlaces[dayIndex as number];
        break;
      case "searchApi":
        placeArr = searchPlaces;
        break;
      case "searchGoogle":
        placeArr = nearPlaces;
        break;
      case "bookmarkList":
        placeArr = bookmarkPlaces;
        break;
    }

    updateMapBounds(googleMap, placeArr);
  }, [addPlaces, dayPlaces, markerType, dayIndex, googleMap, searchPlaces, nearPlaces]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onDragEnd={handleChanged}
      onZoomChanged={handleChanged}
      onClick={onClickMap}
    >
      {/* 장소 아이템 개수만큼 마커 컴포넌트 생성 */}
      {markerType === "add" && createMarkers(addPlaces, onclickMarker, addPlacePin)}
      {markerType === "day" && createMarkers(dayPlaces[dayIndex as number], onclickMarker, dayPlacePin)}
      {markerType === "searchApi" && createMarkers(searchPlaces, onclickMarker, searchPin)}
      {markerType === "searchGoogle" && createMarkers(nearPlaces, onclickMarker, searchPin)}
      {markerType === "bookmarkList" && createMarkers(bookmarkPlaces, onclickMarker, bookmarkPin)}

      {clickMarker && (
        <InfoWindowF
          position={{ lat: clickMarker.location.lat, lng: clickMarker.location.lng }}
          options={{ pixelOffset: new window.google.maps.Size(0, -40), maxWidth: 200 }}
          onCloseClick={() => setClickMarker(null)}
        >
          <InfoWindowBox data={clickMarker} />
        </InfoWindowF>
      )}
    </GoogleMap>
  ) : (
    <Loading />
  );
};

export default React.memo(ScheduleGoogleMap);
