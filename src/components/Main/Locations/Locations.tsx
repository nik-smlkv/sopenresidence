import { useEffect, useRef, useState } from "react";
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
    position: { lat: 43.3152295, lng: 21.9039461 },
  },
  {
    id: "2",
    name: "Clinical Center",
    icon: "./images/hospital.svg",
    position: { lat: 43.315688, lng: 21.912405 },
  },
  {
    id: "3",
    name: "Shoping Center",
    icon: "./images/shop.svg",
    position: { lat: 43.3244918, lng: 21.9062526 },
  },
  {
    id: "4",
    name: "St. Sava's Park",
    icon: "./images/savapark.svg",
    position: { lat: 43.3202859, lng: 21.9167214 },
  },
  {
    id: "5",
    name: "King Milan sq.",
    icon: "./images/milan-sq.svg",
    position: { lat: 43.32144, lng: 21.8908982 },
  },
  {
    id: "6",
    name: "King Alexander sq.",
    icon: "./images/alexander.svg",
    position: { lat: 43.3181301, lng: 21.8883566 },
  },
  {
    id: "7",
    name: "Fortress",
    icon: "./images/fortress.svg",
    position: { lat: 43.3241346, lng: 21.901171 },
  },
  {
    id: "8",
    name: "Faculty of sports",
    icon: "./images/sport.svg",
    position: { lat: 43.3082365, lng: 21.8850973 },
  },
  {
    id: "9",
    name: "",
    icon: "./images/sopen.svg",
    position: { lat: 43.310192, lng: 21.907592 },
  },
];
export const useIsMobile = (breakpoint: number = 1000): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};
const Locations = () => {
  const isMobile = useIsMobile(1000);

  const [openIndex, setOpenIndex] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    locations[0]
  );
  const [arrowOffset, setArrowOffset] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const ulRef = useRef<HTMLUListElement>(null);

  const handleClickLocation = (index: number) => {
    setOpenIndex(index);
    setSelectedLocation(locations[index]);
    setIsDropdownOpen(false);

    const li = ulRef.current?.querySelectorAll("li")[index];
    if (li) setArrowOffset(li.offsetTop);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <section
      className={styles.location}
      id="location"
      data-section-id="dark-green"
    >
      <div className={styles.location__body}>
        <div className={styles.location_name_block}>
          <p
            className={`section_name ${styles.location__name}`}
            data-split="block-name"
          >
            Locations
          </p>
        </div>

        <div className={styles.location__map__content}>
          {isMobile ? (
            <div className={styles.select_wrapper}>
              <div className={styles.selected_item} onClick={toggleDropdown}>
                {locations[openIndex]?.name || "Select location"}
                <span
                  className={`${styles.list__arrow} ${
                    isDropdownOpen ? "active" : ""
                  }`}
                >
                  <img src="./images/equip-arrow.svg" alt="" />
                </span>
              </div>
              <div
                className={styles.map__navigation__content}
                style={{
                  maxHeight: isDropdownOpen ? "100%" : "0px",
                }}
              >
                <ul className={styles.map__navigation}>
                  {locations.map((item, index) => (
                    <li
                      key={item.id}
                      className={`${styles.location__item} ${
                        openIndex === index ? styles.none : ""
                      }`}
                      onClick={() => handleClickLocation(index)}
                    >
                      <span>
                        <img src={`${item.icon}`} alt="" />
                      </span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <ul className={styles.map__navigation} ref={ulRef}>
              <div className={styles.arrow} style={{ top: arrowOffset }} />
              {locations.map((item, index) => (
                <li
                  key={item.id}
                  className={`${styles.location__item} ${
                    openIndex === index ? styles.active : ""
                  }`}
                  onClick={() => handleClickLocation(index)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.map}>
            <LoadScript
              googleMapsApiKey="AIzaSyBzEJ8MpD8Ssv_bu9h3aEg5m0iJq2MO1ZY"
              mapIds={["4e4c4bd27969e1db7e6be3af"]}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={15}
                center={selectedLocation?.position || center}
                options={mapOptions}
              >
                {locations.map((loc) => (
                  <Marker
                    key={loc.id}
                    position={loc.position}
                    title={loc.name}
                    icon={{ url: loc.icon }}
                  />
                ))}
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.position}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className={styles.infoWindow}>
                      {selectedLocation.name}
                    </div>
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
