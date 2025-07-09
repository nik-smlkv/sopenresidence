import React from "react";
import styles from "./ApartmentView.module.css";
const ApartmentView = () => {
  return (
    <section className={styles.apartment__view}>
      <div className={styles.apartment__body}>
        <h2 className={styles.apartment__title}>Step Towards Your New Home</h2>
        <div className={styles.apartments__cards}>
          <div className={styles.apartment__card}>
            <div className={styles.apartment_card_body}>
              <p className={styles.apartment__filter}>filter by features</p>
              <div className={styles.apartment__info}>
                <div className={styles.apart__info_text}>
                  <p className={styles.apart__count}>376</p>
                  <p className={styles.apart__text}>Apartment</p>
                </div>
                <img
                  src="/images/filter.svg"
                  className={styles.apartment__icon}
                  alt="Filter"
                />
              </div>
            </div>
          </div>
          <div className={styles.apartment__card}>
            <div className={styles.apartment_card_body}>
              <p className={styles.apartment__visual}>
                visual selectional of apartments
              </p>
              <div className={styles.apartment__info}>
                <img  className={styles.apartment__render} src="/images/render.png" alt="Render" />
                <img
                  src="/images/visual.svg"
                  className={styles.apartment__icon}
                  alt="Visual"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentView;
