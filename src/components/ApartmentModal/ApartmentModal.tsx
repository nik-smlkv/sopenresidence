import { useState } from "react";
import styles from "./ApartmentModal.module.css";

import { apartmentTypes } from "../FloorPlan/apartmentTypes";

const ApartmentModal = ({
  apartment,
  onClose,
}: {
  apartment: any;
  onClose: () => void;
}) => {
  const [viewMode, setViewMode] = useState<"plan" | "3d">("plan");
  if (!apartment) return null;
  const handleViewChange = (mode: "plan" | "3d") => {
    setViewMode(mode);
  };

  const matchedTip = apartmentTypes.find((tipObj) =>
    tipObj.apartments.includes(apartment.id)
  );
  const imagePath =
    viewMode === "3d"
      ? matchedTip?.imageObject || ""
      : `../images/flats/${apartment.id.slice(0, 1)}/${apartment.floor} этаж/${
          apartment.id
        }.jpg`;

  return (
    <div
      className={styles.modal_content}
      onClick={(e) => {
        e.stopPropagation();
        onClose;
      }}
    >
      <button className={styles.close_btn} onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M21.5 11H1.5M1.5 11L11.803 1M1.5 11L11.803 21"
            stroke="#1C2F24"
            stroke-width="1.5"
          />
        </svg>
        <span>Back</span>
      </button>
      <div className={styles.apart_body}>
        <div className={styles.apart_block_info}>
          <h2 className={styles.apart_name}>{apartment.id}</h2>
          <div className={styles.apart_info_content}>
            <div className={styles.apart_info_txt}>
              <span>Area</span>
              <p>{apartment.area} m²</p>
            </div>
            <div className={styles.apart_info_txt}>
              <span>Floor</span>
              <p>{apartment.floor}</p>
            </div>
            <div className={styles.apart_info_txt}>
              <span>Builduing wind</span>
              <p>Section {apartment.id.slice(0, 1)}</p>
            </div>
          </div>
          <div className={styles.apart_meter_info}>
            <p className={styles.apart_count_room}>
              {matchedTip?.room || "Apartment"}
            </p>
            <ol className={styles.apart_meter_list}>
              {matchedTip?.layout &&
                Object.entries(matchedTip.layout).map(([key, value], index) => (
                  <li key={key} className={styles.apart_meter_item}>
                    <span>{index + 1}</span>
                    <div className={styles.apart_meter_item_txt}>
                      <span>{key.replace(/([A-Z])/g, " $1")}</span>
                      <span>{value} m²</span>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
          <div
            className={styles.about__apart_btn}
            onClick={() => {
              const target = document.querySelector('[data-id="form"]');
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            <span>price upon request</span>
          </div>
        </div>
        <div className={styles.plan_view_content}>
          <div className={styles.apartments_filter_view}>
            <ul className={styles.apartment_view_list}>
              <li
                className={`${styles.view_item_grid} ${
                  viewMode === "plan" ? "active" : ""
                }`}
                onClick={() => handleViewChange("plan")}
              >
                plan view
              </li>
              <li
                className={`${styles.view_item_floor} ${
                  viewMode === "3d" ? "active" : ""
                }`}
                onClick={() => handleViewChange("3d")}
              >
                3d view
              </li>
            </ul>
            <p className={styles.tips}>{matchedTip?.tip}</p>
          </div>
          <img
            key={viewMode}
            src={imagePath}
            alt={`${viewMode} view for ${matchedTip?.tip}`}
            className={`${styles.img_object} ${
              viewMode === "plan" ? "plan" : ""
            }`}
          />
          <div className={styles.location_content}>
            <img
              className={styles.img_loc_arrow}
              src="../images/arrow-loc.svg"
              alt=""
            />
            <img
              src={matchedTip?.imageLocation || ""}
              alt={`Plan for ${matchedTip?.tip}`}
              className={styles.img_location}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentModal;
