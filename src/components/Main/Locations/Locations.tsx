import React, { useRef, useState } from "react";
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
  icon: string;
  position: {
    lat: number;
    lng: number;
  };
};
const center = {
  lat: 43.311492,
  lng: 21.905292,
};

const locations: LocationType[] = [
  {
    id: "1",
    name: "Chair Park",
    icon: "./images/park.svg",
    position: { lat: 43.31508, lng: 21.905176 },
  },
  {
    id: "2",
    name: "Clinical Center",
    icon: "./images/hospital.svg",
    position: { lat: 43.314634, lng: 21.938521 },
  },
  {
    id: "3",
    name: "Shoping Center",
    icon: "./images/shop.svg",
    position: { lat: 43.32476305519067, lng: 21.910750503501117 },
  },
  {
    id: "4",
    name: "St. Sava's Park",
    icon: "./images/sava's-park.svg",
    position: { lat: 43.32053743745635, lng: 21.918968273027748 },
  },
  {
    id: "5",
    name: "King Milan sq.",
    icon: "./images/milan-sq.svg",
    position: { lat: 43.321495, lng: 21.895797 },
  },
  {
    id: "6",
    name: "King Alexander sq.",
    icon: "./images/alexander-sq.svg",
    position: { lat: 43.3181201662413, lng: 21.891076593257026 },
  },
  {
    id: "7",
    name: "Fortress",
    icon: "./images/alexander-sq.svg",
    position: { lat: 43.325683213803224, lng: 21.895901169471315 },
  },
  {
    id: "8",
    name: "Faculty of sports",
    icon: "./images/alexander-sq.svg",
    position: { lat: 43.311951020434314, lng: 21.87235818616822 },
  },
  {
    id: "9",
    name: "",
    icon: "./images/sopen.svg",
    position: { lat: 43.311492, lng: 21.905292 },
  },
];

const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    locations[0]
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [arrowOffset, setArrowOffset] = useState(0);
  const ulRef = useRef<HTMLUListElement>(null);

  const handleClickLocation = (index: number) => {
    setOpenIndex(index);
    setSelectedLocation(locations[index]);
    const activeEl = ulRef.current?.querySelectorAll("li")[index];
    if (activeEl) {
      setArrowOffset(activeEl.offsetTop);
    }
  };
  return (
    <section className={styles.location} id="location">
      <div className={styles.location__body}>
        <div className={styles.location_name_block}>
          <p className={styles.location__name} data-split="block-name">Locations</p>
        </div>
        <div className={styles.location__map__content}>
          <ul className={styles.map__navigation}>
            <div className={styles.arrow} style={{ top: arrowOffset }} />
            {locations.map((item, index) => (
              <li
                key={index}
                className={`${styles.location__item} ${
                  openIndex === index ? styles.active : ""
                }`}
                onClick={() => handleClickLocation(index)}
              >
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
                center={center}
                options={mapOptions}
              >
                {locations.map((loc) => (
                  <Marker
                    key={loc.id}
                    position={loc.position}
                    title={loc.name}
                    icon={{
                      url: loc.icon,
                    }}
                  />
                ))}
                {selectedLocation && (
                  <div className={styles.location__window}>
                    <InfoWindow
                      position={selectedLocation.position}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div className={styles.infoWindow}>
                        <div>{selectedLocation.name}</div>
                      </div>
                    </InfoWindow>
                  </div>
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
