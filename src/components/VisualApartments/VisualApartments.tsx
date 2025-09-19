import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import styles from "./VisualApartments.module.css";
import { fetchExcelFromPublic, type Apartment } from "../../utils/utils";
import { useLang } from "../../hooks/useLang";
import VisualTooltip from "../VisualTooltip/VisualTooltip";
import { floorPaths } from "./floorPaths";
import FloorPlan from "../FloorPlan/FloorPlan";
import { useNavigate } from "react-router-dom";
const VisualApartments = () => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLang();
  const navigate = useNavigate();

  const handleFloorClick = (e: React.MouseEvent<SVGPathElement>) => {
    const rawFloor = e.currentTarget.dataset.floor;
    const floor = rawFloor ? parseInt(rawFloor, 10) : null;
    if (floor !== null && !isNaN(floor)) {
      navigate(`/floor/${floor}`);
    }
  };

  useEffect(() => {
    fetchExcelFromPublic()
      .then(setApartments)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      });
  }, []);

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  };
  const getFloorStats = (floor: number) => {
    const filtered = apartments.filter(
      (apt) => apt.floor === floor /* && apt.status === "available" */
    );

    const count = filtered.length;
    const areas = filtered.map((apt) => apt.area);
    const minArea = Math.min(...areas);
    const maxArea = Math.max(...areas);

    return { count, minArea, maxArea };
  };
  const maxFloor = Math.max(...apartments.map((apt) => apt.floor));
  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const rawFloor = e.currentTarget.dataset.floor;
    const floor = rawFloor ? parseInt(rawFloor, 10) : null;
    if (floor === null || isNaN(floor)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { count, minArea, maxArea } = getFloorStats(floor);
    setTooltip({
      visible: true,
      x: rect.right - 231,
      y: rect.top,
      content: (
        <div className={styles.visual_tooltip}>
          <div className={styles.tooltip_floor}>
            <p className={styles.tooltip_floor_num}>{floor}</p>
            <p className={styles.tooltip_floor_txt}>Floor</p>
          </div>
          <div className={styles.visual_info_block}>
            <p className={styles.visual_tooltip_count_apt}>
              {count} apartments
            </p>
            <p className={styles.visual_tooltip_area_meter}>
              {minArea}–{maxArea} m²
            </p>
          </div>
        </div>
      ),
    });
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section
          className={styles.visual_floor_section}
          data-section-id="transparent"
        >
          <div className={styles.visual_floor_section_container}>
            <div className={styles.visual__body}>
              <Breadcrumbs />
              <div className={styles.visual_title_block}>
                <p className={styles.apart_info_txt}>({maxFloor})</p>
                <h1 className={styles.visual_title}>Floor plan</h1>
              </div>
            </div>
          </div>
          <div className={styles.svgWrapper}>
            <picture className={styles.plan_img}>
              <source
                srcSet="./images/2026-1117.jpg"
                media="(max-width: 767px)"
                type="image/jpeg"
              />
              <source
                srcSet="./images/2400-1323.jpg"
                media="(min-width: 768px) and (max-width: 1279px)"
                type="image/jpeg"
              />
              <source
                srcSet="./images/3000-1654.jpg"
                media="(min-width: 1280px)"
                type="image/jpeg"
              />
              <img
                src="./images/3000-1654.jpg"
                alt="Responsive background"
                className="responsiveImage"
              />
            </picture>
            <svg
              width="1920"
              height="1654"
              viewBox="0 0 1920 1654"
              fill="none"
              className={styles.svgImage}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              {floorPaths.map(({ floor, d }, index) => (
                <path
                  key={index}
                  d={d}
                  fill="#FFD9C3"
                 
                  className="plan_floor_click"
                  data-floor={floor}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleFloorClick}
                />
              ))}
            </svg>
            {tooltip.visible && (
              <VisualTooltip
                x={tooltip.x}
                y={tooltip.y}
                content={tooltip.content}
              />
            )}
            {selectedFloor !== null && <FloorPlan />}
          </div>
        </section>
      </main>
    </>
  );
};

export default VisualApartments;
