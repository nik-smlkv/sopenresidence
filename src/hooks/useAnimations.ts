import { useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);

export const initMainImageAnimation = (
  mainBody: React.RefObject<HTMLElement>,
  imageRef: React.RefObject<HTMLElement>,
  styles: CSSModuleClasses
) => {
  const section = mainBody?.current;
  const imageWrapper = section?.querySelector(
    `.${styles.image__block}`
  ) as HTMLElement | null;
  const image = imageRef?.current;
  const header = document.querySelector("header") as HTMLElement | null;

  if (!section || !imageWrapper || !image) return;

  let triggers: ScrollTrigger[] = [];

  const init = () => {
    triggers.forEach((t) => t.kill());
    triggers = [];

    if (window.innerWidth <= 768) return;

    const sectionHeight = section.offsetHeight;
    const headerHeight = header?.offsetHeight || 0;

    const baseWidth = 830;
    const baseHeight = 490;
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    const targetScale = Math.max(scaleX, scaleY);

    // Убираем minHeight, если section уже имеет нужную высоту
    section.style.minHeight = `${sectionHeight}px`;

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
      end: "bottom bottom",
      pin: imageWrapper,
      pinSpacing: false,
      anticipatePin: 1,
    });

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
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    ).scrollTrigger;

    triggers.push(pinTrigger, scaleTrigger as ScrollTrigger);
  };

  const img = imageRef.current as HTMLImageElement | null;

  if (img && img.complete && img.naturalWidth > 0) {
    init();
  } else {
    img?.addEventListener("load", init);
  }

  return () => {
    image.removeEventListener("load", init);
    triggers.forEach((t) => t.kill());
    section.style.minHeight = "";
    gsap.set(image, { clearProps: "transform" });
  };
};

export const useParallaxAnimation = (
  parallaxRef: React.RefObject<HTMLElement>
) => {
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

    createScroll();

    return () => {
      triggerInstance?.kill();
    };
  }, []);
};

export const useLenisRef = (
  lenisRef: React.RefObject<{
    lenis?: {
      raf: (t: number) => void;
      scrollTo: (value: number) => void;
      scroll: number;
      on: (event: "scroll", callback: () => void) => void;
    };
  }>
) => {
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // ✅ ScrollTrigger proxy
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (value !== undefined) {
          lenis.scrollTo(value);
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: document.body });

    // ✅ Lenis RAF loop
    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
};

export const useScrollToLocation = () => {
  const location = useLocation();

  useEffect(() => {
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

    const handleScroll = () => {
      ScrollTrigger.refresh(); // пересчёт ScrollTrigger
      setTimeout(scrollAfterGSAP, 100); // скролл после пересчёта
    };

    // задержка после перехода
    const timeout = setTimeout(handleScroll, 500);

    return () => clearTimeout(timeout);
  }, [location.state]);
};

export const useStepsAnimation = (
  stepsRef: React.RefObject<HTMLElement>,
  cardsRef: React.RefObject<HTMLElement>,
  imageWrapperRef: React.RefObject<HTMLElement>,
  imageRef: React.RefObject<HTMLImageElement>,
  styles: CSSModuleClasses
) => {
  useLayoutEffect(() => {
    const section = stepsRef.current;
    const title = section?.querySelector(
      `.${styles.steps__title}`
    ) as HTMLElement | null;
    const cards = cardsRef.current;
    const imageWrapper = imageWrapperRef.current;
    const imageInner = imageRef.current;

    if (!section || !title || !cards || !imageWrapper || !imageInner) return;
    if (window.innerWidth <= 768) return;

    // ✅ Начальные стили
    gsap.set(title, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      willChange: "transform",
      immediateRender: true,
    });

    gsap.set(imageInner, {
      y: 0,
      scale: 0.46,
      transformOrigin: "50% 50%",
      willChange: "transform",
      immediateRender: true,
    });

    const init = () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      // 📌 Пин заголовка на весь блок steps
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: title,
        pinSpacing: true,
      });

      // 📦 Анимация карточек
      gsap.fromTo(
        cards,
        { y: 1200 },
        {
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "center center",
            scrub: true,
          },
        }
      );

      // 🔄 Скролл картинки вверх внутри imageWrapper
      gsap.fromTo(
        imageInner,
        { y: 0 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapper,
            start: "-=50",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      ScrollTrigger.create({
        trigger: imageWrapper,
        start: "top top",
        end: "bottom bottom",
        pin: imageWrapper,
        pinSpacing: true,
        anticipatePin: 1,
      });
      gsap.fromTo(
        imageInner,
        { scale: 0.46 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapper,
            start: "top top",
            end: "+=50%",
            scrub: true,
            pin: imageWrapper,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        }
      );
    };

    init();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.set(title, { clearProps: "all" });
      gsap.set(cards, { clearProps: "all" });
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
              duration: 0,
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
