import React from "react";
import styles from "./HorizontParallax.module.css";
const HorizontParallax = () => {
  const ParallaxCards: {
    img: string;
    name: string;
  }[] = [
    {
      img: "beautiful-spa-client-with-tisane-looking-into-distance.jpg",
      name: "Wellness center",
    },
    {
      img: "close-up-barista-making-cappuccino-bartender-preparing-coffee-drink-1.jpg",
      name: "Supermarket",
    },
    {
      img: "close-up-barista-making-cappuccino-bartender-preparing-coffee-drink.jpg",
      name: "Pharmacy",
    },
    {
      img: "customer-choosing-milk-products-supermarket-refrigerator.jpg",
      name: "Café",
    },
    { img: "pharmacist-work.jpg", name: "Business apartments" },
    {
      img: "young-adult-woman-pushing-shopping-trolley-shelves-market.jpg",
      name: "Other commercial spaces",
    },
  ];
  return (
    <div className={styles.parallax__cards}>
      <div className={styles.parallax__card_preview}>
        <p>
          Residents don’t have to travel far to enjoy themselves — entertainment
          is delivered right to their doorstep.
        </p>
      </div>
      {ParallaxCards.map((card, index) => (
        <div className={styles.parallax__card}>
          <p className={styles.card__index}>0{index + 1}</p>
          <img src={`/images/${card.img}`} alt="" /> <p className={styles.card__name}>{card.name}</p>
        </div>
      ))}
    </div>
  );
};

export default HorizontParallax;
