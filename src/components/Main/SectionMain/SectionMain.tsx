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

    gsap.to(img, {
      width: "100vw",
      height: "100vh",
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "25% 25%",
        end: "+=100",
        scrub: 1.2,
        pin: mainBody.current,
        anticipatePin: 1,
      },
    });
  }, []);
  return (
    <section className={styles.main}>
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
