import { useEffect, useRef } from "react";
import styles from "./SectionMain.module.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useLang } from "../../../hooks/useLang";
const SectionMain = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const mainBody = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    if (window.innerWidth <= 768) return;

    if (!imageRef.current || !mainBody.current) return;

    const img = imageRef.current;
    let animation: GSAPTween | undefined;
    const createAnimation = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleXVersion = window.innerWidth < 1410 ? 686 : 830;
      const scaleYVersion = window.innerWidth < 1410 ? 410 : 490;
      const scaleX = scaleXVersion / vw;
      const scaleY = scaleYVersion / vh;
      animation?.kill();
      animation = gsap.fromTo(
        img,
        {
          yPercent: 0,
          scaleX,
          scaleY,
        },
        {
          yPercent: 13.2,
          scaleX: 1,
          scaleY: 1,
          maxWidth: "100vw",
          maxHeight: "100vh",
          ease: "none",
          scrollTrigger: {
            trigger: mainBody.current,
            start: () => `center center`,
            end: () => `bottom bottom`,
            scrub: true,
            pin: img,
            pinSpacing: false,
          },
        }
      );
    };

    createAnimation();
    window.addEventListener("resize", createAnimation);
    return () => {
      animation?.kill();
      window.removeEventListener("resize", createAnimation);
    };
  }, []);
  const { t } = useLang();
  return (
    <section
      className={styles.main}
      id="main"
      data-section-id="dark-green"
      ref={mainBody}
    >
      <div className={styles.main__body}>
        <div className={styles.title_block}>
          <div className={styles.title_block_body}>
            <div className="">
              <p className={styles.text_welcome}>{t.t_welcome}</p>
              <h1 className={styles.title} data-split="title">
                {t.t_title}
              </h1>
            </div>
            <div
              className={styles.image__block}
              data-section-id="transparent-black"
            >
              <img
                ref={imageRef}
                className={styles.main_img}
                src="./images/main.jpg"
                alt=""
              />
            </div>
            <p className={styles.subtitle}>{t.t_subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionMain;
