import React, { useCallback, useEffect } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Loading from "@/components/common/Loading";
import { useMapStore } from "@/stores/mapStore";
import { SelectedPlace, useAddPlaceStore } from "@/stores/addPlaceStore";
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
import { isExistedInPlace } from "@/utils/checkIsExisted";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";

const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY || "";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 38,
  lng: 128,
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
  const { addPlaces } = useAddPlaceStore();
  const { markerType, dayIndex, clickMarker, setClickMarker } = useShowMarkerTypeStore();
  const { dayPlaces } = useDayPlaceStore();
  const { searchPlaces } = useSearchPlacesStore();
  const { nearPlaces } = useNearPlacesStore();
  const { bookmarkPlaces } = useBookmarkPlacesStore();

  const getPlaceArr = () => {
    switch (markerType) {
      case "add":
        return addPlaces;
      case "day":
        return dayPlaces[dayIndex as number];
      case "searchApi":
        return searchPlaces;
      case "searchGoogle":
        return nearPlaces;
      case "bookmarkList":
        return bookmarkPlaces;
      default:
        return [];
    }
  };

  const handleChanged = useCallback(() => {
    if (googleMap) {
      setCenter({
        lat: googleMap.getCenter()?.lat() || center.lat,
        lng: googleMap.getCenter()?.lng() || center.lng,
      });
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
      const currentZoom = googleMap.getZoom() || 6;
      const targetZoom = Math.max(currentZoom, 12);
      googleMap.setZoom(targetZoom); // 1. 줌 비율 조정(확대)

      const bounds = googleMap.getBounds();
      if (bounds && !bounds.contains(place.location)) {
        googleMap.panTo(place.location); // 2. 마커 위치로 지도 이동
        const newCenter = { lat: place.location.lat, lng: place.location.lng };
        setCenter(newCenter);
      }
    }
  };

  const onClickMap = () => {
    if (clickMarker) {
      setClickMarker(null);
    }
  };

  useEffect(() => {
    if (!clickMarker) return;

    let targetId;
    switch (markerType) {
      case "add":
        targetId = "uuid" in clickMarker ? clickMarker.uuid : clickMarker.id;
        if (!isExistedInPlace(addPlaces, targetId)) setClickMarker(null);
        break;

      case "day":
        targetId = "uuid" in clickMarker ? clickMarker.uuid : clickMarker.id;
        if (!isExistedInPlace(dayPlaces[dayIndex as number], targetId)) setClickMarker(null);
        break;

      case "searchApi":
        if (!isExistedInPlace(searchPlaces, clickMarker.id)) setClickMarker(null);
        break;

      case "searchGoogle":
        if (!isExistedInPlace(nearPlaces, clickMarker.id)) setClickMarker(null);
        break;

      case "bookmarkList":
        if (!isExistedInPlace(bookmarkPlaces, clickMarker.id)) setClickMarker(null);
        break;

      default:
        break;
    }
  }, [addPlaces, dayPlaces, nearPlaces, searchPlaces, bookmarkPlaces, markerType, dayIndex, clickMarker]);

  useEffect(() => {
    // 지도에 표시할 마커가 전부 보이도록 지도 경계선을 계산
    if (!googleMap) return;

    updateMapBounds(googleMap, getPlaceArr());
  }, [addPlaces, dayPlaces, markerType, dayIndex, googleMap, searchPlaces, nearPlaces, bookmarkPlaces]);

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
