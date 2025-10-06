import { useRef } from "react";
import styles from "./HomePage.module.css";
import Header from "../components/Header/Header";
import AboutMain from "../components/Main/AboutMain/AboutMain";
import Infrastructura from "../components/Main/Infrastructure/Infrastructure";
import SectionMain from "../components/Main/SectionMain/SectionMain";
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
import {
  useGlobalTextAnimations,
  useLenisRef,
  useParallaxAnimation,
  useScrollToLocation,
  useUnifiedScrollRefresh,
} from "../hooks/useAnimations"; // animation import

type LenisRef = { lenis: Lenis | undefined };

const HomePage = () => {
  const { t, lang } = useLang();
  const lenisRef = useRef<LenisRef>(null);
  const parallaxRef = useResponsiveRef<HTMLDivElement>(
    1000
  ) as React.RefObject<HTMLElement>;
  useUnifiedScrollRefresh(); // unified refresh all of animations
  useScrollToLocation(); //  scroll for location.state
  useLenisRef(lenisRef); // lenis scroll
  useParallaxAnimation(parallaxRef); // parallax

  useGlobalTextAnimations(); // text animation

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
              ref={parallaxRef as React.RefObject<HTMLDivElement>}
              className={styles.parallax__container}
            >
              <img
                className={styles.parallax_image}
                src={new URL("/images/comfortable.jpg", import.meta.url).href}
                alt="Comfortable"
                loading="eager"
                decoding="sync"
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
          <p className={styles.parallax_descr}>{t.t_par_descrt}</p>
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
