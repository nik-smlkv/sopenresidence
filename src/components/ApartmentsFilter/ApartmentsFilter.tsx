import React, { useEffect, useRef, useState } from "react";
import { type Apartment } from "../../utils/utils";
import styles from "./ApartmentsFilter.module.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLang } from "../../hooks/useLang";

import { useNavigate } from "react-router-dom";
type Props = {
  apartments: Apartment[];
};

const ApartmentsFilter: React.FC<Props> = ({ apartments }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const [floorRange, setFloorRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 0]);

  const [activeLamela, setActiveLamela] = useState<string>("All");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [selected, setSelected] = useState(t.t_sort_area_txt);
  const options = [t.t_sort_area_txt, t.t_sort_flor_txt, t.t_sort_sect_txt];
  useEffect(() => {
    if (apartments.length > 0) {
      const floorValues = apartments.map((apt) => apt.floor);
      const areaValues = apartments.map((apt) => apt.area);
      setFloorRange([Math.min(...floorValues), Math.max(...floorValues)]);
      setAreaRange([Math.min(...areaValues), Math.max(...areaValues)]);
    }
  }, [apartments]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  const filteredApartments = apartments
    .filter((apt) =>
      activeLamela === "All" ? true : apt.lamela === activeLamela
    )
    .filter((apt) => apt.floor >= floorRange[0] && apt.floor <= floorRange[1])
    .filter((apt) => apt.area >= areaRange[0] && apt.area <= areaRange[1]);
  const sortedApartments = [...filteredApartments].sort((a, b) => {
    switch (selected) {
      case t.t_sort_area_txt:
        return a.area - b.area;
      case t.t_sort_flor_txt:
        return a.floor - b.floor;
      case t.t_sort_sect_txt:
        return a.lamela.localeCompare(b.lamela);
      default:
        return 0;
    }
  });
  const handleResetFilters = () => {
    setFloorRange([minFloor, maxFloor]);
    setAreaRange([minArea, maxArea]);
    setActiveLamela("All");
    setSelected(t.t_sort_area_txt);
    setVisibleCount(9);
  };
  const navigate = useNavigate();

  const handleFloorClick = (floorId: number) => {
    navigate(`/floor/${floorId}`);
  };

  const handleApartmentClick = (apt: Apartment) => {
    navigate(`/floor/${apt.floor}`, {
      state: { selectedApartment: apt },
    });
  };

  const visibleApartments = sortedApartments.slice(0, visibleCount);
  const hasMore = visibleCount < sortedApartments.length;

  if (apartments.length === 0) {
    return <div></div>;
  }

  return (
    <section className={styles.apartament__filter}>
      <div className={styles.apartments_filter_block}>
        <div className={styles.apartments_filter_view}>
          <button
            className={styles.view_item_floor}
            onClick={() => handleFloorClick(15)}
          >
            <span>{t.t_flor_plan_txt}</span>
          </button>
        </div>
        <div className={styles.apartments_filter_content}>
          <div className={styles.apartment_section}>
            <label className={styles.apartment_label}>{t.t_lam_txt}</label>
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
              <label className={styles.apartment_label}>{t.t_flor_txt}</label>
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
              <label className={styles.apartment_label}>{t.t_area_txt}</label>
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
          <button className={styles.filter_reset} onClick={handleResetFilters}>
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
            <span className={styles.reset_span_txt}>{t.t_reset_txt}</span>
          </button>
        </div>
      </div>
      <div className={styles.apartmets_list_block}>
        <>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.dropdownToggle}
            >
              {selected}
            </button>
            <div
              className={`${styles.sort_list_block} ${
                isOpen ? styles.open : ""
              } `}
            >
              <ul
                className={`${styles.dropdownMenu} ${
                  isOpen ? styles.open : ""
                }`}
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
                <li
                  key={apt.id}
                  className={styles.apart__card}
                  onClick={() => handleApartmentClick(apt)}
                >
                  <div className={styles.apart__card_content}>
                    <div className={styles.apart__card_info}>
                      <p className={styles.info_name}>{`${
                        apt.id[0]
                      }${apt.id.slice(1)}`}</p>
                      <div className={styles.info__card_descr}>
                        <p className={styles.info_area}>{apt.area} m²</p>
                        <p className={styles.info_floor}>
                          {apt.floor} {t.t_flor_txt}
                        </p>
                      </div>
                    </div>
                    <div className={styles.card_img_block}>
                      <img
                        className={styles.card_img}
                        src={`images/flats/${apt.id[0]}/${apt.floor} этаж/${apt.id}.jpg`}
                        alt="Flat card"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {hasMore && (
              <button className={styles.show_more_btn} onClick={handleShowMore}>
                <span>{t.t_show_more_txt}</span>
              </button>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default ApartmentsFilter;
