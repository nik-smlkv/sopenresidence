import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./HorizontParallax.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const HorizontParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollTrigger | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 1000);
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
  const initScrollTrigger = () => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-type="parallax"]');
    const totalWidth = cards.reduce(
      (sum, card) => sum + card.getBoundingClientRect().width,
      0
    );
    const trigger = gsap.to(parallaxCardRef.current, {
      xPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: `top-=86 top`,
        end: `+=${totalWidth - 150}`,
        scrub: 1.2,
        pin: parallaxCardRef.current,
        pinSpacing: false,
      },
    });

    scrollRef.current = trigger.scrollTrigger;
  };
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newIsDesktop = width >= 1000;

      if (newIsDesktop && !isDesktop) {
        initScrollTrigger();
      }

      if (!newIsDesktop && isDesktop) {
        scrollRef.current?.kill();
        scrollRef.current = undefined;
      }

      setIsDesktop(newIsDesktop);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      scrollRef.current?.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [isDesktop]);

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

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  useLayoutEffect(() => {
    if (isDesktop) {
      setTimeout(() => {
        initScrollTrigger();
      }, 800);
    }
  }, [isDesktop]);

  return (
    <section
      className={styles.horizontal_parallax}
      ref={containerRef}
      data-section-id="light"
    >
      {isDesktop && (
        <div id="cursorPreview" className={styles.cursorPreview}></div>
      )}
      {isDesktop ? (
        <div className={styles.pinWrapper}>
          <div
            className={styles.parallax__cards}
            data-type="parallax"
            ref={parallaxCardRef}
          >
            <div className={styles.parallax__card_preview}>
              <p>
                Residents don’t have to travel far to enjoy themselves —
                entertainment is delivered right to their doorstep.
              </p>
            </div>
            {ParallaxCards.map((card, index) => (
              <div
                key={index}
                className={styles.parallax__card}
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
      ) : (
        <>
          <p className={styles.parallax_text}>
            Residents don’t have to travel far to enjoy themselves —
            entertainment is delivered right to their doorstep.
          </p>
          <div className={styles.parallax__cards}>
            {ParallaxCards.map((card, index) => (
              <div
                key={index}
                className={styles.parallax__card}
                onClick={() => handleToggle(index)}
              >
                <div className={styles.parallax__card_content}>
                  <p className={styles.card__index}>0{index + 1}</p>
                  <p className={styles.card__name}>{card.name}</p>
                  <div className={styles.plus__icon_block}>
                    <span
                      className={`${styles.plus_icon} ${
                        openIndex === index ? styles.open : ""
                      }`}
                    ></span>
                  </div>
                </div>

                <div
                  className={`${styles.parallax__card_img} ${
                    openIndex === index ? styles.open : ""
                  }`}
                >
                  <img src={`./images/${card.img}`} alt={card.name} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HorizontParallax;
