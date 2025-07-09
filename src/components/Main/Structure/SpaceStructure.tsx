import React from "react";
import styles from "./SpaceStructure.module.css";
const SpaceStructure = () => {
  const structureCards: {
    name: string;
    description: { text: string; img: string }[];
  }[] = [
    {
      name: "Lamela A",
      description: [
        {
          text: "A majestic 15-story tower featuring 182 residential units. ",
          img: "structure-1.jpg",
        },
        {
          text: "Thanks to modern engineering solutions and elegant design, it shapes the distinctive architectural character of the complex.",
          img: "structure-2.jpg",
        },
      ],
    },
    {
      name: "Lamela B and C",
      description: [
        {
          text: "Harmonious residential spaces with a height of 10 stories, each containing 72 apartments. ",
          img: "structure-3.jpg",
        },
        {
          text: "Thanks to modern engineering solutions and elegant design, it shapes the distinctive architectural character of the complex.",
          img: "structure-4.jpg",
        },
      ],
    },
    {
      name: "Parking",
      description: [
        {
          text: "Parking spaces are located on three underground levels.",
          img: "structure-5.jpg",
        },
        {
          text: "Elevators provide direct access between the parking area and residential floors, ensuring convenience and maximum comfort for residents.",
          img: "structure-6.jpg",
        },
      ],
    },
  ];
  return (
    <section>
      <div className={styles.structure__body}>
        <div className={styles.structure__block}>
          <div className={styles.structure__name}>Space structure</div>
          <div className={styles.structure_text_block}>
            <h2 className={styles.structure_text_block_title}>
              Thoughtful layout for modern living
            </h2>
          </div>
        </div>
        <div className={styles.structure__cards}>
          {structureCards.map((card) => (
            <div className={styles.structure__card}>
              <div className={styles.card__name}>{card.name}</div>
              <div className={styles.structure__card_block}>
                {card.description.map((description) => (
                  <div className={styles.structure__card_content}>
                    <p>{description.text}</p>
                    <img src={`/images/${description.img}`} alt="" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaceStructure;
