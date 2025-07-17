import React from "react";
import styles from "./Modal.module.css";
import Contact from "../Contact/Contact";
import Navigation from "../Navigation/Navigation";
import SelectApartmentBtn from "../Buttons/SelectApartmentBtn";
import { useModalControl } from "../../context/ModalContext";

const BurgerModal = () => {
  const { close } = useModalControl();
  return (
    <div
      className={styles.burger_modal}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-close]")) {
          close();
        }
      }}
    >
      <div className={styles.burger_modal_body}>
        <div className={styles.burger_modal_content}>
          <div className={styles.burger_modal_contact}>
            <Contact />
          </div>
          <div className={styles.burger_modal_nav}>
            <div className={styles.nav__name}>Menu</div>
            <Navigation
              items={[
                { label: "About project", targetId: "about-project" },
                { label: "Infrastructure", targetId: "infrastructure" },
                { label: "Advantages", targetId: "advantages" },
                { label: "Equipment", targetId: "equipment" },
                { label: "Finance", targetId: "finance" },
                { label: "Space Structure", targetId: "space-structure" },
              ]}
            />
            <SelectApartmentBtn data-close />
          </div>
          <div className={styles.burger_modal_picture}>
            <img src="./images/modal-image.jpg" alt="Modal Image" />
          </div>
        </div>
        <div className={styles.burger_modal_block}>
          <div className={styles.burger_modal_btns}>
            <div className={styles.request__btn} data-close>
              <span>Leave a request</span>
            </div>
            {/* <div className="current_language"></div> */}
          </div>
          <div className={styles.burger_modal_socials}>
            <div className={styles.burger_modal_social}>
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.9455 13.8C24.9805 13.8028 25.5058 13.8083 25.9593 13.8212L26.1378 13.8276C26.3439 13.835 26.5472 13.8442 26.7928 13.8552C27.7716 13.9012 28.4395 14.0558 29.0256 14.283C29.6328 14.5167 30.1442 14.8332 30.6557 15.3437C31.1236 15.8035 31.4856 16.3598 31.7164 16.9739C31.9437 17.5599 32.0982 18.2278 32.1442 19.2076C32.1553 19.4523 32.1644 19.6555 32.1717 19.8625L32.1772 20.041C32.191 20.4936 32.1966 21.0189 32.1984 22.0538L32.1993 22.7401V23.9454C32.2016 24.6163 32.1946 25.2873 32.1782 25.9582L32.1726 26.1367C32.1653 26.3436 32.1561 26.5469 32.145 26.7916C32.0992 27.7714 31.9428 28.4384 31.7164 29.0252C31.4856 29.6393 31.1236 30.1957 30.6557 30.6555C30.196 31.1234 29.6397 31.4854 29.0256 31.7161C28.4395 31.9434 27.7716 32.0979 26.7928 32.1439L26.1378 32.1715L25.9593 32.177C25.5058 32.1899 24.9805 32.1964 23.9455 32.1982L23.2592 32.1991H22.0551C21.3837 32.2015 20.7124 32.1944 20.0413 32.178L19.8628 32.1725C19.6444 32.1642 19.426 32.1546 19.2078 32.1439C18.229 32.0979 17.5611 31.9434 16.9741 31.7161C16.3604 31.4853 15.8044 31.1233 15.3449 30.6555C14.8766 30.1958 14.5143 29.6395 14.2832 29.0252C14.056 28.4393 13.9016 27.7714 13.8556 26.7916L13.828 26.1367L13.8234 25.9582C13.8063 25.2873 13.7986 24.6164 13.8004 23.9454V22.0538C13.7977 21.3828 13.8045 20.7119 13.8206 20.041L13.827 19.8625C13.8344 19.6555 13.8436 19.4523 13.8546 19.2076C13.9006 18.2278 14.0551 17.5608 14.2823 16.9739C14.5139 16.3595 14.8769 15.8032 15.3458 15.3437C15.805 14.876 16.3607 14.514 16.9741 14.283C17.5611 14.0558 18.2281 13.9012 19.2078 13.8552C19.4525 13.8442 19.6567 13.835 19.8628 13.8276L20.0413 13.8221C20.7121 13.8058 21.3831 13.7988 22.0541 13.801L23.9455 13.8ZM22.9999 18.3998C21.7799 18.3998 20.61 18.8844 19.7474 19.747C18.8847 20.6097 18.4001 21.7797 18.4001 22.9996C18.4001 24.2195 18.8847 25.3895 19.7474 26.2521C20.61 27.1147 21.7799 27.5994 22.9999 27.5994C24.2198 27.5994 25.3897 27.1147 26.2523 26.2521C27.1149 25.3895 27.5996 24.2195 27.5996 22.9996C27.5996 21.7797 27.1149 20.6097 26.2523 19.747C25.3897 18.8844 24.2198 18.3998 22.9999 18.3998ZM22.9999 20.2397C23.3623 20.2397 23.7212 20.311 24.0561 20.4496C24.3909 20.5883 24.6952 20.7915 24.9515 21.0477C25.2078 21.304 25.4111 21.6082 25.5499 21.943C25.6887 22.2778 25.7601 22.6367 25.7601 22.9991C25.7602 23.3616 25.6889 23.7204 25.5503 24.0553C25.4116 24.3902 25.2084 24.6945 24.9521 24.9508C24.6959 25.2071 24.3917 25.4104 24.0569 25.5491C23.7221 25.6879 23.3632 25.7594 23.0008 25.7595C22.2688 25.7595 21.5668 25.4686 21.0493 24.9511C20.5317 24.4335 20.2409 23.7316 20.2409 22.9996C20.2409 22.2676 20.5317 21.5657 21.0493 21.048C21.5668 20.5305 22.2679 20.2397 22.9999 20.2397ZM27.8305 17.0199C27.5255 17.0199 27.2331 17.141 27.0174 17.3567C26.8017 17.5724 26.6806 17.8648 26.6806 18.1698C26.6806 18.4748 26.8017 18.7674 27.0174 18.983C27.2331 19.1986 27.5255 19.3198 27.8305 19.3198C28.1355 19.3198 28.428 19.1986 28.6436 18.983C28.8593 18.7674 28.9805 18.4748 28.9805 18.1698C28.9805 17.8648 28.8593 17.5724 28.6436 17.3567C28.428 17.141 28.1355 17.0199 27.8305 17.0199Z"
                  fill="#1C2F24"
                />
              </svg>
            </div>
          </div>
          <p className={styles.burger_modal_notation}>
            All rights reserved © 2025 Sopen Park
          </p>
        </div>
      </div>
    </div>
  );
};

export default BurgerModal;
