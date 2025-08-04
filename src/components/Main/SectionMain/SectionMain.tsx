import { useEffect, useRef } from "react";
import styles from "./SectionMain.module.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
const SectionMain = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const mainBody = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    if (!imageRef.current || !mainBody.current) return;

    const img = imageRef.current;
    let animation: GSAPTween | undefined;

    const createAnimation = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      animation?.kill();
      animation = gsap.fromTo(
        img,
        {
          maxWidth: vw > 768 ? "830px" : "90vw",
          maxHeight: vh > 600 ? "496px" : "50vh",
        },
        {
          maxWidth: "100vw",
          maxHeight: "100vh",
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top+=25% top+=25%",
            end: "bottom+=25% bottom+=25%",
            scrub: 1.7,
            pin: mainBody.current,
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
  return (
    <section className={styles.main} id="main" data-section-id="dark-green">
      <div className={styles.title_block}>
        <p className={styles.text_welcome}>Welcome to</p>
        <h1 className={styles.title} data-split="title">
          sopen park
        </h1>
        <p className={styles.subtitle}>
          A modern space for living and business in the heart of Niš
        </p>
      </div>
      <div className={styles.pinWrapper} ref={mainBody}>
        <div className={styles.content}>
          <div className={styles.image__block}>
            <img
              ref={imageRef}
              className={styles.main_img}
              src="../../../public/images/main.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionMain;
