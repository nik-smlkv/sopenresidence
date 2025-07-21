import React from "react";
import styles from "./Contact.module.css";
const Contact = () => {
  return (
    <div className={`contact_info_block ${styles.contact__info}`}>
      <div className={styles.block__address}>
        <span className={`contact__name ${styles.contact__name}`}>Contact</span>
        <a href="tel:" className={`number ${styles.number}`} data-close>
          +381 00 000-0000
        </a>
      </div>
      <div className={styles.block__address}>
        <span className={`contact__name_depart ${styles.contact__name}`}>Sales department</span>
        <a href="" className={`address ${styles.address}`} data-close>
          Novogradnja Niš — Palilulska ulica 11-13 — Palilula
        </a>
      </div>
    </div>
  );
};

export default Contact;
