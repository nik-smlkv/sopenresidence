import styles from "./SectionMain.module.css";
const SectionMain = () => {
  return (
    <section className={styles.main}>
      <div className={styles.main__body}>
        <div className={styles.title_block}>
          <p className={styles.text_welcome}>Welcome to</p>
          <h1 className={styles.title}>sopen park</h1>
        </div>
        <img
          className={styles.main_img}
          src="../../../public/images/main.jpg"
          alt=""
        />
        <p className={styles.subtitle}>
          A modern space for living and business in the heart of Niš
        </p>
      </div>
    </section>
  );
};

export default SectionMain;
