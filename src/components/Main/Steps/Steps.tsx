import React, { useEffect, useRef, useState, type JSX } from "react";
import styles from "./Steps.module.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useResponsiveRef } from "../../../hooks/useResponsiveRef";
const Steps = () => {
  const stepsCardArray: { name: string; text: string[] }[] = [
    {
      name: "Housing credit API Bank",
      text: [
        "No Serbian residency required. You can purchase an apartment in Sava Residence through API Bank, even if you are not a resident of Serbia.",
        "Flexible income assessment. To determine your creditworthiness, API Bank accepts all types of income, not just salaries.",
        "Path to residency. The property you purchase can be a basis for obtaining a residence permit in Serbia.",
        "Loan consultation. Leave your details, and an API Bank housing loan advisor will contact you.",
      ],
    },
    {
      name: "Housing credit Banca Intesa",
      text: [
        "Special Loan Conditions. Banca Intesa offers favorable terms for housing loans to purchase property in our complex, including a fixed interest rate of 5.03%.",
        "Fast and Easy Processing. Financing real estate in Sava Residence is a simple and efficient procedure, taking only 7 days from the date of application submission.",
        "Path to residency. The property you purchase can be a basis for obtaining a residence permit in Serbia.",
        "Loan Consultation. If you need additional details, leave your contact information, and a Banca Intesa housing loan advisor will get in touch with you.",
      ],
    },
    {
      name: "Housing credit UniCredit Bank",
      text: [
        "Attractive Rates. Fixed or variable interest rates from ~3.19% (EUR loans).",
        "Fast Processing. Simple procedure with quick approval times.",
        "Path to residency. Property purchase may help obtain a Serbian residence permit.",
        "Loan Consultation. Leave your details for a UniCredit Bank advisor to contact you.",
      ],
    },
  ];
  const cardsWrapperRef = useResponsiveRef<HTMLDivElement>(1000);
  const titleRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useEffect(() => {
    let wrapperTrigger: ScrollTrigger | undefined;
    let titleTrigger: ScrollTrigger | undefined;

    const createScroll = () => {
      const wrapper = cardsWrapperRef?.current;
      const title = titleRef.current;
      const image = imgRef.current;
      const imgWrapper = imgWrapperRef.current;
      const width = window.innerWidth;

      if (!wrapper || !title || !image || !imgWrapper || width <= 768) return;

      const triggerEl = wrapper.parentElement; // общий родитель для карточек и картинки
      gsap.fromTo(
        wrapper,
        { yPercent: 110 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top bottom",
            end: "+=200%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        imgWrapper,
        { yPercent: 110 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top bottom",
            end: "+=100%", // 👈 закончится здесь
            scrub: true,
          },
        }
      );

      // Второй блок: pin + масштаб imgRef
      gsap.fromTo(
        image,
        { maxWidth: "40vw", maxHeight: "40vh" },
        {
          maxWidth: "100vw",
          maxHeight: "100vh",
          ease: "none",
          scrollTrigger: {
            trigger: imgWrapper,
            start: "top+=20% top+=20%", // 👈 старт после движения
            end: "+=100%", // можно подкорректировать по желаемой длине
            pin: true,
            pinSpacing: false,
            scrub: true,
            markers: true,
          },
        }
      );

      titleTrigger = ScrollTrigger.create({
        trigger: title,
        start: "35% 35%",
        end: "+=300%",
        pin: true,
        scrub: 1.2,
        pinSpacing: false,
      });
    };
    const handleResize = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      createScroll();
    };
    createScroll();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.steps} data-section-id="light">
      <div className={styles.pin_wrapper}>
        <div className={styles.steps__body}>
          <div className={styles.steps__cards_wrapper}>
            <div className={styles.steps__cards} ref={cardsWrapperRef}>
              {stepsCardArray.map((card, index) => (
                <div
                  key={index}
                  className={`${styles.steps__card} ${
                    activeIndex === index ? styles.active : ""
                  }`}
                >
                  <div className={styles.steps__card_front}>
                    <p className={styles.card__name}>
                      {card.name.split(" ").reduce((acc, word, i) => {
                        if (i % 2 === 0 && i !== 0) acc.push(<br key={i} />);
                        acc.push(word + " ");
                        return acc;
                      }, [] as (string | JSX.Element)[])}
                    </p>
                    <div
                      className={styles.card__btn}
                      onClick={() => handleToggle(index)}
                    >
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.576923"
                          y="0.576923"
                          width="58.8462"
                          height="58.8462"
                          rx="29.4231"
                          stroke="#5A6C54"
                          stroke-width="1.15385"
                        />
                        <path
                          d="M30.7036 19.0186V29.2969H40.9819V30.7041H30.7036V40.9824H29.2964V30.7041H19.0181V29.2969H29.2964V19.0186H30.7036Z"
                          fill="#5A6C54"
                          stroke="#5A6C54"
                          stroke-width="0.535714"
                        />
                      </svg>
                    </div>
                    <div className={styles.card__num}>
                      <span className={styles.card__index}>0{index + 1}</span>
                      <span className={styles.card__count}>
                        / 0{stepsCardArray.length}
                      </span>
                    </div>
                  </div>
                  <div className={styles.steps__card__content}>
                    <p className={styles.card__content_title}>
                      Main conditions
                    </p>
                    <ul className={styles.card__text_list}>
                      {card.text.map((text) => (
                        <li className={styles.card__text_item}>{text}</li>
                      ))}
                    </ul>
                    <div className={styles.card__content_block}>
                      <p className={styles.card__content_block_name}>
                        {card.name}
                      </p>{" "}
                      <div className={styles.card__content_num}>
                        <span>0{index + 1}</span>{" "}
                        <span>/ 0{stepsCardArray.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.img__wrapper} ref={imgWrapperRef}>
              <img
                src="./images/steps-img.jpg"
                alt="steps"
                ref={imgRef}
                className={styles.steps__img}
              />
            </div>
          </div>
        </div>
        <div className={styles.steps__title_block} ref={titleRef}>
          <h2 className={styles.steps__title}>
            Savings and comfort:
            <br /> invest in your future
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Steps;
