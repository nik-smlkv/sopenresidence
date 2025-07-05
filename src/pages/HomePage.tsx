import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header/Header";
import AboutMain from "../components/Main/AboutMain/AboutMain";
import Infrastructura from "../components/Main/Infrastructure/Infrastructure";
import SectionMain from "../components/Main/SectionMain/SectionMain";
import styles from "./HomePage.module.css";
import { useEffect, useRef } from "react";
import HorizontParallax from "../components/Parallax/HorizontParallax";

const HomePage = () => {
  gsap.registerPlugin(ScrollTrigger);
  const parallaxRef = useRef(null);
  useEffect(() => {
    gsap.to(parallaxRef.current, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: "-50% 0%",
        end: "bottom center",
        scrub: true,
      },
    });
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <SectionMain />
        <img
          className={styles.video_stab}
          src="./images/video-stab.jpg"
          alt=""
        />
        <AboutMain />
        <Infrastructura />
        <section className={styles.parallax}>
          <div className={styles.parallax_block}>
            <div ref={parallaxRef} className={styles.parallax__container}>
              <img
                className={styles.parallax_image}
                src="./images/comfortable.jpg"
                alt="Comfortable"
              />
            </div>
          </div>
          <div className={styles.parallax_block_text}>
            <p>A comfortable lifestyle within walking distance</p>
          </div>
        <HorizontParallax />
        </section>
      </main>
    </>
  );
};

export default HomePage;
