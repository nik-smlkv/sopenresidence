import { useEffect, useState } from "react";
import styles from "./ApartmentModal.module.css";

import { apartmentTypes } from "../FloorPlan/apartmentTypes";
import { useLang } from "../../hooks/useLang";

const ApartmentModal = ({
  apartment,
  onClose,
}: {
  apartment: any;
  onClose: () => void;
}) => {
  const [viewMode, setViewMode] = useState<"plan" | "3d">("plan");
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!apartment) return null;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!apartment) return null;
  const handleViewChange = (mode: "plan" | "3d") => {
    setViewMode(mode);
  };
  const { t, lang } = useLang();
  const matchedTip = apartmentTypes.find((tipObj) =>
    tipObj.apartments.includes(apartment.id)
  );
  if (!apartment || !matchedTip) return null;

  const translations: Record<string, string> = {
    "One-room apartment": "Jednosoban stan",
    "Two-room apartment": "Dvosoban stan",
    "Three-room apartment": "Trosoban stan",
    Hallway: t.t_hallway,
    Livingroom: t.t_living,
    Bathroom: t.t_bath,
    Bedroom: t.t_bedrom,
    Terrace: t.t_terace,
  };

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
        <span>{t.t_back_txt}</span>
      </button>
      <div className={styles.apart_body}>
        <div className={styles.apart_block_info}>
          <h2 className={styles.apart_name}>{apartment.id}</h2>
          <div className={styles.apart_info_content}>
            <div className={styles.apart_info_txt}>
              <span>{t.t_area_txt}</span>
              <p>{apartment.area} m²</p>
            </div>
            <div className={styles.apart_info_txt}>
              <span>{t.t_flor_txt}</span>
              <p>{apartment.floor}</p>
            </div>
            <div className={styles.apart_info_txt}>
              <span>{t.t_build_wing_txt}</span>
              <p>
                {t.t_lam_txt} {apartment.id.slice(0, 1)}
              </p>
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
                      <span>
                        {translations[key.replace(/([A-Z])/g, " $1").trim()] ||
                          key}
                      </span>
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
            <span>{t.t_pr_upon_txt}</span>
          </div>
        </div>
        <div className={styles.plan_view_content}>
          <div className={styles.apartments_filter_view}>
            <ul
              className={`${styles.apartment_view_list} ${
                lang === "srb" ? "view_srb" : ""
              }`}
            >
              <li
                className={`${styles.view_item_grid} ${
                  viewMode === "plan" ? "active" : ""
                }`}
                onClick={() => handleViewChange("plan")}
              >
                {t.t_plan_view_txt}
              </li>
              <li
                className={`${styles.view_item_floor} ${
                  viewMode === "3d" ? "active" : ""
                }`}
                onClick={() => handleViewChange("3d")}
              >
                {t.t_3d_view_txt}
              </li>
            </ul>
            <p className={styles.tips}>{matchedTip?.tip}</p>
          </div>
          <img
            key={viewMode}
            src={new URL(`${imagePath}`, import.meta.url).href}
            alt={`${viewMode} view for ${matchedTip?.tip}`}
            className={`${styles.img_object} ${
              viewMode === "plan" ? "plan" : ""
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
          />

          {!imgLoaded && <div className={styles.img_loader}>Loaded</div>}

          <div className={styles.location_content}>
            <img
              className={styles.img_loc_arrow}
              src={new URL("/images/arrow-loc.svg", import.meta.url).href}
              alt="arrow location"
            />
            <img
              src={
                new URL(`${matchedTip?.imageLocation || ""}`, import.meta.url)
                  .href
              }
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
