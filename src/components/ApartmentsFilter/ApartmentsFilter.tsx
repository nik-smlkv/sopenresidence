import React, { useEffect, useState } from "react";
import { type Apartment } from "../../utils";
import styles from "./ApartmentsFilter.module.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
type Props = {
  apartments: Apartment[];
};

const ApartmentsFilter: React.FC<Props> = ({ apartments }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const [floorRange, setFloorRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 0]);
  const [viewMode, setViewMode] = useState<"grid" | "floor">("grid");
  const [activeLamela, setActiveLamela] = useState<string>("All");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sorted by increasing area");

  const options = [
    "Sorted by increasing area",
    "Sorted by increasing floor",
    "Sorted by increasing section",
  ];
  useEffect(() => {
    if (apartments.length > 0) {
      const floorValues = apartments.map((apt) => apt.floor);
      const areaValues = apartments.map((apt) => apt.area);

      setFloorRange([Math.min(...floorValues), Math.max(...floorValues)]);
      setAreaRange([Math.min(...areaValues), Math.max(...areaValues)]);
    }
  }, [apartments]);
  const floorValues = apartments.map((apt) => apt.floor);
  const minFloor = floorValues.length ? Math.min(...floorValues) : 0;
  const maxFloor = floorValues.length ? Math.max(...floorValues) : 0;
  const areaValues = apartments.map((apt) => apt.area);
  const minArea = areaValues.length ? Math.min(...areaValues) : 0;
  const maxArea = areaValues.length ? Math.max(...areaValues) : 0;
  const apartmentsLamela = Array.from(
    new Set(apartments.map((apt) => apt.lamela))
  ).sort();

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleLamelaClick = (lamela: string) => {
    setActiveLamela(lamela);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };
  const handleViewChange = (mode: "grid" | "floor") => {
    setViewMode(mode);
  };

  const visibleApartments = apartments.slice(0, visibleCount);
  const hasMore = visibleCount < apartments.length;

  if (apartments.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={styles.apartament__filter}>
      <div className={styles.apartments_filter_block}>
        <div className={styles.apartments_filter_view}>
          <ul className={styles.apartment_view_list}>
            <li
              className={`${styles.view_item_grid} ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => handleViewChange("grid")}
            >
              Grid view
            </li>
            <li
              className={`${styles.view_item_floor} ${
                viewMode === "floor" ? "active" : ""
              }`}
              onClick={() => handleViewChange("floor")}
            >
              Floor plan
            </li>
          </ul>
        </div>
        <div className={styles.apartments_filter_content}>
          <div className={styles.apartment_section}>
            <label className={styles.apartment_label}>Section</label>
            <ul className={styles.apartmet_section_list}>
              <li
                className={activeLamela === "All" ? "active" : ""}
                onClick={() => handleLamelaClick("All")}
              >
                All
              </li>
              {apartmentsLamela.map((lamela) => (
                <li
                  key={lamela}
                  className={activeLamela === lamela ? "active" : ""}
                  onClick={() => handleLamelaClick(lamela)}
                >
                  {lamela}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.apartment_floor}>
            <div className={styles.apartment_label_block}>
              <label className={styles.apartment_label}>Floor</label>
              <p>
                {floorRange[0]} — {floorRange[1]}
              </p>
            </div>
            <Slider
              range
              min={minFloor}
              max={maxFloor}
              value={floorRange}
              onChange={(value) => setFloorRange(value as [number, number])}
              allowCross={false}
              className="floor-slider"
            />
          </div>
          <div className={styles.apartment_area}>
            <div className={styles.apartment_label_block}>
              <label className={styles.apartment_label}>Area</label>
              <p>
                {areaRange[0]} — {areaRange[1]} m²
              </p>
            </div>
            <Slider
              range
              min={minArea}
              max={maxArea}
              value={areaRange}
              onChange={(value) => setAreaRange(value as [number, number])}
              allowCross={false}
              className="floor-slider"
            />
          </div>
          <button className={styles.filter_reset}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5689 6.52697L14.9503 5.90834C13.7786 4.73644 12.2292 4.01821 10.5778 3.88143C8.92629 3.74466 7.27985 4.1982 5.93138 5.16138C4.58291 6.12456 3.61987 7.5349 3.21362 9.14146C2.80737 10.748 2.98424 12.4466 3.71278 13.935C4.44132 15.4234 5.67427 16.6051 7.19226 17.2697C8.71024 17.9344 10.4148 18.039 12.0027 17.5649C13.5905 17.0908 14.9587 16.0688 15.8638 14.6806C16.7688 13.2925 17.1521 11.6283 16.9453 9.98409M15.5689 6.52697L11.8563 6.52784M15.5689 6.52697V2.81435"
                stroke="#1C2F24"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className={styles.reset_span_txt}>Reset</span>
          </button>
        </div>
      </div>
      <div className={styles.apartmets_list_block}>
        <div className={styles.dropdown}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.dropdownToggle}
          >
            {selected}
          </button>
          <div className={styles.sort_list_block}>
            <ul
              className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
            >
              {options.map((option) => (
                <li key={option} onClick={() => handleSelect(option)}>
                  {option}
                </li>
              ))}
            </ul>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M0.890625 1.51389L6.00174 6.625L11.1128 1.51389"
                stroke="#1C2F24"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <div className={styles.list}>
          <ul>
            {visibleApartments.map((apt) => (
              <li key={apt.id} className={styles.apart__card}>
                <div className={styles.apart__card_content}>
                  <div className={styles.apart__card_info}>
                    <p className={styles.info_name}>{`${
                      apt.id[0]
                    }.${apt.id.slice(1)}`}</p>
                    <div className={styles.info__card_descr}>
                      <p className={styles.info_area}>{apt.area} m²</p>
                      <p className={styles.info_floor}>{apt.floor} floor</p>
                    </div>
                  </div>
                  <div className={styles.card_img_block}>
                    <img
                      className={styles.card_img}
                      src={`./images/flats/${apt.id[0]}/${apt.floor} этаж/${apt.id}.jpg`}
                      alt="Flat card"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button className={styles.show_more_btn} onClick={handleShowMore}>
              <span>Show more</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApartmentsFilter;
