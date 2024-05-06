import React, { useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import Loading from "@/components/common/Loading";
import { useCenterStore } from "@/stores/mapStore";

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
  const { googleMap, mapCenter, setCenter, setGoogleMap } = useCenterStore();

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
    // setMap(null);
    setGoogleMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={2.4}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onDragEnd={handleChanged}
      onZoomChanged={handleChanged}
    >
      {/* Child components, such as markers, info windows, etc. */}
    </GoogleMap>
  ) : (
    <Loading />
  );
};

export default React.memo(ScheduleGoogleMap);
