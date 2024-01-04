import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import { useGeolocation } from "../hooks/UseGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  // const flagemojiToPNG = (flag) => {
  //   var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
  //     .map((char) => String.fromCharCode(char - 127397).toLowerCase())
  //     .join("");
  //   return (
  //     <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  //   );
  // };
  const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join("");
    return (
      <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
  };

  // const flagemojiToPNG = (flag) => {
  //   if (!flag || typeof flag !== "string") {
  //     // Handle the case where flag is undefined, null, or not a valid string
  //     return null; // or provide a default image or placeholder
  //   }

  //   var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
  //     .map((char) => String.fromCharCode(char - 127397).toLowerCase())
  //     .join("");
  //   return (
  //     <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  //   );
  // };

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={
              city.position ? [city.position.lat, city.position.lng] : [0, 0]
            }
            key={city.id}
          >
            <Popup>
              <span>{flagemojiToPNG(city.emoji)}</span>{" "}
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
