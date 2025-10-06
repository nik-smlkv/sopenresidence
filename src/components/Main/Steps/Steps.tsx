import React, { useRef, useState, type JSX } from "react";
import styles from "./Steps.module.css";
import { useLang } from "../../../hooks/useLang";
import { useStepsAnimation } from "../../../hooks/useAnimations";

const Steps: React.FC = () => {
  const { t } = useLang();
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
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

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  useStepsAnimation(stepsRef, cardsRef, imageRef, styles);
  return (
    <section
      className={styles.steps}
      ref={stepsRef}
      data-section-id="light"
      id="finance"
    >
      <div className={styles.steps__title_block}>
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
                  <p className={styles.card__content_block_name}>{card.name}</p>
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
  );
};

export default Steps;
