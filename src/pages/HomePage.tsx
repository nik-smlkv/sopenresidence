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
import Form from "../components/Forms/Form";
import Footer from "../components/Footer/Footer";
import Steps from "../components/Main/Steps/Steps";
import ApartmentView from "../components/Main/ApartmentChoise/ApartmentView";
import Request from "../components/Main/Request/Request";
import SpaceStructure from "../components/Main/Structure/SpaceStructure";
import Locations from "../components/Main/Locations/Locations";
import { ReactLenis } from "@studio-freight/react-lenis";
import type Lenis from "@studio-freight/lenis";
import { frame, cancelFrame } from "motion/react";
type LenisRef = { lenis: Lenis | undefined };

const HomePage = () => {
  const lenisRef = useRef<LenisRef>(null);
  gsap.registerPlugin(ScrollTrigger);
  const parallaxRef = useRef(null);
  useEffect(() => {
    let triggerInstance: ScrollTrigger | undefined;

    const createScroll = () => {
      if (window.innerWidth <= 768 && parallaxRef.current) {
        triggerInstance = gsap.to(parallaxRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
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
        <section className={styles.parallax} id="advantages">
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
