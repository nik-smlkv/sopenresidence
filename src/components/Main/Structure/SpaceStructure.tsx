import { useRef } from "react";
import styles from "./SpaceStructure.module.css";

import { useLang } from "../../../hooks/useLang";

const SpaceStructure = () => {
  const { t, lang } = useLang();
  const imgRef = useRef<HTMLImageElement>(null);
  type DescriptionBlock = {
    text: string[];
    img: string[];
  };

  type LamelaItem = {
    name: string;
    description: DescriptionBlock;
  };

  const structureCards: LamelaItem[] = [
    {
      name: t.t_struct_name_1,
      description: {
        text: [t.t_struct_txt_1_1, lang === "srb" ? "" : t.t_struct_txt_1_2],
        img: ["structure-1.jpg", "structure-2.jpg"],
      },
    },
    {
      name: t.t_struct_name_2,
      description: {
        text: [t.t_struct_txt_2_1, lang === "srb" ? "" : t.t_struct_txt_2_2],
        img: ["structure-3.jpg", "structure-4.jpg"],
      },
    },
    {
      name: t.t_struct_name_3,
      description: {
        text: [t.t_struct_txt_3_1, lang === "srb" ? "" : t.t_struct_txt_3_2],
        img: ["structure-5.jpg", "structure-6.jpg"],
      },
    },
  ];
  
  return (
    <section
      className={styles.structure}
      data-section-id="light"
      id="space-structure"
    >
      <div className={styles.structure__body}>
        <div className={styles.structure__block}>
          <div
            className={`section_name ${styles.structure__name}`}
            data-split="block-name"
          >
            {t.t_space_str}
          </div>
          <div className={styles.structure_text_block}>
            <h2
              className={`${styles.structure_text_block_title} ${
                lang === "srb" ? "title_srb" : ""
              }`}
              data-animate="fade-up"
            >
              {t.t_struct_title}
            </h2>
          </div>
        </div>
        <div className={styles.structure__cards}>
          {structureCards.map((card) => (
            <div className={styles.structure__card}>
              <div className={styles.card__name} data-animate="fade-up-text">
                {card.name}
              </div>
              <div className={styles.structure__card_block}>
                <div className={styles.structure__card_block_text}>
                  {card.description.text.map((paragraph, index) => (
                    <p key={`text-${index}`} data-animate="fade-up-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className={styles.structure__card_block_img}>
                  {card.description.img.map((image, index) => (
                    <div
                      className={styles.img_wrapper}
                      ref={imgRef}
                      key={`img-${index}`}
                    >
                      <img
                        src={`https://sopenpark.rs/park-test/images/${image}`}
                        alt=""
                      />
                      <div
                        className={styles.img_overlay}
                        data-animate="image-fade"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaceStructure;
