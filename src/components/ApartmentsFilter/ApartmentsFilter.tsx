import React, { useState } from "react";
import { type Apartment } from "../../utils";
import styles from "./ApartmentsFilter.module.css";

type Props = {
  apartments: Apartment[];
};

const ApartmentsFilter: React.FC<Props> = ({ apartments }) => {
  const [visibleCount, setVisibleCount] = useState(9);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const visibleApartments = apartments.slice(0, visibleCount);
  const hasMore = visibleCount < apartments.length;

  if (apartments.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={styles.apartament__filter}>
      <div className={styles.list}>
        <ul>
          {visibleApartments.map((apt) => (
            <li key={apt.id} className={styles.apart__card}>
              <div className={styles.apart__card_content}>
                <div className={styles.apart__card_info}>
                  <p className={styles.info_name}>{`${apt.id[0]}.${apt.id.slice(
                    1
                  )}`}</p>
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
    </section>
  );
};

export default ApartmentsFilter;
