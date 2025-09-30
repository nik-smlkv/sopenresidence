import { useLayoutEffect, useRef, useState, type JSX } from "react";
import styles from "./Steps.module.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLang } from "../../../hooks/useLang";

gsap.registerPlugin(ScrollTrigger);

const Steps = () => {
  const { t } = useLang();
  const stepsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const stepsCardArray = [
    {
      name: t.t_fin_name_1,
      text: [
        t.t_fin_txt_1_1,
        t.t_fin_txt_1_2,
        t.t_fin_txt_1_3,
        t.t_fin_txt_1_4,
      ],
    },
    {
      name: t.t_fin_name_2,
      text: [
        t.t_fin_txt_2_1,
        t.t_fin_txt_2_2,
        t.t_fin_txt_2_3,
        t.t_fin_txt_2_4,
      ],
    },
    {
      name: t.t_fin_name_3,
      text: [
        t.t_fin_txt_3_1,
        t.t_fin_txt_3_2,
        t.t_fin_txt_3_3,
        t.t_fin_txt_3_4,
      ],
    },
  ];

  useLayoutEffect(() => {
    const steps = stepsRef.current;
    const title = titleRef.current;
    const image = imageRef.current;
    const cards = cardsRef.current;
    if (!steps || !title || !image || !cards || window.innerWidth <= 768)
      return;

    const stepsHeight = steps.getBoundingClientRect().height;

    // Пин всей секции
    const totalHeight = stepsHeight ; // три фазы подряд

    // Пин всей секции на всю длину
    ScrollTrigger.create({
      trigger: steps,
      start: "top center",
      end: `+=${totalHeight}`,
      pin: true,
      scrub: true,
  
    });

    // Общий ScrollTrigger для карточек и картинки
    gsap.fromTo(
      cards,
      { y: window.innerHeight / 3 },
      {
        y: -window.innerHeight * 2.2,
        ease: "none",
        scrollTrigger: {
          trigger: steps,
          start: "top center",
          end: `+=${stepsHeight}`, // одна и та же высота
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      image,
      { yPercent: -20 },
      {
        yPercent: -200,
        ease: "none",
        scrollTrigger: {
          trigger: steps,
          start: "top center",
          end: `+=${stepsHeight}`, // та же самая высота
          scrub: true,
        },
      }
    );

    // Фаза 3: масштабирование картинки
    gsap.fromTo(
      image,
      { scale: 0.46 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: steps,
          start: `top-=590`, // третья часть
          end: `+=${stepsHeight}`,
			 pin: true,
			 pinSpacing: true,
          scrub: true,
        },
      }
    );

    const handleResize = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.refresh();
    };

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
    <>
      <section
        className={styles.steps}
        ref={stepsRef}
        data-section-id="light"
        id="finance"
      >
        <div className={styles.steps__title_block} ref={titleRef}>
          <h2 className={styles.steps__title}>{t.t_fin_title}</h2>
        </div>
        <div className={styles.steps__cards_wrapper} ref={cardsRef}>
          <div className={styles.steps__cards}>
            {stepsCardArray.map((card, index) => (
              <div
                key={index}
                className={`${styles.steps__card} ${
                  activeIndex === index ? styles.active : ""
                }`}
                onClick={() => handleToggle(index)}
              >
                <div className={styles.steps__card_front}>
                  <p className={styles.card__name}>
                    {card.name.split(" ").reduce((acc, word, i) => {
                      if (i % 2 === 0 && i !== 0) acc.push(<br key={i} />);
                      acc.push(word + " ");
                      return acc;
                    }, [] as (string | JSX.Element)[])}
                  </p>
                  <div className={styles.card__btn}>
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
                        strokeWidth="1.15385"
                      />
                      <path
                        d="M30.7036 19.0186V29.2969H40.9819V30.7041H30.7036V40.9824H29.2964V30.7041H19.0181V29.2969H29.2964V19.0186H30.7036Z"
                        fill="#5A6C54"
                        stroke="#5A6C54"
                        strokeWidth="0.535714"
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
                  <p className={styles.card__content_title}>{t.t_main_cond}</p>
                  <ul className={styles.card__text_list}>
                    {card.text.map((text, i) => (
                      <li key={i} className={styles.card__text_item}>
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.card__content_block}>
                    <p className={styles.card__content_block_name}>
                      {card.name}
                    </p>
                    <div className={styles.card__content_num}>
                      <span>0{index + 1}</span>
                      <span>/ 0{stepsCardArray.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.img__wrapper} ref={imageRef}>
          <img
            src={new URL("/images/steps-img.jpg", import.meta.url).href}
            alt="steps"
            className={styles.steps__img}
          />
        </div>
      </section>
    </>
  );
};

export default Steps;
