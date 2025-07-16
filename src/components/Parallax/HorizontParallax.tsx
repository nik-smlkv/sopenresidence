import React, { useEffect, useRef } from "react";
import styles from "./HorizontParallax.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const HorizontParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxCard = useRef<HTMLDivElement>(null);
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
        trigger: parallaxCard.current,
        start: "center center",
        end: `+=${totalWidth - 150}`,
        scrub: 1.2,
        pin: containerRef.current,
        pinSpacing: true,
        onEnter: () => {
          gsap.set(containerRef.current, { y: 120 });
        },
        onLeaveBack: () => {
          gsap.set(containerRef.current, { y: -120 });
        },
      },
    });
  }, []);
  useEffect(() => {
    const cursorPreview = document.getElementById("cursorPreview");

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorPreview) {
        cursorPreview.style.left = `${e.clientX}px`;
        cursorPreview.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className={styles.horizontal_parallax}>
      <div id="cursorPreview" className={styles.cursorPreview}></div>
      <div style={{ height: "120px" }} />
      <div className={styles.pinWrapper} ref={containerRef}>
        <div className={styles.parallax__cards}>
          <div
            className={styles.parallax__card_preview}
            data-type="parallax"
            ref={parallaxCard}
          >
            <p>
              Residents don’t have to travel far to enjoy themselves —
              entertainment is delivered right to their doorstep.
            </p>
          </div>
          {ParallaxCards.map((card, index) => (
            <div
              key={index}
              className={styles.parallax__card}
              data-type="parallax"
              onMouseEnter={() => {
                const preview = document.getElementById("cursorPreview");
                if (preview) {
                  preview.style.backgroundImage = `url(/images/${card.img})`;
                  preview.style.opacity = "1";
                }
              }}
              onMouseLeave={() => {
                const preview = document.getElementById("cursorPreview");
                if (preview) {
                  preview.style.opacity = "0";
                }
              }}
            >
              <p className={styles.card__index}>0{index + 1}</p>
              <p className={styles.card__name}>{card.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontParallax;
