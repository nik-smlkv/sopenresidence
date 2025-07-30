import React from "react";
import styles from "./ApartmentView.module.css";
const ApartmentView = () => {
  return (
    <section
      className={styles.apartment__view}
      data-section-id="transparent-black"
    >
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
                <svg
                  className={styles.apartment__icon}
                  width="35"
                  height="26"
                  viewBox="0 0 35 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.618652"
                    y="3.47656"
                    width="22.8571"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="0.618652"
                    y="12.0479"
                    width="13.3333"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="1.57129"
                    y="20.6191"
                    width="19.0476"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="22.5234"
                    y="20.6191"
                    width="12.381"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="25.3809"
                    y="3.47656"
                    width="9.52381"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="15.8569"
                    y="12.0479"
                    width="19.0476"
                    height="1.90476"
                    rx="0.952381"
                    fill="white"
                  />
                  <rect
                    x="21.5713"
                    y="8.23828"
                    width="7.61905"
                    height="1.90476"
                    rx="0.952381"
                    transform="rotate(-90 21.5713 8.23828)"
                    fill="white"
                  />
                  <rect
                    x="12.0474"
                    y="16.8096"
                    width="7.61905"
                    height="1.90476"
                    rx="0.952381"
                    transform="rotate(-90 12.0474 16.8096)"
                    fill="white"
                  />
                  <rect
                    x="18.7139"
                    y="25.3809"
                    width="7.61905"
                    height="1.90476"
                    rx="0.952381"
                    transform="rotate(-90 18.7139 25.3809)"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.apartment__card}>
            <div className={styles.apartment_card_body}>
              <p className={styles.apartment__visual}>
                visual selectional of apartments
              </p>
              <div className={styles.apartment__info}>
                <img
                  className={styles.apartment__render}
                  src="/images/render.png"
                  alt="Render"
                />
                <svg
                  className={styles.apartment__icon}
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25 20C25 21.3261 24.4732 22.5979 23.5355 23.5355C22.5979 24.4732 21.3261 25 20 25C18.6739 25 17.4021 24.4732 16.4645 23.5355C15.5268 22.5979 15 21.3261 15 20C15 18.6739 15.5268 17.4021 16.4645 16.4645C17.4021 15.5268 18.6739 15 20 15C21.3261 15 22.5979 15.5268 23.5355 16.4645C24.4732 17.4021 25 18.6739 25 20Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.3335 19.9997C6.00016 13.1713 12.2268 8.33301 20.0002 8.33301C27.7735 8.33301 34.0002 13.1713 36.6668 19.9997C34.0002 26.828 27.7735 31.6663 20.0002 31.6663C12.2268 31.6663 6.00016 26.828 3.3335 19.9997Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentView;
