import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header/Header";
import AboutMain from "../components/Main/AboutMain/AboutMain";
import Infrastructura from "../components/Main/Infrastructure/Infrastructure";
import SectionMain from "../components/Main/SectionMain/SectionMain";
import styles from "./HomePage.module.css";
import { useEffect, useRef } from "react";
import HorizontParallax from "../components/Parallax/HorizontParallax";
import Equipment from "../components/Main/Equipment/Equipment";
import Footer from "../components/Footer/Footer";
import Steps from "../components/Main/Steps/Steps";
import ApartmentView from "../components/Main/ApartmentChoise/ApartmentView";
import Request from "../components/Main/Request/Request";
import SpaceStructure from "../components/Main/Structure/SpaceStructure";
import Locations from "../components/Main/Locations/Locations";
import { ReactLenis } from "@studio-freight/react-lenis";
import type Lenis from "@studio-freight/lenis";
import { useResponsiveRef } from "../hooks/useResponsiveRef";
import { useLang } from "../hooks/useLang";

type LenisRef = { lenis: Lenis | undefined };

const HomePage = () => {
  const { t, lang } = useLang();
  const lenisRef = useRef<LenisRef>(null);
  gsap.registerPlugin(ScrollTrigger);
  const parallaxRef = useResponsiveRef<HTMLDivElement>(1000);
  useEffect(() => {
    let triggerInstance: ScrollTrigger | undefined;

    const targetEl = parallaxRef?.current;
    const createScroll = () => {
      if (targetEl) {
        triggerInstance = gsap.to(targetEl, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: targetEl,
            start: "-30% 0%",
            end: "bottom center",
            scrub: true,
          },
        }).scrollTrigger;
      }
    };

    const killScroll = () => {
      if (triggerInstance) {
        triggerInstance.kill();
        triggerInstance = undefined;
      }
    };

    const handleResize = () => {
      killScroll();
      createScroll();
    };

    createScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      killScroll();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <ReactLenis ref={lenisRef} root options={{}}>
      <Header />
      <main className={styles.main}>
        <SectionMain />
        <AboutMain />
        <Infrastructura />
        <Locations />
        <section
          className={styles.parallax}
          id="advantages"
          data-section-id="transparent-black"
        >
          <div className={styles.parallax_block}>
            <div
              ref={parallaxRef || undefined}
              className={styles.parallax__container}
            >
              <img
                className={styles.parallax_image}
                src="./images/comfortable.jpg"
                alt="Comfortable"
              />
            </div>
          </div>
          <div
            className={
              lang === "srb"
                ? styles.parallax_block_text_srb
                : styles.parallax_block_text
            }
          >
            <p>{t.t_parallax_title}</p>
          </div>
        </section>
        <HorizontParallax />
        <Equipment />
        <Steps />
        <SpaceStructure />
        <ApartmentView />
        <Request />
        <Footer />
      </main>
    </ReactLenis>
  );
};

export default HomePage;
