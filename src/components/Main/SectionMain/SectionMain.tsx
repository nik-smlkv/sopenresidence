import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./SectionMain.module.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLang } from "../../../hooks/useLang";
import SelectApartmentBtn from "../../Buttons/SelectApartmentBtn";

gsap.registerPlugin(ScrollTrigger);

const SectionMain: React.FC = () => {
  const { t } = useLang();
  const mainBody = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useLayoutEffect(() => {
    const section = mainBody.current;
    const imageWrapper = section?.querySelector(
      `.${styles.image__block}`
    ) as HTMLElement | null;
    const image = imageRef.current;
    const header = document.querySelector("header") as HTMLElement | null;

    if (!section || !imageWrapper || !image) return;

    let triggers: ScrollTrigger[] = [];

    const init = () => {
      // Удаляем только свои триггеры
      triggers.forEach((t) => t.kill());
      triggers = [];

      if (window.innerWidth <= 768) return;

      const vh = window.innerHeight;
      const phaseLen = vh;
      const headerHeight = header?.offsetHeight || 0;

      const baseWidth = 830;
      const baseHeight = 550;
      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;
      const targetScale = Math.max(scaleX, scaleY);

      section.style.minHeight = `${phaseLen + vh}px`;

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: `top+=${headerHeight} top`,
        end: `+=${phaseLen}`,
        pin: imageWrapper,
        pinSpacing: false,
        anticipatePin: 1,
      });

      const scaleTrigger = gsap.fromTo(
        image,
        {
          width: baseWidth,
          height: baseHeight,
          position: "absolute",
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          transformOrigin: "50% 50%",
        },
        {
          scale: targetScale,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: `top+=${headerHeight} top`,
            end: `+=${phaseLen}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      ).scrollTrigger;

      triggers.push(pinTrigger, scaleTrigger as ScrollTrigger);

      // refresh после отрисовки
      setTimeout(() => ScrollTrigger.refresh(), 300);
    };

    // запуск с задержкой
    const delayedInit = () => {
      setTimeout(() => {
        init();
      }, 300); // задержка перед запуском
    };

    if (image.complete) {
      delayedInit();
    } else {
      image.addEventListener("load", delayedInit);
      window.addEventListener("load", delayedInit);
    }

    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
      image.removeEventListener("load", delayedInit);
      window.removeEventListener("load", delayedInit);
      triggers.forEach((t) => t.kill());
      section.style.minHeight = "";
      gsap.set(image, { clearProps: "transform" });
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
