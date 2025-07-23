import { useEffect, useRef } from "react";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
import styles from "./AboutMain.module.css";
import SplitText from "gsap/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  EffectCreative,
  FreeMode,
  Navigation,
  Pagination,
} from "swiper/modules";
import { useSwiper } from "swiper/react";
const AboutMain = () => {
  interface ImgsListType {
    [key: string]: string;
  }
  interface InfoListType {
    [key: string]: string;
  }
  const InfoListArray: { key: string; name: string; info: string }[] = [
    { key: "Location", name: "Location", info: "Niš, Serbia" },
    { key: "Complex area", name: "Complex area", info: "42,683 m²" },
    { key: "Structure", name: "Structure", info: "3P0+P+15" },
    { key: "Number of apartments", name: "Number of apartments", info: "326" },
    { key: "Parking spaces", name: "Parking spaces", info: "386" },
  ];
  const ImgsListArray: { key: string; src: string }[] = [
    { key: "curves-horizon", src: "curves-horizon.jpg" },
    { key: "futures-balcones", src: "futures-balcones.jpg" },
    { key: "street-hythm", src: "street-hythm.jpg" },
    { key: "urban-oasis", src: "urban-oasis.jpg" },
  ];
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const titlesArray = document.querySelectorAll('[data-split="title"]'); // или ".animate-text"
    var tl = gsap.timeline();
    gsap.registerPlugin(ScrollTrigger);
    titlesArray.forEach((heading) => {
      const split = new SplitText(heading, { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });
    const blockNamesArray = document.querySelectorAll(
      '[data-split="block-name"]'
    );

    blockNamesArray.forEach((name) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: name,
          start: "top 80%", // когда блок входит в зону
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.from(name, {
        opacity: 0,
        x: -50,
        ease: "back.out(1.7)",
        duration: 2,
      });
    });
    const paragraphs = document.querySelectorAll('[data-animate="fade-up"]');

    paragraphs.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 70,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });
    const imagesArray = document.querySelectorAll(
      '[data-animate="image-fade"]'
    );
    imagesArray.forEach((img) => {
      gsap.to(img, {
        top: "100%",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });
  }, []);
  return (
    <section className={styles.about} id="about-project">
      <div className={styles.about__body}>
        <div className={styles.about__block}>
          <div
            className={`section_name ${styles.about__name}`}
            data-split="block-name"
          >
            About the project
          </div>
          <div className={styles.about_text_block}>
            <h2
              className={styles.about_text_block_title}
              data-animate="fade-up"
            >
              Creating a space <br /> inspired by classics
            </h2>
            <div className={styles.about_block_text}>
              <p data-animate="fade-up">
                After the distinctive Beethoven's Park, which provided a home
                for families and individuals in a complex of 75 apartments, we
                continue to build in the same spirit — combining opulence,
                elegance, comfort and luxury.
              </p>
              <p data-animate="fade-up">
                Just as the world's greatest composers Beethoven and Chopin
                created music that inspires, our new commercial and residential
                complex, Chopin Park, exudes that artistic vision.
              </p>
            </div>
          </div>
          <div className={styles.about__apart_btn}>
            <SelectApartmentBtn />
          </div>
        </div>
        <Swiper
          loop={true}
          speed={600}
          modules={[Navigation, Pagination, EffectCreative]}
          className={`swiper-img__list ${styles.img__list}`}
          spaceBetween={0}
          breakpoints={{
            768: {
              slidesPerView: "auto",
            },
            1024: {
              slidesPerView: 3,
            },
            1440: {
              slidesPerView: 4,
            },
          }}
        >
          {ImgsListArray.map((img) => (
            <SwiperSlide key={img.key}>
              <div className={styles.img_wrapper}>
                <img
                  src={`./images/${img.src}`}
                  alt={img.key}
                  className={styles.img__item}
                />
                <div
                  className={styles.img_overlay}
                  data-animate="image-fade"
                ></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.about__content}>
          <p className={styles.about_content_title}>About</p>
          <div className={styles.about_content_block}>
            <p className={styles.about_content_block_description}>
              Chopin Park offers a refined living experience, blending luxury
              with functionality. Thoughtfully designed, it provides elegant
              homes, commercial spaces, wellness facilities, and business
              apartments for a balanced lifestyle.
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
