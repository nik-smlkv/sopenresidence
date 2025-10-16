import { useRef } from "react";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
import styles from "./AboutMain.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import { useLang } from "../../../hooks/useLang";

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
          onClick={() => swiperRef.current?.slidePrev()}
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

const AboutMain = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { t, lang } = useLang();
  const InfoListArray: { key: string; name: string; info: string }[] = [
    { key: "Location", name: t.t_locat, info: t.t_abt_addr },
    { key: "Complex area", name: t.t_complex_area, info: "42,683 m²" },
    { key: "Structure", name: t.t_struct, info: "3P0 + GF + 10 & 3P0 + P + 15" },
    { key: "Number of apartments", name: t.t_num_apart, info: "326" },
    { key: "Parking spaces", name: t.t_park_space, info: "386" },
  ];
  const ImgsListArray: { key: string; src: string }[] = [
    { key: "curves-horizon", src: "/park-test/images/curves-horizon.jpg" },
    { key: "futures-balcones", src: "/park-test/images/futures-balcones.jpg" },
    { key: "street-hythm", src: "/park-test/images/street-hythm.jpg" },
    { key: "urban-oasis", src: "/park-test/images/urban-oasis.jpg" },
  ];

  return (
    <section
      className={styles.about}
      id="about-project"
      data-section-id="light"
    >
      <div className={styles.about__body}>
        <div className={styles.about__block}>
          <div
            className={`section_name ${styles.about__name}`}
            data-split="block-name"
          >
            {t.link_project}
          </div>
          <div className={styles.about_text_block}>
            <h2
              className={`${styles.about_text_block_title} ${lang === "srb" ? styles.about_srb : ''}`}
              data-animate="fade-up"
            >
              {t.t_abouttitle}
            </h2>
            <div className={styles.about_block_text}>
              <p data-animate="fade-up">{t.t_about_text_1}</p>
              <p data-animate="fade-up">{t.t_about_text_2}</p>
            </div>
          </div>
          <div
            className={styles.about__apart_btn}
            onClick={() => {
              const target = document.getElementById("contact");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <SelectApartmentBtn />
          </div>
        </div>
        <div className={styles.swiper__img_block}>
          <Swiper
            loop={true}
            speed={600}
            modules={[Navigation, Pagination, EffectCreative]}
            className={`swiper-img__list ${styles.img__list}`}
            spaceBetween={0}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              340: { slidesPerView: "auto" },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
          >
            {ImgsListArray.map((img) => (
              <SwiperSlide key={img.key}>
                <div className={styles.img_wrapper}>
                  <img
                    src={new URL(`${img.src}`, import.meta.url).href}
                    alt={img.key}
                    className={styles.img__item}
                  />
                  <div
                    className={styles.img_overlay}
                    data-animate="image-fade"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <SwiperControls swiperRef={swiperRef} />
        </div>

        <div className={styles.about__content}>
          <p
            className={`${styles.about_content_title} ${
              lang === "srb" ? "srb" : ""
            }`}
          >
            {t.about_title}
          </p>
          <div className={styles.about_content_block}>
            <p className={styles.about_content_block_description}>
              {t.t_about_content_block}
            </p>
            <div className={styles.info__list}>
              {InfoListArray.map((information) => (
                <div className={styles.info__item} key={information.key}>
                  <p className={styles.info__name}>{information.name}</p>
                  <p className={styles.info__description}>{information.info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMain;
