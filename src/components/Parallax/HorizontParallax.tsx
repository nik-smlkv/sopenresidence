import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./HorizontParallax.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../hooks/useLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

const SwiperControls = ({
  swiperRef,
}: {
  swiperRef: React.MutableRefObject<SwiperType | null>;
}) => {
  return (
    <div className={styles.controls__wrapper}>
      <div className={styles.buttons__content}>
        <button
          className={styles.infra__prev}
          onClick={() => {
            swiperRef.current?.slidePrev();
          }}
        >
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 11.0001H1.75472M1.75472 11.0001L11.669 1.37744M1.75472 11.0001L11.669 20.6227"
              stroke="var(--acc-light-apr)"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <button
          className={styles.infra__next}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11.0001H19.2453M19.2453 11.0001L9.33105 1.37744M19.2453 11.0001L9.33105 20.6227"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const HorizontParallax = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollTrigger | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 1000);
  const ParallaxCards: {
    img: string;
    name: string;
  }[] = [
    {
      img: "/park-test/images/beautiful-spa-client-with-tisane-looking-into-distance.jpg",
      name: t.t_hor_par_2,
    },
    {
      img: "/park-test/images/customer-choosing-milk-products-supermarket-refrigerator.jpg",
      name: t.t_hor_par_3,
    },
    {
      img: "/park-test/images/pharmacist-work.jpg",
      name: t.t_hor_par_4,
    },
    {
      img: "/park-test/images/close-up-barista-making-cappuccino-bartender-preparing-coffee-drink.jpg",
      name: t.t_hor_par_5,
    },
    {
      img: "/park-test/images/close-up-barista-making-cappuccino-bartender-preparing-coffee-drink-1.jpg ",
      name: t.t_hor_par_6,
    },
    {
      img: "/park-test/images/young-adult-woman-pushing-shopping-trolley-shelves-market.jpg",
      name: t.t_hor_par_7,
    },
  ];

  const initScrollTrigger = () => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-type="parallax"]');
    const totalWidth = cards.reduce(
      (sum, card) => sum + card.getBoundingClientRect().width,
      0
    );
    const containerWidth =
      containerRef.current?.offsetWidth || window.innerWidth;
    const requiredPercent = ((totalWidth - containerWidth) / totalWidth) * 100;
    const screenWidth = window.innerWidth;
    const endValue =
      screenWidth > 1440 ? "bottom bottom-=386" : "bottom bottom";
    const trigger = gsap.to(parallaxCardRef.current, {
      xPercent: -requiredPercent,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: `top-=86 top`,
        end: endValue,
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
      {isDesktop ? (
        <div className={styles.parallax__cards}>
          <div className={styles.parallax__card_preview}>
            <SwiperControls swiperRef={swiperRef} />
            <p>{t.t_hor_par_1}</p>
          </div>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView="auto"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className={styles.parallax__cards}
          >
            {ParallaxCards.map((card, index) => (
              <SwiperSlide key={index} className={styles.parallax__card}>
                <p className={styles.card__index}>0{index + 1}</p>
                <img
                  src={new URL(card.img, import.meta.url).href}
                  alt={card.name}
                />
                <p className={styles.card__name}>{card.name}</p>
              </SwiperSlide>
            ))}
          </Swiper>
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
                  <img
                    src={new URL(`${card.img}`, import.meta.url).href}
                    alt={card.name}
                  />
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
