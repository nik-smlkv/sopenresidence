import MainSlider from "../../Sliders/MainSlider";
import styles from "./Infrastructure.module.css";

const Infrastructura = () => {
  return (
    <section className={styles.infrastructura}>
      <div className={styles.infrastructura__body}>
        <div className={styles.infrastructura__block}>
          <div className={styles.infrastructura__name}>Infrastructure</div>
          <div className={styles.infrastructura_text_block}>
            <h2 className={styles.infrastructura_text_block_title}>
              Everything here is designed for a modern lifestyle
            </h2>
            <div className={styles.infrastructura_block_text}>
              <p>
                Beethoven’s Park invites you to be part of this new chapter
                in Niš. Join a community that values speed, quality, and
                comfort. Your new home, your story, Beethoven’s Park.
                Beethoven’s Park invites you to be part of this new chapter
                in Niš. Join a community that values speed, quality, and
                comfort.
              </p>
            </div>
          </div>
        </div>
      </div>
      <MainSlider />
    </section>
  );
};

export default Infrastructura;
