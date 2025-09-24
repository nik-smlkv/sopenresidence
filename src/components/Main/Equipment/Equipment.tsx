import { useState } from "react";
import styles from "./Equipment.module.css";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
import { useLang } from "../../../hooks/useLang";
const Equipment = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLang();
  const equipmentList: { name: string; description: string }[] = [
    {
      name: t.t_equip_name_1,
      description: t.t_equip_discr_1,
    },
    { name: t.t_equip_name_2, description: t.t_equip_discr_2 },
    {
      name: t.t_equip_name_3,
      description: t.t_equip_discr_3,
    },
    {
      name: t.t_equip_name_4,
      description: t.t_equip_discr_4,
    },
    {
      name: t.t_equip_name_5,
      description: t.t_equip_discr_5,
    },
    {
      name: t.t_equip_name_6,
      description: t.t_equip_discr_6,
    },
    {
      name: t.t_equip_name_7,
      description: t.t_equip_discr_7,
    },
    { name: t.t_equip_name_8, description: t.t_equip_discr_8 },
    {
      name: t.t_equip_name_9,
      description: t.t_equip_discr_9,
    },
  ];

  const handleOpenCard = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section
      className={styles.equipment}
      id="equipment"
      data-section-id="light"
    >
      <div className={styles.equip__body}>
        <div className={styles.equip__block}>
          <div
            className={`section_name ${styles.equip__name}`}
            data-split="block-name"
          >
            {t.link_equip}
          </div>
          <div className={styles.equip_text_block}>
            <h2 className={styles.equip_text_block_title}>{t.t_equip_title}</h2>
            <div
              className={styles.btn__block}
              onClick={() => {
                const target = document.getElementById("contact");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <SelectApartmentBtn />
            </div>
          </div>
        </div>
        <div className={styles.equip__list}>
          {equipmentList.map((equip, index) => (
            <div
              key={index}
              className={`${styles.equip__item} ${
                openIndex === index ? styles.open : ""
              }`}
              onClick={() => handleOpenCard(index)}
            >
              <div className={styles.equip__item__content}>
                <div className={styles.equip__num}>(0{index + 1})</div>
                <div className={styles.equip__block__content}>
                  <div
                    className={`${styles.equip__name} ${
                      openIndex === index ? styles.open : ""
                    }`}
                  >
                    {equip.name}
                  </div>
                  <div className={styles.equip__item__text}>
                    {equip.description}
                  </div>
                </div>
                <button className={styles.equip__btn}>
                  <span>
                    <img
                      src={
                        new URL("/images/equip-arrow.svg", import.meta.url).href
                      }
                      alt="Equip Arrow"
                    />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Equipment;
