import React, { useEffect, useRef } from "react";
import styles from "./HorizontParallax.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const HorizontParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    let cards = gsap.utils.toArray<HTMLElement>('[data-type="parallax"]');
    const totalWidth = cards.reduce((sum, card) => {
      return sum + card.getBoundingClientRect().width;
    }, 0);
    gsap.to(cards, {
      xPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "10% 10%",
        pin: true,
        scrub: 1.2,
        end: `+=${totalWidth}`,
      },
    });
  }, []);
  return (
    <section className={styles.horizontal_parallax}>
      <div className={styles.parallax__cards} ref={containerRef}>
        <div className={styles.parallax__card_preview} data-type="parallax">
          <p>
            Residents don’t have to travel far to enjoy themselves —
            entertainment is delivered right to their doorstep.
          </p>
        </div>
        {ParallaxCards.map((card, index) => (
          <div className={styles.parallax__card} data-type="parallax">
            <p className={styles.card__index}>0{index + 1}</p>
            <img src={`/images/${card.img}`} alt="" />{" "}
            <p className={styles.card__name}>{card.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontParallax;
