import React, { useEffect, useRef, useState } from "react";
import styles from "./SectionMain.module.css";
import { useLang } from "../../../hooks/useLang";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";
import { initMainImageAnimation } from "../../../hooks/useAnimations";

const SectionMain: React.FC = () => {
  const { t } = useLang();
  const mainBody = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const cleanup = initMainImageAnimation(mainBody, imageRef, styles);
    return () => {
      if (typeof cleanup === "function" && imageLoaded) cleanup();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            <p className={styles.subtitle}>{t.t_subtitle}</p>
          </div>
        </div>
        <div
          className={styles.btn_block}
          onClick={() => {
            const target = document.getElementById("contact");
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {isMobile ? <SelectApartmentBtn /> : null}
        </div>
      </div>
    </section>
  );
};

export default SectionMain;
