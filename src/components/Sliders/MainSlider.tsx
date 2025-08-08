import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "./Mainslider.scss";
import "swiper/swiper-bundle.css";
import React, { useRef, useState } from "react";
const SliderListInfo: {
  text: string;
  walk: string;
  meter: string;
}[] = [
  {
    text: "To take a leisurely stroll through the green alleys, breathe in the fresh air, and enjoy the peaceful atmosphere",
    walk: "5 minutes walk",
    meter: "or 280 meters",
  },
  {
    text: "Provide emergency care, specialized treatment, and academic medical programs",
    walk: " 15 minutes walk",
    meter: "or 770 meters",
  },
  {
    text: "Can enjoy dramatic performances, concerts, and festivals",
    walk: "7 minutes by car",
    meter: "or 1 kilometer",
  },
  {
    text: "You can indulge in a shopping experience",
    walk: "10 minutes by car",
    meter: "or 1,5 kilometer",
  },
  {
    text: "To step inside the monumental dome, feel the timeless serenity of sacred space, and admire the brilliance of Byzantine-inspired mosaics.",
    walk: "10 minutes by car",
    meter: "or 1,5 kilometer",
  },
];
const SliderListImgs: {
  img: string;
}[] = [
  {
    img: "happy-couple-with-picnic-basket-summer-park.jpg",
  },
  {
    img: "pretty-female-with-drink-paperbags-her-husband-passing-by-large-shopwindow-mall-process-shopping.jpg",
  },
  {
    img: "mother-with-daughter-cinema.jpg",
  },
  {
    img: "professional-senior-asian-female-orthopedic-doctor-checking-her-patient-s-wrist-joint.jpg",
  },
  {
    img: "pretty-female-with-drink-paperbags.jpg",
  },
];
export function getSlideIndex(swiper: SwiperType): number {
  const slide = swiper.slides[swiper.activeIndex];
  const rawIndex = slide?.dataset?.swiperSlideIndex;

  if (typeof rawIndex === "string") {
    const parsed = parseInt(rawIndex, 10);
    if (!isNaN(parsed)) return parsed;
  }

  return swiper.realIndex ?? 0;
}
const SwiperControls = ({
  active,
  total,
  swiperRef,
}: {
  active: number;
  total: number;
  swiperRef: React.MutableRefObject<any>;
}) => {
  return (
    <div className="controls__wrapper">
      <div className="buttons__content">
        <button
          className="infra__prev"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 11.0001H1.75472M1.75472 11.0001L11.669 1.37744M1.75472 11.0001L11.669 20.6227"
              stroke="var(--acc-light-apr-tx)"
              stroke-width="1.5"
            />
          </svg>
        </button>
        <button
          className="infra__next"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11.0001H19.2453M19.2453 11.0001L9.33105 1.37744M19.2453 11.0001L9.33105 20.6227"
              stroke="var(--acc-main-green)"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
      <div className="fraction">
        {active + 1} / {total}
      </div>
    </div>
  );
};
const SliderText = ({
  active,
  total,
  swiperRef,
}: {
  active: number;
  total: number;
  swiperRef: React.MutableRefObject<any>;
}) => {
  const customPagination = { active, total };
  return (
    <>
      <div className="text__content">
        <div className="swiper__slide_info_block">
          {SliderListInfo.map((sliderInfo, index) =>
            customPagination.active == index ? (
              <React.Fragment key={index}>
                <div className="info_block_walk">
                  <p className="info_walk">{sliderInfo.walk}</p>
                  <p className="info_meter">{sliderInfo.meter}</p>
                </div>
                <span className="linie"></span>
                <div className="info_block_text">
                  <p>{sliderInfo.text}</p>
                </div>
              </React.Fragment>
            ) : null
          )}
        </div>
        <SwiperControls
          active={customPagination.active}
          total={customPagination.total}
          swiperRef={swiperRef}
        />
      </div>
    </>
  );
};
const MainSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <div className="swiper__infra">
      <SliderText
        active={activeSlide}
        total={SliderListImgs.length}
        swiperRef={swiperRef}
      />
      <Swiper
        loop={true}
        speed={600}
        modules={[Navigation, Pagination]}
        grabCursor={true}
        spaceBetween={20}
        slidesPerView={"auto"}
        /*             slidesPerView: 1.3, */
        breakpoints={{
          1440: {
            /*             slidesPerView: 1.1, */
          },
          1200: {
            spaceBetween: 20,
          },
          340: {
            spaceBetween: 10,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onTransitionEnd={(swiper) => {
          const index = getSlideIndex(swiper);
          setActiveSlide(index);
        }}
      >
        {SliderListImgs.map((sliderInfo, index) => (
          <SwiperSlide key={index} className="swiper__slide_infrastructure">
            <img src={`./images/${sliderInfo.img}`} alt={`Slide ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainSlider;
