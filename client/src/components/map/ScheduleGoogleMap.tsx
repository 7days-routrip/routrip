import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Loading from "@/components/common/Loading";
import { useMapStore } from "@/stores/mapStore";
import { SelectedPlace, usePlaceStore } from "@/stores/addPlaceStore";
import InfoWindowBox from "./InfoWindowBox";
import dayPlacePin from "/assets/images/pin-day-place.png";
import addPlacePin from "/assets/images/pin-add-place.png";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";

const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY || "";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 20,
  lng: 90,
};

const ScheduleGoogleMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    language: "ko",
  });
  const { googleMap, mapCenter, setCenter, setGoogleMap } = useMapStore();
  const { places: addPlaces } = usePlaceStore(); // 실제로 사용할 전역 상태. 임시로 mockRealPlaceData를 사용
  const { markerType, dayIndex } = useShowMarkerTypeStore();
  const { dayPlaces } = useDayPlaceStore();
  const [clickMarker, setClickMarker] = useState<SelectedPlace | null>(null);

  const handleChanged = useCallback(() => {
    if (googleMap && googleMap.getCenter()) {
      setCenter({
        lat: googleMap.getCenter()?.lat() || center.lat,
        lng: googleMap.getCenter()?.lng() || center.lng,
      });
      console.log(googleMap.getCenter()?.lat(), googleMap.getCenter()?.lng());
    }
  }, [googleMap, center]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setGoogleMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setGoogleMap(null);
  }, []);

  const onclickMarker = (place: SelectedPlace) => {
    setClickMarker(place);

    if (googleMap) {
      googleMap.panTo(place.location); // 1. 마커 위치로 지도 이동
      const currentZoom = googleMap.getZoom() || 6;
      const targetZoom = Math.max(currentZoom, 12);
      googleMap.setZoom(targetZoom); // 2. 줌 비율 조정(확대)
    }
  };

  const onClickMap = () => {
    if (clickMarker) {
      setClickMarker(null);
    }
  };

  useEffect(() => {
    if (markerType === "add" && clickMarker) {
      const isExisted = addPlaces.find((place) => place.uuid === clickMarker.uuid);

      if (!isExisted) setClickMarker(null);
    } else if (markerType === "day" && clickMarker) {
      const isExisted = dayPlaces[dayIndex as number].find((place) => place.uuid === clickMarker.uuid);

      if (!isExisted) setClickMarker(null);
    }
  }, [addPlaces, dayPlaces, markerType, dayIndex]);

  useEffect(() => {
    // 지도에 표시할 마커가 전부 보이도록 지도 경계선을 계산
    if (!googleMap) return;

    const bounds = new google.maps.LatLngBounds();

    if (markerType === "add") {
      if (addPlaces.length === 0) return;
      addPlaces.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));
      });
    } else if (markerType === "day") {
      const dayPlaceMarkers = dayPlaces[dayIndex as number];
      if (dayPlaceMarkers.length === 0) return;
      dayPlaceMarkers.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));
      });
    }

    googleMap.fitBounds(bounds);
  }, [addPlaces, dayPlaces, markerType, dayIndex, googleMap]);

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
      {markerType === "add" &&
        addPlaces.map((place) => (
          <div key={place.uuid}>
            <MarkerF
              position={{ lat: place.location.lat, lng: place.location.lng }}
              icon={{
                url: addPlacePin,
                scaledSize: new window.google.maps.Size(38, 38),
              }}
              onClick={() => onclickMarker(place)}
            />
            {clickMarker && (
              <InfoWindowF
                position={{ lat: clickMarker.location.lat, lng: clickMarker.location.lng }}
                options={{ pixelOffset: new window.google.maps.Size(0, -40), maxWidth: 200 }}
                onCloseClick={() => setClickMarker(null)}
              >
                <InfoWindowBox data={clickMarker} />
              </InfoWindowF>
            )}
          </div>
        ))}

      {markerType === "day" &&
        dayPlaces[dayIndex as number].map((place) => (
          <div key={place.uuid}>
            <MarkerF
              position={{ lat: place.location.lat, lng: place.location.lng }}
              icon={{
                url: dayPlacePin,
                scaledSize: new window.google.maps.Size(38, 38),
              }}
              onClick={() => onclickMarker(place)}
            />
            {clickMarker && (
              <InfoWindowF
                position={{ lat: clickMarker.location.lat, lng: clickMarker.location.lng }}
                options={{ pixelOffset: new window.google.maps.Size(0, -40), maxWidth: 200 }}
                onCloseClick={() => setClickMarker(null)}
              >
                <InfoWindowBox data={clickMarker} />
              </InfoWindowF>
            )}
          </div>
        ))}
    </GoogleMap>
  ) : (
    <Loading />
  );
};

export default React.memo(ScheduleGoogleMap);
