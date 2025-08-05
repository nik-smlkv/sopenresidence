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
          yPercent: 0,
          scale: vw > 768 && vh > 600 ? 0.414 : 0.95,
          transformOrigin: "50% 50%",
        },
        {
			 yPercent: 12,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: mainBody.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
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
  return (
    <section className={styles.main} id="main" data-section-id="dark-green">
      <div className={styles.main__body} ref={mainBody}>
        <div className={styles.title_block}>
          <div className={styles.title_block_body}>
            <div className="">
              {" "}
              <p className={styles.text_welcome}>Welcome to</p>{" "}
              <h1 className={styles.title} data-split="title">
                sopen park
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
            <p className={styles.subtitle}>
              A modern space for living and business in the heart of Niš
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionMain;
