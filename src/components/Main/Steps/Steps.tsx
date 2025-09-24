import { useLayoutEffect, useRef, useState, type JSX } from "react";
import styles from "./Steps.module.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useResponsiveRef } from "../../../hooks/useResponsiveRef";
import { useLang } from "../../../hooks/useLang";
const Steps = () => {
  const { t } = useLang();
  const stepsCardArray: { name: string; text: string[] }[] = [
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
      name: t.t_fin_name_1,
      text: [
        t.t_fin_txt_2_1,
        t.t_fin_txt_2_2,
        t.t_fin_txt_2_3,
        t.t_fin_txt_2_4,
      ],
    },
    {
      name: t.t_fin_name_1,
      text: [
        t.t_fin_txt_3_1,
        t.t_fin_txt_3_2,
        t.t_fin_txt_3_3,
        t.t_fin_txt_3_4,
      ],
    },
  ];
  const cardsWrapperRef = useResponsiveRef<HTMLDivElement>(1000);
  const titleRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useLayoutEffect(() => {
    const timeoutId = setTimeout(() => {
      const createScroll = () => {
        const wrapper = cardsWrapperRef?.current;
        const title = titleRef.current;
        const image = imgRef.current;
        const imgWrapper = imgWrapperRef.current;
        const steps = stepsRef.current;
        const width = window.innerWidth;
        if (
          !wrapper ||
          !title ||
          !image ||
          !imgWrapper ||
          !steps ||
          width <= 768
        )
          return;

        gsap.fromTo(
          wrapper,
          { yPercent: 60 },
          {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
              trigger: steps,
              start: "top center",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          image,
          {
            scale: 0.41,
            transformOrigin: "center center",
          },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrapper,
              start: "top top",
              end: "bottom bottom",
              pin: true,
              pinSpacing: false,
              scrub: true,
            },
          }
        );

        ScrollTrigger.create({
          trigger: title,
          start: "top center-=86",
          end: "bottom bottom+=25%",
          pin: true,
          scrub: true,
          pinSpacing: false,
        });
      };

      const handleResize = () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        createScroll();
      };

      createScroll();
      window.addEventListener("resize", handleResize);

      // Очистка при размонтировании
      return () => {
        window.removeEventListener("resize", handleResize);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, 400); // задержка 400 мс

    return () => clearTimeout(timeoutId);
  }, []);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.steps} data-section-id="light" id="finance">
      <div className={styles.pin_wrapper} ref={stepsRef}>
        <div className={styles.steps__body}>
          <div className={styles.steps__cards_wrapper} ref={cardsWrapperRef}>
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
                      {t.t_main_cond}
                    </p>
                    <ul className={styles.card__text_list}>
                      {card.text.map((text) => (
                        <li className={styles.card__text_item}>{text}</li>
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
          <div className={styles.img__wrapper} ref={imgWrapperRef}>
            <img
              src={new URL("/images/steps-img.jpg", import.meta.url).href}
              alt="steps"
              ref={imgRef}
              className={styles.steps__img}
            />
          </div>
        </div>
        <div className={styles.steps__title_block} ref={titleRef}>
          <h2 className={styles.steps__title}>{t.t_fin_title}</h2>
        </div>
      </div>
    </section>
  );
};

export default Steps;
