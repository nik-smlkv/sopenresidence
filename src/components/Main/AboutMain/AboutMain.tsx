import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
import styles from "./AboutMain.module.css";

const AboutMain = () => {
  interface ImgsListType {
    [key: string]: string;
  }
  interface InfoListType {
    [key: string]: string;
  }
  const InfoListArray: { key: string; name: string; info: string }[] = [
    { key: "Location", name: "Location", info: "Niš, Serbia" },
    { key: "Complex area", name: "Complex area", info: "42,683 m²" },
    { key: "Structure", name: "Structure", info: "3P0+P+15" },
    { key: "Number of apartments", name: "Number of apartments", info: "326" },
    { key: "Parking spaces", name: "Parking spaces", info: "386" },
  ];
  const ImgsListArray: { key: string; src: string }[] = [
    { key: "curves-horizon", src: "curves-horizon.jpg" },
    { key: "futures-balcones", src: "futures-balcones.jpg" },
    { key: "street-hythm", src: "street-hythm.jpg" },
    { key: "urban-oasis", src: "urban-oasis.jpg" },
  ];
  return (
    <section className={styles.about}>
      <div className={styles.about__body}>
        <div className={styles.about__block}>
          <div className={styles.about__name}>About the project</div>
          <div className={styles.about_text_block}>
            <h2 className={styles.about_text_block_title}>
              Creating a space inspired by classics
            </h2>
            <div className={styles.about_block_text}>
              <p>
                After the distinctive Beethoven's Park, which provided a home
                for families and individuals in a complex of 75 apartments, we
                continue to build in the same spirit — combining opulence,
                elegance, comfort and luxury.
              </p>
              <p>
                Just as the world's greatest composers Beethoven and Chopin
                created music that inspires, our new commercial and residential
                complex, Chopin Park, exudes that artistic vision.
              </p>
            </div>
          </div>
          <div className={styles.about__apart_btn}>
            <SelectApartmentBtn />
          </div>
        </div>
        <div className={styles.img__list}>
          {ImgsListArray.map((img) => (
            <img
              key={img.key}
              src={`./images/${img.src}`}
              alt={img.key}
              className={styles.img__item}
            />
          ))}
        </div>
        <div className={styles.about__content}>
          <p className={styles.about_content_title}>About</p>
          <div className={styles.about_content_block}>
            <p className={styles.about_content_block_description}>
              Chopin Park offers a refined living experience, blending luxury
              with functionality. Thoughtfully designed, it provides elegant
              homes, commercial spaces, wellness facilities, and business
              apartments for a balanced lifestyle.
            </p>
            <div className={styles.info__list}>
              {InfoListArray.map((information) => (
                <div className={styles.info__item} key={information.key}>
                  <p className={styles.info__name}>{information.name}</p>
                  <p className={styles.info__description}>{information.info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMain;
