import { useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);

export const useMainImageAnimation = (
  mainBody: React.RefObject<HTMLElement>,
  imageRef: React.RefObject<HTMLElement>,
  styles: CSSModuleClasses
) => {
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
      triggers.forEach((t) => t.kill());
      triggers = [];

      if (window.innerWidth <= 768) return;

      const vh = window.innerHeight;
      const phaseLen = vh;
      const headerHeight = header?.offsetHeight || 0;

      const baseWidth = 830;
      const baseHeight = 490;
      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;
      const targetScale = Math.max(scaleX, scaleY);

      section.style.minHeight = `${phaseLen + vh}px`;

      // ✅ Устанавливаем размеры и позицию сразу
      gsap.set(image, {
        width: baseWidth,
        height: baseHeight,
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
      });

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: `top+=${headerHeight} top`,
        end: `+=${phaseLen}`,
        pin: imageWrapper,
        pinSpacing: false,
        anticipatePin: 1,
      });

      // ✅ Масштабирование через fromTo
      const scaleTrigger = gsap.fromTo(
        image,
        { scale: 1 },
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
    };

    if ((image as HTMLImageElement).complete) {
      init();
    } else {
      image.addEventListener("load", init);
    }

    return () => {
      image.removeEventListener("load", init);
      triggers.forEach((t) => t.kill());
      section.style.minHeight = "";
      gsap.set(image, { clearProps: "transform" });
    };
  }, []);
};

export const useParallaxAnimation = (
  parallaxRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    let triggerInstance: ScrollTrigger | undefined;
    const targetEl = parallaxRef.current;

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

    createScroll();

    return () => {
      triggerInstance?.kill();
    };
  }, []);
};

export const useLenisRef = (
  lenisRef: React.RefObject<{ lenis?: { raf: (t: number) => void } }>
) => {
  useEffect(() => {
    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);
};

export const useScrollToLocation = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (!scrollTo) return;

    const scrollAfterGSAP = () => {
      const el = document.getElementById(scrollTo);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    if (document.readyState === "complete") {
      scrollAfterGSAP();
    } else {
      window.addEventListener("load", scrollAfterGSAP);
    }

    return () => {
      window.removeEventListener("load", scrollAfterGSAP);
    };
  }, [location.state]);
};

export const useStepsAnimation = (
  stepsRef: React.RefObject<HTMLElement>,
  cardsRef: React.RefObject<HTMLElement>,
  imageRef: React.RefObject<HTMLElement>,
  styles: CSSModuleClasses
) => {
  useLayoutEffect(() => {
    const section = stepsRef.current;
    const title = section?.querySelector(
      `.${styles.steps__title}`
    ) as HTMLElement | null;
    const cards = cardsRef.current;
    const imageWrapper = imageRef.current;
    const imageInner = imageWrapper?.querySelector(
      `.${styles.steps__img}`
    ) as HTMLElement | null;

    if (!section || !title || !cards || !imageWrapper || !imageInner) return;
    if (window.innerWidth <= 768) return;

    const init = () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const vh = window.innerHeight;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: title,
        pinSpacing: false,
      });

      gsap.set(title, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        willChange: "transform",
      });

      gsap.fromTo(
        cards,
        { y: vh },
        {
          y: -vh * 1.2,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "center center",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        imageInner,
        { y: vh * 0.6 },
        {
          y: -vh * 1.1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "center center",
            scrub: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: section,
        start: "center center",
        end: "bottom bottom",
        pin: imageWrapper,
        pinSpacing: false,
        anticipatePin: 1,
        onEnter: () => gsap.set(imageInner, { y: 0 }),
        onLeaveBack: () => gsap.set(imageInner, { y: vh * 0.6, scale: 0.46 }),
      });

      gsap.fromTo(
        imageInner,
        { scale: 0.46, transformOrigin: "50% 50%" },
        {
          scale: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "center center",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    };

    init();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.set(title, { clearProps: "all" });
      gsap.set(imageInner, { clearProps: "all" });
    };
  }, []);
};

export const useGlobalTextAnimations = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function () {
        const triggerStart = "top 95%";

        const titlesArray = document.querySelectorAll('[data-split="title"]');
        titlesArray.forEach((heading) => {
          const split = new SplitText(heading, { type: "chars" });
          gsap.from(split.chars, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: heading,
              start: triggerStart,
              once: true, // ✅ запускается один раз
              invalidateOnRefresh: true,
            },
          });
        });

        const blockNamesArray = document.querySelectorAll(
          '[data-split="block-name"]'
        );
        blockNamesArray.forEach((name) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: name,
                start: triggerStart,
                once: true, // ✅ запускается один раз
                invalidateOnRefresh: true,
              },
            })
            .from(name, {
              opacity: 0,
              x: -50,
              ease: "back.out(1.7)",
              duration: 2,
            });
        });

        const paragraphs = document.querySelectorAll(
          '[data-animate="fade-up"]'
        );
        paragraphs.forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 70,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              once: true, // ✅ запускается один раз
              invalidateOnRefresh: true,
            },
          });
        });

        const imagesArray = document.querySelectorAll(
          '[data-animate="image-fade"]'
        );
        imagesArray.forEach((img) => {
          gsap.fromTo(
            img,
            { top: "0%" },
            {
              top: "100%",
              duration: 0.6,
              scrollTrigger: {
                trigger: img,
                start: triggerStart,
                once: true, // ✅ запускается один раз
                invalidateOnRefresh: true,
              },
            }
          );
        });
      },

      "(min-width: 561px) and (max-width: 768px)": function () {
        const triggerStart = "top 120%";

        const imagesArray = document.querySelectorAll(
          '[data-animate="image-fade"]'
        );
        imagesArray.forEach((img) => {
          gsap.fromTo(
            img,
            { top: "0%" },
            {
              top: "100%",
              duration: 0.6,
              scrollTrigger: {
                trigger: img,
                start: triggerStart,
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      },

      "(max-width: 560px)": function () {
        const triggerStart = "top 120%";

        const imagesArray = document.querySelectorAll(
          '[data-animate="image-fade"]'
        );
        imagesArray.forEach((img) => {
          gsap.fromTo(
            img,
            { top: "0%" },
            {
              top: "100%",
              duration: 0.6,
              scrollTrigger: {
                trigger: img,
                start: triggerStart,
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      },
    });
  }, []);
};

export const useUnifiedScrollRefresh = () => {
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.refresh();
    };

    // Обновление при любых изменениях экрана
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("load", refresh);

    // Обновление при смене zoom, DPI, или других layout-сдвигов
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("load", refresh);
      observer.disconnect();
    };
  }, []);
};
