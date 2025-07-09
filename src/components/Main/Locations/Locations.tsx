import React from "react";
import styles from "./Locations.module.css";

const Locations = () => {
  return (
    <section className={styles.location}>
      <div className={styles.location__body}>
        <div className={styles.location_name_block}>
          <p className={styles.location__name}>Locations</p>
        </div>
        <div className={styles.location__map__content}>
          <div className={styles.map__navigation}></div>
          <div className={styles.map}></div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
