import React, { useState } from "react";
import styles from "./Locations.module.css";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "820px",
};
const location = {
  lat: 43.3169,
  lng: 21.8955,
};
const mapOptions: google.maps.MapOptions = {
  zoomControl: true, // оставить кнопки масштабирования
  fullscreenControl: false, // убрать кнопку полноэкранного режима
  mapTypeControl: false, // убрать переключение карты/спутника/рельефа
  streetViewControl: false, // убрать обзор улиц
  scaleControl: false, // убрать линейку масштаба
  rotateControl: false, // убрать управление поворотом
  mapId: "4e4c4bd27969e1db7e6be3af",
  disableDefaultUI: true,
};
type LocationType = {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
};

const locations: LocationType[] = [
  {
    id: "1",
    name: "Chair Park",
    position: { lat: 43.31508, lng: 21.905176 },
  },
  {
    id: "2",
    name: "Clinical Center",
    position: { lat: 43.314634, lng: 21.938521 },
  },
  {
    id: "3",
    name: "Shoping Center",
    position: { lat: 43.32476305519067, lng: 21.910750503501117 },
  },
  {
    id: "4",
    name: "ST. SAVA'S PARK",
    position: { lat: 43.32053743745635, lng: 21.918968273027748 },
  },
  {
    id: "5",
    name: "KING MILAN SQ.",
    position: { lat: 43.321495, lng: 21.895797 },
  },
  {
    id: "6",
    name: "KING ALEXANDER SQ.",
    position: { lat: 43.3181201662413, lng: 21.891076593257026 },
  },
  {
    id: "7",
    name: "FORTRESS",
    position: { lat: 43.325683213803224, lng: 21.895901169471315 },
  },
  {
    id: "8",
    name: "FACULTY OF SPORTS",
    position: { lat: 43.311951020434314, lng: 21.87235818616822 },
  },
];
const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  return (
    <section className={styles.location}>
      <div className={styles.location__body}>
        <div className={styles.location_name_block}>
          <p className={styles.location__name}>Locations</p>
        </div>
        <div className={styles.location__map__content}>
          <ul className={styles.map__navigation}>
            {locations.map((item, index) => (
              <li key={index} className={styles.location__item}>
                {item.name}
              </li>
            ))}
          </ul>
          <div className={styles.map}>
            <LoadScript
              googleMapsApiKey="AIzaSyBzEJ8MpD8Ssv_bu9h3aEg5m0iJq2MO1ZY"
              mapIds={["4e4c4bd27969e1db7e6be3af"]}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={15}
                center={location}
                options={mapOptions}
              >
                {locations.map((loc) => (
                  <Marker
                    key={loc.id}
                    position={loc.position}
                    title={loc.name}
                  />
                ))}
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.position}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div>{selectedLocation.name}</div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
