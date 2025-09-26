import { useEffect, useRef } from "react";
import styles from "./SectionMain.module.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useLang } from "../../../hooks/useLang";

gsap.registerPlugin(ScrollTrigger);

const SectionMain = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const mainBody = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    if (!imageRef.current || !mainBody.current) return;

 
    ScrollTrigger.config({
      autoRefreshEvents: "resize visibilitychange DOMContentLoaded load",
    });

    const img = imageRef.current;
    let animation: GSAPTween | undefined;

    const createAnimation = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scaleXVersion = vw > 2000 ? 1024 : vw < 1410 ? 686 : 830;
      const scaleYVersion = vw > 2000 ? 600 : vw < 1410 ? 410 : 490;

      const scaleX = scaleXVersion / vw;
      const scaleY = scaleYVersion / vh;

      animation?.scrollTrigger?.kill();
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
            start: "center center",
            end: "bottom bottom",
            scrub: true,
            pin: img,
            pinSpacing: true,
          },
        }
      );

      ScrollTrigger.refresh();
    };

    createAnimation();

    const handleResize = () => {
      setTimeout(() => {
        createAnimation();
        ScrollTrigger.refresh();
      }, 100);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      animation?.kill();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

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
            <div>
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
                src={new URL("/images/main.jpg", import.meta.url).href}
                alt="Main"
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
