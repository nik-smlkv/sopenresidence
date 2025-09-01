import { useLang } from "../../hooks/useLang";
import styles from "./Contact.module.css";
const Contact = () => {
  const { t } = useLang();
  return (
    <div className={`contact_info_block ${styles.contact__info}`}>
      <div className={styles.block__address}>
        <span className={`contact__name ${styles.contact__name}`}>
          {t.t_cont}
        </span>
        <a href="tel:" className={`number ${styles.number}`} data-close>
          +381 00 000-0000
        </a>
      </div>
      <div className={styles.block__address}>
        <span className={`contact__name_depart ${styles.contact__name}`}>
          {t.t_depart_foot}
        </span>
        <a href="https://clck.ru/3NxQwf" target="_blank" className={`address ${styles.address}`} data-close>
          Novogradnja Niš — Palilulska ulica 11-13 — Palilula
        </a>
      </div>
    </div>
  );
};

export default Contact;
