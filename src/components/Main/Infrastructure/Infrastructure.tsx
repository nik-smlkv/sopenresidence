import { useLang } from "../../../hooks/useLang";
import MainSlider from "../../Sliders/MainSlider";
import styles from "./Infrastructure.module.css";

const Infrastructura = () => {
  const { t, lang } = useLang();
  return (
    <section
      className={styles.infrastructura}
      id="infrastructure"
      data-section-id="dark-green"
    >
      <div className={styles.infrastructura__body}>
        <div className={styles.infrastructura__block}>
          <div
            className={`section_name ${styles.infrastructura__name}`}
            data-split="block-name"
          >
            {t.link_infra}
          </div>
          <div className={styles.infrastructura_text_block}>
            <h2
              className={`${styles.infrastructura_text_block_title} ${
                lang === "srb" ? styles.infra_srb : ""
              }`}
            >
              {t.t_infra_title}
            </h2>
            <div className={styles.infrastructura_block_text}>
              <p>{t.t_infra_blck_text}</p>
            </div>
          </div>
        </div>
      </div>
      <MainSlider />
    </section>
  );
};

export default Infrastructura;
