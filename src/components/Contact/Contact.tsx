import React from "react";
import styles from "./Contact.module.css";
const Contact = () => {
  return (
    <div className={styles.contact__info}>
      <div className={styles.block__address}>
        <span className={styles.contact__name}>Contact</span>
        <a href="tel:" className={styles.number} data-close>
          +381 00 000-0000
        </a>
      </div>
      <div className={styles.block__address}>
        <span className={styles.contact__name}>Sales department</span>
        <a href="" className={styles.address} data-close>
          Novogradnja Niš — Palilulska ulica 11-13 — Palilula
        </a>
      </div>
    </div>
  );
};

export default Contact;
