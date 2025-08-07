import  { useEffect, useRef } from "react";
import styles from "./SpaceStructure.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SpaceStructure = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  type DescriptionBlock = {
    text: string[];
    img: string[];
  };

  type LamelaItem = {
    name: string;
    description: DescriptionBlock;
  };

  const structureCards: LamelaItem[] = [
    {
      name: "Lamela A",
      description: {
        text: [
          "A majestic 15-story tower featuring 182 residential units.",
          "Thanks to modern engineering solutions and elegant design, it shapes the distinctive architectural character of the complex.",
        ],
        img: ["structure-1.jpg", "structure-2.jpg"],
      },
    },
    {
      name: "Lamela B and C",
      description: {
        text: [
          "Harmonious residential spaces with a height of 10 stories, each containing 72 apartments.",
          "Thanks to modern engineering solutions and elegant design, it shapes the distinctive architectural character of the complex.",
        ],
        img: ["structure-3.jpg", "structure-4.jpg"],
      },
    },
    {
      name: "Parking",
      description: {
        text: [
          "Parking spaces are located on three underground levels.",
          "Elevators provide direct access between the parking area and residential floors, ensuring convenience and maximum comfort for residents.",
        ],
        img: ["structure-5.jpg", "structure-6.jpg"],
      },
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const overlays = gsap.utils.toArray<HTMLElement>(
      '[data-animate="image-fade"]'
    );
    const texts = gsap.utils.toArray<HTMLElement>(
      '[data-animate="fade-up-text"]'
    );

    texts.forEach((text) => {
      gsap.fromTo(
        text,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: text,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });
    overlays.forEach((overlay) => {
      gsap.fromTo(
        overlay,
        { top: "0%" },
        {
          top: "100%",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: overlay,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });
  }, []);
  return (
    <section className={styles.structure} data-section-id="light" id="space-structure">
      <div className={styles.structure__body}>
        <div className={styles.structure__block}>
          <div
            className={`section_name ${styles.structure__name}`}
            data-split="block-name"
          >
            Space structure
          </div>
          <div className={styles.structure_text_block}>
            <h2
              className={styles.structure_text_block_title}
              data-animate="fade-up"
            >
              Thoughtful layout for modern living
            </h2>
          </div>
        </div>
        <div className={styles.structure__cards}>
          {structureCards.map((card) => (
            <div className={styles.structure__card}>
              <div className={styles.card__name} data-animate="fade-up-text">
                {card.name}
              </div>
              <div className={styles.structure__card_block}>
                <div className={styles.structure__card_block_text}>
                  {card.description.text.map((paragraph, index) => (
                    <p key={`text-${index}`} data-animate="fade-up-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className={styles.structure__card_block_img}>
                  {card.description.img.map((image, index) => (
                    <div
                      className={styles.img_wrapper}
                      ref={imgRef}
                      key={`img-${index}`}
                    >
                      <img src={`./images/${image}`} alt="" />
                      <div
                        className={styles.img_overlay}
                        data-animate="image-fade"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaceStructure;
