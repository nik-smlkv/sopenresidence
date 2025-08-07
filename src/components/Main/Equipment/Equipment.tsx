import  { useState } from "react";
import styles from "./Equipment.module.css";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
const Equipment = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const equipmentList: { name: string; description: string }[] = [
    {
      name: "Thermal insulation",
      description:
        "Facade walls made of high-quality economical blocks, thermal insulation with 12 cm polystyrene.",
    },
    { name: "Facade carpentry", description: "High-quality multi-chamber PVC" },
    {
      name: "Climate control",
      description: "Split-system air conditioning in the living room.",
    },
    {
      name: "Access control",
      description: "Video intercom at the entrance to each section.",
    },
    {
      name: "Entrance doors",
      description: "Protective entrance doors with high fire resistance.",
    },
    {
      name: "Interior doors",
      description: "MDF doors covered with white CPL film.",
    },
    {
      name: "Flooring",
      description: "Multi-layer parquet from a renowned manufacturer.",
    },
    { name: "Ceramics", description: "First-class ceramic tiles." },
    {
      name: "Plumbing",
      description:
        "Plumbing and sanitary equipment from collections of leading global manufacturers.",
    },
  ];

  const handleOpenCard = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className={styles.equipment} id="equipment"
	 data-section-id="light">
      <div className={styles.equip__body}>
        <div className={styles.equip__block}>
          <div
            className={`section_name ${styles.equip__name}`}
            data-split="block-name"
          >
            Equipment
          </div>
          <div className={styles.equip_text_block}>
            <h2 className={styles.equip_text_block_title}>
              Quality in every detail: comfort and security
            </h2>
            <div className={styles.btn__block}>
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
                    <img src="./images/equip-arrow.svg" alt="" />
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
