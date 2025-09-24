import React, { useEffect, useRef, useState } from "react";
import styles from "./FloorPlan.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useApartments } from "../../context/ApartmentsContext";
import VisualTooltip from "../VisualTooltip/VisualTooltip";
import { fetchExcelFromPublic, type Apartment } from "../../utils/utils";
import { useLang } from "../../hooks/useLang";
import Request from "../Main/Request/Request";
import ApartmentModal from "../ApartmentModal/ApartmentModal";

const FloorPlan = () => {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const { apartments, loading } = useApartments();
  type LocationState = {
    selectedApartment?: Apartment;
  };
  const [manualApartments, setManualApartments] = useState<Apartment[] | null>(
    null
  );
  const effectiveApartments = manualApartments ?? apartments;
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelAttempted, setExcelAttempted] = useState(false);

  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);

  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const activeFloorRef = useRef<HTMLLIElement | null>(null);
  const [showHint, setShowHint] = useState(false);
  const location = useLocation();
  const state = location.state as LocationState | null;
  useEffect(() => {
    if (!loading && effectiveApartments.length === 0 && floorId) {
      const floorNum = parseInt(floorId, 10);
      const exists = effectiveApartments.some((apt) => apt.floor === floorNum);

      if (!exists) navigate("/floor", { replace: true });
    }
  }, [floorId, effectiveApartments, loading, navigate]);

  // 📦 Fallback загрузка из Excel
  useEffect(() => {
    if (
      !loading &&
      apartments.length === 0 &&
      !manualApartments &&
      !excelAttempted
    ) {
      setExcelLoading(true);
      setExcelAttempted(true); // ✅ чтобы не повторять загрузку

      fetchExcelFromPublic()
        .then((data) => {
          if (data.length > 0) setManualApartments(data);
        })
        .catch((err) =>
          console.error(`Ошибка при загрузке Excel: ${excelLoading}`, err)
        )
        .finally(() => setExcelLoading(false));
    }
  }, [loading, apartments, manualApartments, excelAttempted]);
  useEffect(() => {
    const aptFromState = state?.selectedApartment;
    if (aptFromState) {
      setSelectedApartment(aptFromState);
      window.history.replaceState({}, document.title); // очищает state
    }
  }, [state]);

  // 🧠 Вычисляем этаж
  useEffect(() => {
    if (loading || effectiveApartments.length === 0) return;

    const uniqueFloors = Array.from(
      new Set(effectiveApartments.map((apt) => apt.floor))
    ).sort((a, b) => b - a);

    const resolvedFloor = floorId
      ? parseInt(floorId, 10)
      : uniqueFloors[0] ?? null;

    if (resolvedFloor !== null) {
      setSelectedFloor(resolvedFloor);
    }
  }, [floorId, effectiveApartments, loading]);

  // 🚨 Редирект, если floorId невалиден

  // 📐 Подгонка высоты блока
  useEffect(() => {
    if (refA.current && refB.current) {
      const computed = getComputedStyle(refA.current);
      const height = refA.current.offsetHeight;
      const paddingTop = parseFloat(computed.paddingTop);
      const paddingBottom = parseFloat(computed.paddingBottom);
      refB.current.style.maxHeight = `${height + paddingTop + paddingBottom}px`;
    }
  }, []);

  // 🎯 Скроллим к активному этажу
  useEffect(() => {
    if (activeFloorRef.current) {
      activeFloorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [selectedFloor]);

  // 🧭 Навигация по этажам
  const uniqueFloors = Array.from(
    new Set(effectiveApartments.map((apt) => apt.floor))
  ).sort((a, b) => b - a);
  const currentIndex =
    selectedFloor !== null ? uniqueFloors.indexOf(selectedFloor) : -1;
  const prevFloor =
    currentIndex !== -1 ? uniqueFloors[currentIndex + 1] : undefined;
  const nextFloor =
    currentIndex !== -1 ? uniqueFloors[currentIndex - 1] : undefined;

  const handleArrowClick = (floor?: number) => {
    if (floor !== undefined) navigate(`/floor/${floor}`);
  };

  // Обработка SVG
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const normalize = (str: string) => str.replace(/\s+/g, "").toUpperCase();

    const polygons = svg.querySelectorAll(
      "polygon[data-label], path[data-label]"
    );
    polygons.forEach((el) => {
      const label = el.getAttribute("data-label");
      if (!label) return;

      const bbox = (el as SVGGraphicsElement).getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", String(centerX));
      circle.setAttribute("cy", String(centerY));
      circle.setAttribute("r", "46");
      circle.setAttribute("fill", "#6C776D");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      group.setAttribute("pointer-events", "none");
      text.setAttribute("x", String(centerX));
      text.setAttribute("y", String(centerY));
      text.setAttribute("class", "svg-label");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.textContent = label;

      group.appendChild(circle);
      group.appendChild(text);
      el.parentNode?.appendChild(group);

      const handleMouseEnter = (e: MouseEvent) => {
        const target = e.currentTarget as SVGGraphicsElement;
        const rawLabel = target.getAttribute("data-label");
        if (!rawLabel) return;
        const label = rawLabel.slice(1);

        let section = "";
        let current: Element | null = target;
        while (current) {
          if (current.tagName === "g" && current.hasAttribute("data-name")) {
            section = current.getAttribute("data-name") || "";
            break;
          }
          current = current.parentElement;
        }
        if (!section) return;

        const fullId = `${section} ${label}`;
        const apt = effectiveApartments.find(
          (a) => normalize(a.id) === normalize(fullId)
        );
        if (!apt) return;

        if (window.matchMedia("(min-width: 1024px)").matches) {
          setTooltip({
            x: e.clientX - 600,
            y: e.clientY - 10,
            content: (
              <div className={styles.visual_tooltip}>
                <div className={styles.tooltip_floor}>
                  <p className={styles.tooltip_floor_num}>{rawLabel}</p>
                  <p className={styles.tooltip_floor_txt}>
                    {t.t_flor_txt} {apt.floor}
                  </p>
                </div>
                <div className={styles.visual_info_block}>
                  <p className={styles.visual_tooltip_area_meter}>
                    {apt.area} m²
                  </p>
                  <p className={styles.visual_tooltip_count}>
                    {apt.bedrooms + 1} rooms
                  </p>
                </div>
              </div>
            ),
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        const target = e.currentTarget as SVGGraphicsElement;
        const bbox = target.getBBox();
        const rightX = bbox.x + bbox.width;
        const centerY = bbox.y + bbox.height / 2;

        const pt = target.ownerSVGElement!.createSVGPoint();
        pt.x = rightX;
        pt.y = centerY;

        const screenCTM = target.getScreenCTM();
        if (!screenCTM) return;

        const transformed = pt.matrixTransform(screenCTM);

        setTooltip((prev) =>
          prev ? { ...prev, x: transformed.x, y: transformed.y } : null
        );
      };

      const handleMouseLeave = () => setTooltip(null);

      const handleClick = (e: MouseEvent) => {
        const target = e.currentTarget as SVGGraphicsElement;
        const rawLabel = target.getAttribute("data-label");
        if (!rawLabel) return;
        const label = rawLabel.slice(1);

        let section = "";
        let current: Element | null = target;
        while (current) {
          if (current.tagName === "g" && current.hasAttribute("data-name")) {
            section = current.getAttribute("data-name") || "";
            break;
          }
          current = current.parentElement;
        }
        if (!section) return;

        const fullId = `${section} ${label}`;
        const apt = effectiveApartments.find(
          (a) => normalize(a.id) === normalize(fullId)
        );
        if (!apt) return;

        setSelectedApartment(apt);
      };

      const mediaQuery = window.matchMedia("(max-width: 1024px)");
      if (mediaQuery.matches && el) {
        el.addEventListener("mouseenter", (e) =>
          handleMouseEnter(e as MouseEvent)
        );
      } else if (el) {
        el.addEventListener("mouseenter", (e) =>
          handleMouseEnter(e as MouseEvent)
        );
      }

      el.addEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent));

      el.addEventListener("mouseleave", () => handleMouseLeave());

      el.addEventListener("click", (e) => handleClick(e as MouseEvent));
    });
  }, [effectiveApartments, t]);

  useEffect(() => {
    const svgDoc = svgRef.current?.ownerDocument;
    if (!svgDoc) return;

    const floorGroups = svgDoc.querySelectorAll("g[data-floor]");
    floorGroups.forEach((group) => {
      const floor = parseInt(group.getAttribute("data-floor") || "0", 10);
      const el = group as HTMLElement;

      el.style.display = floor === selectedFloor ? "block" : "none";
      el.style.cursor = "pointer";
      el.onclick = () => navigate(`/floor/${floor}`);
    });

    const apartmentElements = svgDoc.querySelectorAll(".apartment");
    apartmentElements.forEach((el) => {
      el.addEventListener("mouseenter", () => el.classList.add("highlight"));
      el.addEventListener("mouseleave", () => el.classList.remove("highlight"));
      el.addEventListener("click", () => {
        const aptId = el.getAttribute("id");
        if (aptId) navigate(`/apartment/${aptId}`);
      });
    });

    return () => {
      floorGroups.forEach((group) => {
        const el = group as HTMLElement;
        el.onclick = null;
      });

      apartmentElements.forEach((el) => {
        el.removeEventListener("mouseenter", () => {});
        el.removeEventListener("mouseleave", () => {});
        el.removeEventListener("click", () => {});
      });
    };
  }, [selectedFloor]);

  useEffect(() => {
    const el = refA.current;
    if (!el) return;

    if (selectedApartment) {
      el.classList.add("modalOpen");
    } else {
      el.classList.remove("modalOpen");
    }
  }, [selectedApartment]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hasSeen = localStorage.getItem("scrollHintShown");

    if (isMobile && !hasSeen) {
      setShowHint(true);
      localStorage.setItem("scrollHintShown", "true");

      const timeout = setTimeout(() => {
        setShowHint(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <>
      <Header />
      <main id="main">
        <div className={styles.view_apart_container}>
          <section
            className={styles.floor_plan}
            ref={refA}
            data-section-id="light"
          >
            <div className={styles.plan_info_content}>
              <Link
                to={"/search-by-parameters"}
                className={styles.grid_view_btn}
              >
                <span>{t.t_grid_view_txt}</span>
              </Link>
              <h2 className={styles.floor_title}>
                {t.t_flor_txt} {selectedFloor}
              </h2>
            </div>

            <div className={styles.floor_plan_body}>
              <div className={styles.floor_info_block}>
                <div className={styles.floor_list_block}>
                  <span className={styles.floor_list_label}>
                    {t.t_flor_txt}
                  </span>
                  <div className={styles.floor_list_content}>
                    <span
                      className={styles.floor_arrow}
                      onClick={() => handleArrowClick(nextFloor)}
                      style={{
                        cursor: nextFloor ? "pointer" : "default",
                        opacity: nextFloor ? 1 : 0.3,
                      }}
                    >
                      <svg
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                      >
                        <path
                          d="M1.33203 8.8335L8.9987 1.16683L16.6654 8.8335"
                          stroke="#1D1D1D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <div className={styles.floor_list}>
                      <ul>
                        {uniqueFloors.map((f) => (
                          <li
                            key={f}
                            ref={f === selectedFloor ? activeFloorRef : null}
                            className={`${styles.floor_item} ${
                              f === selectedFloor ? styles.active_floor : ""
                            }`}
                            onClick={() => navigate(`/floor/${f}`)}
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span
                      className={styles.floor_arrow}
                      onClick={() => handleArrowClick(prevFloor)}
                      style={{
                        cursor: prevFloor ? "pointer" : "default",
                        opacity: prevFloor ? 1 : 0.3,
                      }}
                    >
                      <svg
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                      >
                        <path
                          d="M1.33203 8.8335L8.9987 1.16683L16.6654 8.8335"
                          transform="rotate(180 9 5)"
                          stroke="#1D1D1D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className={styles.section_block}>
                  <div className={styles.section_content}>
                    <span className={styles.section_list_label}>
                      {t.t_lam_txt}
                    </span>
                    <img
                      src={new URL("/images/n.png", import.meta.url).href}
                      alt="Section"
                    />
                  </div>
                  <img
                    className={styles.section_plan_img}
                    src={
                      new URL("/images/plan-little.svg", import.meta.url).href
                    }
                    alt="Plan"
                  />
                </div>
              </div>

              <div className={styles.floor_plan_image_wrapper}>
                <span className={styles.floor_plan_dus_str}>
                  Dusana Popovicha Street
                </span>
                <span className={styles.floor_plan_mokr_str}>
                  Mokrancheva Street
                </span>
                <span className={styles.floor_plan_ztsk_str}>
                  Zetska Street
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 3149 1310"
                  ref={svgRef}
                  className={styles.floor_svg}
                >
                  <g className="floor-group" data-floor="3" id="floor-3">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/3.png", import.meta.url).href
                      }
                    />

                    <g id="A5" data-name="A03">
                      <polygon
                        data-label="A01"
                        id="_x31_9"
                        data-name="_x31_"
                        className="st0"
                        points="567.4 777.7 580.8 777.5 580.9 780.6 607.7 780.6 607.7 777.3 682.8 777.6 683.4 739.1 687.1 739.1 686.1 547.7 567.4 548 567.4 777.7"
                      />
                      <polygon
                        data-label="A02"
                        id="_x32_9"
                        data-name="_x32_"
                        className="st0"
                        points="858.9 777.4 858.9 740 860.3 740 860.3 543 790.1 543 790.1 547.7 691.4 547.7 691.4 777.4 782.4 777.4 782.4 780.6 809.7 780.6 809.7 777.1 858.9 777.4"
                      />
                      <polygon
                        data-label="A03"
                        id="_x33_9"
                        data-name="_x33_"
                        className="st0"
                        points="1039.9 802.6 1039.9 783 1037.2 783 1037.2 739.1 1039.9 739.1 1039.9 547.4 941.8 547.4 941.8 543 866.3 543 866.3 739.4 867.7 739.4 867.7 777.7 881.4 777.7 881.4 780.6 907.4 780.6 907.4 777.4 917.2 777.4 917.2 802.6 1039.9 802.6"
                      />
                      <polygon
                        data-label="A04"
                        id="_x34_9"
                        data-name="_x34_"
                        className="st0"
                        points="1039.9 807.9 1039.9 1071 942.4 1071 942.4 1074.6 866.9 1074.6 866.9 838.1 881.1 838.1 881.1 834.9 908.6 834.9 908.6 838.1 917.2 838.1 917.2 807.9 1039.9 807.9"
                      />
                      <polygon
                        data-label="A05"
                        id="_x35_9"
                        data-name="_x35_"
                        className="st0"
                        points="860 1074.6 860 838.1 810.9 838.1 810.9 835.4 783 835.4 783 837.8 692 837.8 692 1071.3 790.1 1071.3 790.1 1074.6 860 1074.6"
                      />
                      <polygon
                        data-label="A06"
                        id="_x36_9"
                        data-name="_x36_"
                        className="st0"
                        points="685.2 837.8 685.2 1071.3 567.6 1071.3 567.6 837.8 581.4 837.8 581.4 835.4 609 835.4 609 837.7 685.2 837.8"
                      />
                      <path
                        data-label="A07"
                        id="_x37_9"
                        data-name="_x37_"
                        className="st0"
                        d="M561.7,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A08"
                        id="_x38_9"
                        data-name="_x38_"
                        className="st0"
                        points="377.7 1070.8 377.7 968.1 381.9 968.1 381.9 876.1 377.7 876.1 377.7 837.9 359.7 837.9 359.7 835.4 332.6 835.4 332.6 838.8 123.7 838.8 130.1 867.4 136.6 887.2 147.4 913.4 157.4 932.1 158.6 940.1 173.2 962.1 193 985.7 204.9 997.6 217.4 1009.2 217.7 1005.7 257.4 1033 280.7 1044.9 294.4 1051 313.9 1058 332.8 1063.6 355.5 1068 377.7 1070.8"
                      />
                      <polygon
                        data-label="A09"
                        id="_x39_9"
                        data-name="_x39_"
                        className="st0"
                        points="323.9 771.9 323.9 678.3 326.6 678.3 326.6 651 323.9 651 323.9 604.8 124.6 604.8 124.6 602.3 105.9 602.3 105.9 604.8 63.2 604.8 63.2 674.1 67.9 674.1 67.7 771.9 323.9 771.9"
                      />
                      <polygon
                        data-label="A10"
                        id="_x31_05"
                        data-name="_x31_0"
                        className="st0"
                        points="323.7 599 323.7 553.4 326.6 553.4 326.6 526.6 323.7 526.6 323.7 433.2 228.3 433.2 228.3 434.6 67.4 434.6 67.4 531.7 63.2 531.7 63.2 594.1 105.2 594.1 105.2 597.4 125 597.4 125 599 184.1 599 184.1 594.1 228.1 594.1 228.1 599 323.7 599"
                      />
                      <polygon
                        data-label="A11"
                        id="_x31_15"
                        data-name="_x31_1"
                        className="st0"
                        points="324.3 428.1 324.3 331.7 326.6 331.7 326.6 303.9 324.3 303.9 324.3 257.7 64.3 257.7 64.3 328.3 67.7 328.3 67.9 423.2 106.1 423.2 106.1 429.2 184.6 429.2 184.6 423.9 228.6 423.9 228.6 427.9 324.3 428.1"
                      />
                      <polygon
                        data-label="A12"
                        id="_x31_25"
                        data-name="_x31_2"
                        className="st0"
                        points="377.4 252.3 377.4 75.7 239.2 48.8 239.2 45.7 172.8 32.1 120.1 22.1 98.6 19 86.3 19.9 64.6 27.2 50.1 38.6 38.8 53 32.6 70.3 94.8 70.3 94.8 85.2 67.2 85.2 67.2 252.3 332.6 252.3 332.6 254.8 359.7 254.8 359.7 252.1 377.4 252.3"
                      />
                      <polygon
                        data-label="A13"
                        id="_x31_35"
                        data-name="_x31_3"
                        className="st0"
                        points="383.3 305.4 561.4 305.4 561.4 191 563.4 191 563.4 137.4 560.1 137.4 560.1 111.4 388.6 77.7 388.6 117.9 383.3 117.9 383.3 217.7 388.8 217.7 388.8 261.2 380.6 261.2 380.6 288.1 383.2 288.1 383.3 305.4"
                      />
                      <polygon
                        data-label="A14"
                        id="_x31_45"
                        data-name="_x31_4"
                        className="st0"
                        points="442.9 583.3 442.9 483.7 561.8 483.7 561.8 441.5 550.6 441.5 550.6 425.2 561.8 425.2 561.8 407 567.1 407.1 567.3 420 603.4 420 603.4 352.8 561.4 352.8 561.4 311.6 383.3 311.6 383.3 435.9 380.5 435.9 380.5 463.3 383.3 463.3 383.3 583.3 442.9 583.3"
                      />
                    </g>
                    <g id="B2" data-name="B03">
                      <polygon
                        data-label="B01"
                        id="_x31_10"
                        data-name="_x31_"
                        className="st0"
                        points="1257.4 833.4 1257.4 955.4 1229.5 955.4 1229.5 1074.6 1154.9 1074.6 1154.9 1068 1148.9 1068 1148.9 1070.7 1057.1 1070.7 1057.1 807.9 1179.7 807.9 1179.7 833.7 1207 833.7 1207 831.3 1234.6 831.3 1234.6 834 1257.4 833.4"
                      />
                      <polygon
                        data-label="B02"
                        id="_x32_10"
                        data-name="_x32_"
                        className="st0"
                        points="1290 757.5 1290 584.8 1291.7 584.8 1291.7 543 1154.9 543 1154.9 548 1056.5 548 1056.5 802.6 1179.7 802.6 1179.7 777.7 1187.4 777.7 1187.4 780.3 1215.3 780.3 1215.3 777.4 1229.2 777.4 1229.2 756.9 1290 757.5"
                      />
                      <polygon
                        data-label="B03"
                        id="_x33_10"
                        data-name="_x33_"
                        className="st0"
                        points="1468.6 778 1468.6 547.7 1376.8 547.7 1376.8 543 1295 543 1295 757.2 1389 757.2 1389 780.8 1417.9 780.8 1417.9 777.2 1468.6 778"
                      />
                      <polygon
                        data-label="B04"
                        id="_x34_10"
                        data-name="_x34_"
                        className="st0"
                        points="1513.9 777.7 1561.2 777.7 1561.2 547.7 1474.8 547.7 1474.8 777.7 1486.9 777.7 1486.9 780.8 1514 780.8 1513.9 777.7"
                      />
                      <polygon
                        data-label="B05"
                        id="_x35_10"
                        data-name="_x35_"
                        className="st0"
                        points="1735.9 777.7 1735.9 543.4 1665.4 543.4 1665.4 547.7 1567.2 547.7 1567.2 777.7 1640.6 777.7 1640.6 780.8 1667.4 780.8 1667.4 777.4 1735.9 777.7"
                      />
                      <polygon
                        data-label="B06"
                        id="_x36_10"
                        data-name="_x36_"
                        className="st0"
                        points="1915.2 802.3 1915.2 547.4 1812.3 547.4 1812.3 543.4 1741 543.4 1741 778.3 1756.6 778.3 1756.6 780.8 1784.1 780.8 1784.1 777.7 1792.6 777.7 1792.6 802.3 1915.2 802.3"
                      />
                      <polygon
                        data-label="B07"
                        id="_x37_10"
                        data-name="_x37_"
                        className="st0"
                        points="1792.6 807.9 1915.2 807.9 1915.2 1071.2 1811.7 1071.2 1811.7 1075.7 1741 1075.7 1741 833.7 1756.6 833.7 1756.6 830.8 1784.1 830.8 1784.1 833.9 1792.6 833.9 1792.6 807.9"
                      />
                      <polygon
                        data-label="B08"
                        id="_x38_10"
                        data-name="_x38_"
                        className="st0"
                        points="1567.2 833.7 1640.3 833.7 1640.3 831 1667.9 831 1667.9 833.7 1735.9 833.7 1735.9 1075.7 1665 1075.7 1665 1070.8 1567.2 1070.8 1567.2 833.7"
                      />
                      <polygon
                        data-label="B09"
                        id="_x39_10"
                        data-name="_x39_"
                        className="st0"
                        points="1561 833.4 1561 1070.6 1463.7 1070.6 1463.7 1075.7 1389.4 1075.7 1389.4 833.4 1460.8 833.4 1460.8 831 1488.6 831 1488.6 833.4 1561 833.4"
                      />
                    </g>
                    <g id="C2" data-name="C03">
                      <polygon
                        data-label="C01"
                        id="_x31_11"
                        data-name="_x31_"
                        className="st0"
                        points="2488.6 833.4 2488.6 954.8 2459 954.8 2459 1074.8 2388.6 1074.8 2388.6 1070.6 2287.4 1070.6 2287.4 833.4 2440.6 833.4 2440.6 831 2467.7 831 2467.7 834.1 2488.6 833.4"
                      />
                      <polygon
                        data-label="C02"
                        id="_x32_11"
                        data-name="_x32_"
                        className="st0"
                        points="2206.3 831 2206.3 833.4 2282.1 833.4 2282.1 1070.6 2180.8 1070.6 2180.8 1074.8 2110.3 1074.8 2110.3 833.4 2178.3 833.4 2178.3 831 2206.3 831"
                      />
                      <polygon
                        data-label="C03"
                        id="_x33_11"
                        data-name="_x33_"
                        className="st0"
                        points="2105 1075.7 2105 833.7 2089 833.7 2089 831 2062.8 831 2062.8 833.2 2053.9 833.2 2053.9 807.9 1930.6 807.9 1930.6 1071.2 2034.6 1071.2 2034.6 1075.7 2105 1075.7"
                      />
                      <polygon
                        data-label="C04"
                        id="_x34_11"
                        data-name="_x34_"
                        className="st0"
                        points="2053.5 802.3 2053.5 778 2062.1 778 2062.1 780.6 2089.7 780.6 2089.7 778 2105 778 2105 543.4 2034.3 543.4 2034.3 547.7 1930.6 547.7 1930.6 802.3 2053.5 802.3"
                      />
                      <polygon
                        data-label="C05"
                        id="_x35_11"
                        data-name="_x35_"
                        className="st0"
                        points="2281.4 547.7 2281.4 778 2206.1 778 2206.1 780.3 2179.4 780.3 2179.4 777.7 2110.1 777.7 2110.1 543.4 2180.9 543.4 2180.9 548 2281.4 547.7"
                      />
                      <polygon
                        data-label="C06"
                        id="_x36_11"
                        data-name="_x36_"
                        className="st0"
                        points="2458.9 777.4 2458.9 543.4 2388.6 543.4 2388.6 547.4 2287.6 547.4 2287.6 777.4 2363.1 777.4 2363.1 780.3 2391 780.3 2391 778 2458.9 777.4"
                      />
                      <polygon
                        data-label="C07"
                        id="_x37_11"
                        data-name="_x37_"
                        className="st0"
                        points="2612.6 547.2 2612.6 757.4 2545.4 757.4 2545.4 765.4 2517.9 765.4 2517.9 757.4 2464.3 757.4 2464.3 543.4 2518.6 543.4 2518.6 547.7 2612.6 547.2"
                      />
                      <polygon
                        data-label="C08"
                        id="_x38_11"
                        data-name="_x38_"
                        className="st0"
                        points="2693.8 543.4 2693.8 571.4 2791.9 571.4 2791.9 782.4 2664.2 782.4 2664.2 777.1 2647.3 777.1 2647.3 780.3 2618 780.3 2618 543.4 2693.8 543.4"
                      />
                      <path
                        data-label="C09"
                        id="_x39_11"
                        data-name="_x39_"
                        className="st0"
                        d="M2791.9,788.6v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="4" id="floor-4">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/4.png", import.meta.url).href
                      }
                    />
                    <g id="A4" data-name="A04">
                      <polygon
                        data-label="A15"
                        id="_x31_6"
                        data-name="_x31_"
                        className="st0"
                        points="567.6 777.7 581 777.5 581.1 780.6 608 780.6 607.9 777.3 683.1 777.6 683.7 739.1 687.3 739.1 686.4 547.7 567.6 548 567.6 777.7"
                      />
                      <polygon
                        data-label="A16"
                        id="_x32_6"
                        data-name="_x32_"
                        className="st0"
                        points="859.1 777.4 859.1 740 860.6 740 860.6 543 790.3 543 790.3 547.7 691.7 547.7 691.7 777.4 782.6 777.4 782.6 780.6 809.9 780.6 809.9 777.1 859.1 777.4"
                      />
                      <polygon
                        data-label="A17"
                        id="_x33_6"
                        data-name="_x33_"
                        className="st0"
                        points="1040.1 802.6 1040.1 783 1037.4 783 1037.4 739.1 1040.1 739.1 1040.1 547.4 942 547.4 942 543 866.5 543 866.5 739.4 868 739.4 868 777.7 881.6 777.7 881.6 780.6 907.7 780.6 907.7 777.4 917.4 777.4 917.4 802.6 1040.1 802.6"
                      />
                      <polygon
                        data-label="A18"
                        id="_x34_6"
                        data-name="_x34_"
                        className="st0"
                        points="1040.1 807.9 1040.1 1071 942.6 1071 942.6 1074.6 867.1 1074.6 867.1 838.1 881.3 838.1 881.3 834.9 908.9 834.9 908.9 838.1 917.4 838.1 917.4 807.9 1040.1 807.9"
                      />
                      <polygon
                        data-label="A19"
                        id="_x35_6"
                        data-name="_x35_"
                        className="st0"
                        points="860.3 1074.6 860.3 838.1 811.1 838.1 811.1 835.4 783.2 835.4 783.2 837.8 692.3 837.8 692.3 1071.3 790.3 1071.3 790.3 1074.6 860.3 1074.6"
                      />
                      <polygon
                        data-label="A20"
                        id="_x36_6"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 837.8 685.4 1071.3 567.8 1071.3 567.8 837.8 581.7 837.8 581.7 835.4 609.2 835.4 609.2 837.7 685.4 837.8"
                      />
                      <path
                        data-label="A21"
                        id="_x37_6"
                        data-name="_x37_"
                        className="st0"
                        d="M561.9,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A22"
                        id="_x38_6"
                        data-name="_x38_"
                        className="st0"
                        points="377.4 838.3 377.4 875.9 381.7 875.9 381.7 968 378 968 378 1070.9 356 1068.2 355.5 1070.6 314 1060.6 314.8 1058.6 276.3 1042.9 275.1 1044.9 238.4 1023.2 239.6 1021.2 217.7 1005.1 217.7 1008.2 206.2 999 188.6 980.9 169.4 957.3 156.7 937.5 160.2 937.4 144.9 907.4 142.8 908.3 128 868.5 130.6 867.6 124.3 840 332.6 838.3 332.6 835.1 359.2 835.1 359.1 838.2 377.4 838.3"
                      />
                      <polygon
                        data-label="A23"
                        id="_x39_6"
                        data-name="_x39_"
                        className="st0"
                        points="324.1 771.9 324.1 678.3 326.8 678.3 326.8 651 324.1 651 324.1 604.8 124.8 604.8 124.8 602.3 106.1 602.3 106.1 604.8 63.4 604.8 63.4 674.1 68.1 674.1 67.9 771.9 324.1 771.9"
                      />
                      <polygon
                        data-label="A24"
                        id="_x31_04"
                        data-name="_x31_0"
                        className="st0"
                        points="323.9 599 323.9 553.4 326.8 553.4 326.8 526.6 323.9 526.6 323.9 433.2 228.6 433.2 228.6 434.6 67.7 434.6 67.7 531.7 63.4 531.7 63.4 594.1 105.4 594.1 105.4 597.4 125.2 597.4 125.2 599 184.3 599 184.3 594.1 228.3 594.1 228.3 599 323.9 599"
                      />
                      <polygon
                        data-label="A25"
                        id="_x31_14"
                        data-name="_x31_1"
                        className="st0"
                        points="324.6 428.1 324.6 331.7 326.8 331.7 326.8 303.9 324.6 303.9 324.6 257.7 64.6 257.7 64.6 328.3 68 328.3 68.1 423.2 106.3 423.2 106.3 429.2 184.8 429.2 184.8 423.9 228.8 423.9 228.8 427.9 324.6 428.1"
                      />
                      <polygon
                        data-label="A26"
                        id="_x31_24"
                        data-name="_x31_2"
                        className="st0"
                        points="377.7 252.3 377.7 75.7 239.4 48.8 239.4 45.7 173 32.1 120.3 22.1 102.3 19 89.4 21.7 79.1 28 69.3 39.4 64.6 53.4 64.6 70.3 95 70.3 95 85.2 67.4 85.2 67.4 252.3 332.8 252.3 332.8 254.8 359.9 254.8 359.9 252.1 377.7 252.3"
                      />
                      <polygon
                        data-label="A27"
                        id="_x31_34"
                        data-name="_x31_3"
                        className="st0"
                        points="383.5 305.4 561.6 305.4 561.6 191 563.7 191 563.7 137.4 560.3 137.4 560.3 111.4 388.8 77.7 388.8 117.9 383.5 117.9 383.5 217.7 389 217.7 389 261.2 380.8 261.2 380.8 288.1 383.4 288.1 383.5 305.4"
                      />
                      <polygon
                        data-label="A28"
                        id="_x31_44"
                        data-name="_x31_4"
                        className="st0"
                        points="443.1 583.3 443.1 483.7 562 483.7 562 441.5 550.8 441.5 550.8 425.2 562 425.2 562 407 567.3 407.1 567.6 419.3 603.1 419.7 603.1 352.8 561.6 352.8 561.6 311.6 383.5 311.6 383.5 435.9 380.7 435.9 380.7 463.3 383.5 463.3 383.5 583.3 443.1 583.3"
                      />
                    </g>
                    <g id="B1" data-name="B04">
                      <polygon
                        data-label="B10"
                        id="_x31_7"
                        data-name="_x31_"
                        className="st0"
                        points="1257.5 833.1 1257.5 955.2 1229.7 955.2 1229.7 1074.3 1155 1074.3 1155 1067.8 1149.1 1067.8 1149.1 1070.5 1057.2 1070.5 1057.2 807.7 1179.9 807.7 1179.9 833.4 1207.2 833.4 1207.2 831.1 1234.7 831.1 1234.7 833.7 1257.5 833.1"
                      />
                      <polygon
                        data-label="B11"
                        id="_x32_7"
                        data-name="_x32_"
                        className="st0"
                        points="1290.1 757.3 1290.1 584.6 1291.9 584.6 1291.9 542.8 1155 542.8 1155 547.8 1056.6 547.8 1056.6 802.3 1179.9 802.3 1179.9 777.4 1187.6 777.4 1187.6 780.1 1215.5 780.1 1215.5 777.1 1229.4 777.1 1229.4 756.7 1290.1 757.3"
                      />
                      <polygon
                        data-label="B12"
                        id="_x33_7"
                        data-name="_x33_"
                        className="st0"
                        points="1468.8 777.7 1468.8 547.5 1376.9 547.5 1376.9 542.8 1295.2 542.8 1295.2 757 1389.2 757 1389.2 780.6 1418.1 780.6 1418.1 777 1468.8 777.7"
                      />
                      <polygon
                        data-label="B13"
                        id="_x34_7"
                        data-name="_x34_"
                        className="st0"
                        points="1514.1 777.4 1561.4 777.4 1561.4 547.4 1474.9 547.4 1474.9 777.4 1487 777.4 1487 780.6 1514.1 780.6 1514.1 777.4"
                      />
                      <polygon
                        data-label="B14"
                        id="_x35_7"
                        data-name="_x35_"
                        className="st0"
                        points="1736.1 777.4 1736.1 543.2 1665.6 543.2 1665.6 547.4 1567.4 547.4 1567.4 777.4 1640.7 777.4 1640.7 780.6 1667.6 780.6 1667.6 777.2 1736.1 777.4"
                      />
                      <polygon
                        data-label="B15"
                        id="_x36_7"
                        data-name="_x36_"
                        className="st0"
                        points="1915.4 802.1 1915.4 547.2 1812.5 547.2 1812.5 543.2 1741.2 543.2 1741.2 778.1 1756.7 778.1 1756.7 780.6 1784.3 780.6 1784.3 777.4 1792.7 777.4 1792.7 802.1 1915.4 802.1"
                      />
                      <polygon
                        data-label="B16"
                        id="_x37_7"
                        data-name="_x37_"
                        className="st0"
                        points="1792.7 807.7 1915.4 807.7 1915.4 1071 1811.8 1071 1811.8 1075.4 1741.2 1075.4 1741.2 833.4 1756.7 833.4 1756.7 830.6 1784.3 830.6 1784.3 833.7 1792.7 833.7 1792.7 807.7"
                      />
                      <polygon
                        data-label="B17"
                        id="_x38_7"
                        data-name="_x38_"
                        className="st0"
                        points="1567.4 833.4 1640.5 833.4 1640.5 830.8 1668.1 830.8 1668.1 833.4 1736.1 833.4 1736.1 1075.4 1665.2 1075.4 1665.2 1070.6 1567.4 1070.6 1567.4 833.4"
                      />
                      <polygon
                        data-label="B18"
                        id="_x39_7"
                        data-name="_x39_"
                        className="st0"
                        points="1561.2 833.2 1561.2 1070.3 1463.8 1070.3 1463.8 1075.4 1389.6 1075.4 1389.6 833.2 1460.9 833.2 1460.9 830.8 1488.7 830.8 1488.7 833.2 1561.2 833.2"
                      />
                    </g>
                    <g id="C1" data-name="C04">
                      <polygon
                        data-label="C10"
                        id="_x31_8"
                        data-name="_x31_"
                        className="st0"
                        points="2488.9 833.2 2488.9 954.6 2459.3 954.6 2459.3 1074.6 2388.9 1074.6 2388.9 1070.3 2287.7 1070.3 2287.7 833.2 2440.9 833.2 2440.9 830.8 2468 830.8 2468 833.9 2488.9 833.2"
                      />
                      <polygon
                        data-label="C11"
                        id="_x32_8"
                        data-name="_x32_"
                        className="st0"
                        points="2206.6 830.8 2206.6 833.2 2282.4 833.2 2282.4 1070.3 2181.1 1070.3 2181.1 1074.6 2110.6 1074.6 2110.6 833.2 2178.6 833.2 2178.6 830.8 2206.6 830.8"
                      />
                      <polygon
                        data-label="C12"
                        id="_x33_8"
                        data-name="_x33_"
                        className="st0"
                        points="2105.3 1075.4 2105.3 833.4 2089.3 833.4 2089.3 830.8 2063.1 830.8 2063.1 833 2054.2 833 2054.2 807.7 1930.9 807.7 1930.9 1071 2034.9 1071 2034.9 1075.4 2105.3 1075.4"
                      />
                      <polygon
                        data-label="C13"
                        id="_x34_8"
                        data-name="_x34_"
                        className="st0"
                        points="2053.8 802.1 2053.8 777.7 2062.4 777.7 2062.4 780.4 2090 780.4 2090 777.7 2105.3 777.7 2105.3 543.2 2034.6 543.2 2034.6 547.5 1930.9 547.5 1930.9 802.1 2053.8 802.1"
                      />
                      <polygon
                        data-label="C14"
                        id="_x35_8"
                        data-name="_x35_"
                        className="st0"
                        points="2281.7 547.5 2281.7 777.7 2206.4 777.7 2206.4 780.1 2179.7 780.1 2179.7 777.4 2110.4 777.4 2110.4 543.2 2181.2 543.2 2181.2 547.8 2281.7 547.5"
                      />
                      <polygon
                        data-label="C15"
                        id="_x36_8"
                        data-name="_x36_"
                        className="st0"
                        points="2459.1 777.1 2459.1 543.2 2388.9 543.2 2388.9 547.2 2287.9 547.2 2287.9 777.1 2363.4 777.1 2363.4 780.1 2391.3 780.1 2391.3 777.7 2459.1 777.1"
                      />
                      <polygon
                        data-label="C16"
                        id="_x37_8"
                        data-name="_x37_"
                        className="st0"
                        points="2612.9 547 2612.9 757.2 2545.7 757.2 2545.7 765.2 2518.2 765.2 2518.2 757.2 2464.6 757.2 2464.6 543.2 2518.9 543.2 2518.9 547.4 2612.9 547"
                      />
                      <polygon
                        data-label="C17"
                        id="_x38_8"
                        data-name="_x38_"
                        className="st0"
                        points="2694.1 543.2 2694.1 571.2 2792.2 571.2 2792.2 782.2 2664.5 782.2 2664.5 776.9 2647.6 776.9 2647.6 780.1 2618.3 780.1 2618.3 543.2 2694.1 543.2"
                      />
                      <path
                        data-label="C18"
                        id="_x39_8"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.2,788.4v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="5" id="floor-5">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/5.png", import.meta.url).href
                      }
                    />
                    <g id="A4" data-name="A05">
                      <polygon
                        data-label="A29"
                        id="_x31_6"
                        data-name="_x31_"
                        className="st0"
                        points="567.6 777.7 581 777.5 581.1 780.6 608 780.6 607.9 777.3 683.1 777.6 683.7 739.1 687.3 739.1 686.4 547.7 567.6 548 567.6 777.7"
                      />
                      <polygon
                        data-label="A30"
                        id="_x32_6"
                        data-name="_x32_"
                        className="st0"
                        points="859.1 777.4 859.1 740 860.6 740 860.6 543 790.3 543 790.3 547.7 691.7 547.7 691.7 777.4 782.6 777.4 782.6 780.6 809.9 780.6 809.9 777.1 859.1 777.4"
                      />
                      <polygon
                        data-label="A31"
                        id="_x33_6"
                        data-name="_x33_"
                        className="st0"
                        points="1040.1 802.6 1040.1 783 1037.4 783 1037.4 739.1 1040.1 739.1 1040.1 547.4 942 547.4 942 543 866.5 543 866.5 739.4 868 739.4 868 777.7 881.6 777.7 881.6 780.6 907.7 780.6 907.7 777.4 917.4 777.4 917.4 802.6 1040.1 802.6"
                      />
                      <polygon
                        data-label="A32"
                        id="_x34_6"
                        data-name="_x34_"
                        className="st0"
                        points="1040.1 807.9 1040.1 1071 942.6 1071 942.6 1074.6 867.1 1074.6 867.1 838.1 881.3 838.1 881.3 834.9 908.9 834.9 908.9 838.1 917.4 838.1 917.4 807.9 1040.1 807.9"
                      />
                      <polygon
                        data-label="A33"
                        id="_x35_6"
                        data-name="_x35_"
                        className="st0"
                        points="860.3 1074.6 860.3 838.1 811.1 838.1 811.1 835.4 783.2 835.4 783.2 837.8 692.3 837.8 692.3 1071.3 790.3 1071.3 790.3 1074.6 860.3 1074.6"
                      />
                      <polygon
                        data-label="A34"
                        id="_x36_6"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 837.8 685.4 1071.3 567.8 1071.3 567.8 837.8 581.7 837.8 581.7 835.4 609.2 835.4 609.2 837.7 685.4 837.8"
                      />
                      <path
                        id="_x37_6"
                        data-name="_x37_"
                        className="st0"
                        d="M561.9,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A35"
                        id="_x38_6"
                        data-name="_x38_"
                        className="st0"
                        points="377.4 838.3 377.4 875.9 381.7 875.9 381.7 968 378 968 378 1070.9 356 1068.2 355.5 1070.6 314 1060.6 314.8 1058.6 276.3 1042.9 275.1 1044.9 238.4 1023.2 239.6 1021.2 217.7 1005.1 217.7 1008.2 206.2 999 188.6 980.9 169.4 957.3 156.7 937.5 160.2 937.4 144.9 907.4 142.8 908.3 128 868.5 130.6 867.6 124.3 840 332.6 838.3 332.6 835.1 359.2 835.1 359.1 838.2 377.4 838.3"
                      />
                      <polygon
                        data-label="A36"
                        id="_x39_6"
                        data-name="_x39_"
                        className="st0"
                        points="324.1 771.9 324.1 678.3 326.8 678.3 326.8 651 324.1 651 324.1 604.8 124.8 604.8 124.8 602.3 106.1 602.3 106.1 604.8 63.4 604.8 63.4 674.1 68.1 674.1 67.9 771.9 324.1 771.9"
                      />
                      <polygon
                        data-label="A37"
                        id="_x31_04"
                        data-name="_x31_0"
                        className="st0"
                        points="323.9 599 323.9 553.4 326.8 553.4 326.8 526.6 323.9 526.6 323.9 433.2 228.6 433.2 228.6 434.6 67.7 434.6 67.7 531.7 63.4 531.7 63.4 594.1 105.4 594.1 105.4 597.4 125.2 597.4 125.2 599 184.3 599 184.3 594.1 228.3 594.1 228.3 599 323.9 599"
                      />
                      <polygon
                        data-label="A38"
                        id="_x31_14"
                        data-name="_x31_1"
                        className="st0"
                        points="324.6 428.1 324.6 331.7 326.8 331.7 326.8 303.9 324.6 303.9 324.6 257.7 64.6 257.7 64.6 328.3 68 328.3 68.1 423.2 106.3 423.2 106.3 429.2 184.8 429.2 184.8 423.9 228.8 423.9 228.8 427.9 324.6 428.1"
                      />
                      <polygon
                        data-label="A39"
                        id="_x31_24"
                        data-name="_x31_2"
                        className="st0"
                        points="377.7 252.3 377.7 75.7 239.4 48.8 239.4 45.7 173 32.1 120.3 22.1 102.3 19 89.4 21.7 79.1 28 69.3 39.4 64.6 53.4 64.6 70.3 95 70.3 95 85.2 67.4 85.2 67.4 252.3 332.8 252.3 332.8 254.8 359.9 254.8 359.9 252.1 377.7 252.3"
                      />
                      <polygon
                        data-label="A40"
                        id="_x31_34"
                        data-name="_x31_3"
                        className="st0"
                        points="383.5 305.4 561.6 305.4 561.6 191 563.7 191 563.7 137.4 560.3 137.4 560.3 111.4 388.8 77.7 388.8 117.9 383.5 117.9 383.5 217.7 389 217.7 389 261.2 380.8 261.2 380.8 288.1 383.4 288.1 383.5 305.4"
                      />
                      <polygon
                        data-label="A41"
                        id="_x31_44"
                        data-name="_x31_4"
                        className="st0"
                        points="443.1 583.3 443.1 483.7 562 483.7 562 441.5 550.8 441.5 550.8 425.2 562 425.2 562 407 567.3 407.1 567.6 419.3 603.1 419.7 603.1 352.8 561.6 352.8 561.6 311.6 383.5 311.6 383.5 435.9 380.7 435.9 380.7 463.3 383.5 463.3 383.5 583.3 443.1 583.3"
                      />
                    </g>
                    <g id="B1" data-name="B05">
                      <polygon
                        data-label="B19"
                        id="_x31_7"
                        data-name="_x31_"
                        className="st0"
                        points="1257.5 833.1 1257.5 955.2 1229.7 955.2 1229.7 1074.3 1155 1074.3 1155 1067.8 1149.1 1067.8 1149.1 1070.5 1057.2 1070.5 1057.2 807.7 1179.9 807.7 1179.9 833.4 1207.2 833.4 1207.2 831.1 1234.7 831.1 1234.7 833.7 1257.5 833.1"
                      />
                      <polygon
                        data-label="B20"
                        id="_x32_7"
                        data-name="_x32_"
                        className="st0"
                        points="1290.1 757.3 1290.1 584.6 1291.9 584.6 1291.9 542.8 1155 542.8 1155 547.8 1056.6 547.8 1056.6 802.3 1179.9 802.3 1179.9 777.4 1187.6 777.4 1187.6 780.1 1215.5 780.1 1215.5 777.1 1229.4 777.1 1229.4 756.7 1290.1 757.3"
                      />
                      <polygon
                        data-label="B21"
                        id="_x33_7"
                        data-name="_x33_"
                        className="st0"
                        points="1468.8 777.7 1468.8 547.5 1376.9 547.5 1376.9 542.8 1295.2 542.8 1295.2 757 1389.2 757 1389.2 780.6 1418.1 780.6 1418.1 777 1468.8 777.7"
                      />
                      <polygon
                        data-label="B22"
                        id="_x34_7"
                        data-name="_x34_"
                        className="st0"
                        points="1514.1 777.4 1561.4 777.4 1561.4 547.4 1474.9 547.4 1474.9 777.4 1487 777.4 1487 780.6 1514.1 780.6 1514.1 777.4"
                      />
                      <polygon
                        data-label="B23"
                        id="_x35_7"
                        data-name="_x35_"
                        className="st0"
                        points="1736.1 777.4 1736.1 543.2 1665.6 543.2 1665.6 547.4 1567.4 547.4 1567.4 777.4 1640.7 777.4 1640.7 780.6 1667.6 780.6 1667.6 777.2 1736.1 777.4"
                      />
                      <polygon
                        data-label="B24"
                        id="_x36_7"
                        data-name="_x36_"
                        className="st0"
                        points="1915.4 802.1 1915.4 547.2 1812.5 547.2 1812.5 543.2 1741.2 543.2 1741.2 778.1 1756.7 778.1 1756.7 780.6 1784.3 780.6 1784.3 777.4 1792.7 777.4 1792.7 802.1 1915.4 802.1"
                      />
                      <polygon
                        data-label="B25"
                        id="_x37_7"
                        data-name="_x37_"
                        className="st0"
                        points="1792.7 807.7 1915.4 807.7 1915.4 1071 1811.8 1071 1811.8 1075.4 1741.2 1075.4 1741.2 833.4 1756.7 833.4 1756.7 830.6 1784.3 830.6 1784.3 833.7 1792.7 833.7 1792.7 807.7"
                      />
                      <polygon
                        data-label="B26"
                        id="_x38_7"
                        data-name="_x38_"
                        className="st0"
                        points="1567.4 833.4 1640.5 833.4 1640.5 830.8 1668.1 830.8 1668.1 833.4 1736.1 833.4 1736.1 1075.4 1665.2 1075.4 1665.2 1070.6 1567.4 1070.6 1567.4 833.4"
                      />
                      <polygon
                        data-label="B27"
                        id="_x39_7"
                        data-name="_x39_"
                        className="st0"
                        points="1561.2 833.2 1561.2 1070.3 1463.8 1070.3 1463.8 1075.4 1389.6 1075.4 1389.6 833.2 1460.9 833.2 1460.9 830.8 1488.7 830.8 1488.7 833.2 1561.2 833.2"
                      />
                    </g>
                    <g id="C1" data-name="C05">
                      <polygon
                        data-label="C19"
                        id="_x31_8"
                        data-name="_x31_"
                        className="st0"
                        points="2488.9 833.2 2488.9 954.6 2459.3 954.6 2459.3 1074.6 2388.9 1074.6 2388.9 1070.3 2287.7 1070.3 2287.7 833.2 2440.9 833.2 2440.9 830.8 2468 830.8 2468 833.9 2488.9 833.2"
                      />
                      <polygon
                        data-label="C20"
                        id="_x32_8"
                        data-name="_x32_"
                        className="st0"
                        points="2206.6 830.8 2206.6 833.2 2282.4 833.2 2282.4 1070.3 2181.1 1070.3 2181.1 1074.6 2110.6 1074.6 2110.6 833.2 2178.6 833.2 2178.6 830.8 2206.6 830.8"
                      />
                      <polygon
                        data-label="C21"
                        id="_x33_8"
                        data-name="_x33_"
                        className="st0"
                        points="2105.3 1075.4 2105.3 833.4 2089.3 833.4 2089.3 830.8 2063.1 830.8 2063.1 833 2054.2 833 2054.2 807.7 1930.9 807.7 1930.9 1071 2034.9 1071 2034.9 1075.4 2105.3 1075.4"
                      />
                      <polygon
                        data-label="C22"
                        id="_x34_8"
                        data-name="_x34_"
                        className="st0"
                        points="2053.8 802.1 2053.8 777.7 2062.4 777.7 2062.4 780.4 2090 780.4 2090 777.7 2105.3 777.7 2105.3 543.2 2034.6 543.2 2034.6 547.5 1930.9 547.5 1930.9 802.1 2053.8 802.1"
                      />
                      <polygon
                        data-label="C23"
                        id="_x35_8"
                        data-name="_x35_"
                        className="st0"
                        points="2281.7 547.5 2281.7 777.7 2206.4 777.7 2206.4 780.1 2179.7 780.1 2179.7 777.4 2110.4 777.4 2110.4 543.2 2181.2 543.2 2181.2 547.8 2281.7 547.5"
                      />
                      <polygon
                        data-label="C24"
                        id="_x36_8"
                        data-name="_x36_"
                        className="st0"
                        points="2459.1 777.1 2459.1 543.2 2388.9 543.2 2388.9 547.2 2287.9 547.2 2287.9 777.1 2363.4 777.1 2363.4 780.1 2391.3 780.1 2391.3 777.7 2459.1 777.1"
                      />
                      <polygon
                        data-label="C25"
                        id="_x37_8"
                        data-name="_x37_"
                        className="st0"
                        points="2612.9 547 2612.9 757.2 2545.7 757.2 2545.7 765.2 2518.2 765.2 2518.2 757.2 2464.6 757.2 2464.6 543.2 2518.9 543.2 2518.9 547.4 2612.9 547"
                      />
                      <polygon
                        data-label="C26"
                        id="_x38_8"
                        data-name="_x38_"
                        className="st0"
                        points="2694.1 543.2 2694.1 571.2 2792.2 571.2 2792.2 782.2 2664.5 782.2 2664.5 776.9 2647.6 776.9 2647.6 780.1 2618.3 780.1 2618.3 543.2 2694.1 543.2"
                      />
                      <path
                        data-label="C27"
                        id="_x39_8"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.2,788.4v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="6" id="floor-6">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/6.png", import.meta.url).href
                      }
                    />
                    <g id="A4" data-name="A06">
                      <polygon
                        data-label="A43"
                        id="_x31_6"
                        data-name="_x31_"
                        className="st0"
                        points="567.6 777.7 581 777.5 581.1 780.6 608 780.6 607.9 777.3 683.1 777.6 683.7 739.1 687.3 739.1 686.4 547.7 567.6 548 567.6 777.7"
                      />
                      <polygon
                        data-label="A44"
                        id="_x32_6"
                        data-name="_x32_"
                        className="st0"
                        points="859.1 777.4 859.1 740 860.6 740 860.6 543 790.3 543 790.3 547.7 691.7 547.7 691.7 777.4 782.6 777.4 782.6 780.6 809.9 780.6 809.9 777.1 859.1 777.4"
                      />
                      <polygon
                        data-label="A45"
                        id="_x33_6"
                        data-name="_x33_"
                        className="st0"
                        points="1040.1 802.6 1040.1 783 1037.4 783 1037.4 739.1 1040.1 739.1 1040.1 547.4 942 547.4 942 543 866.5 543 866.5 739.4 868 739.4 868 777.7 881.6 777.7 881.6 780.6 907.7 780.6 907.7 777.4 917.4 777.4 917.4 802.6 1040.1 802.6"
                      />
                      <polygon
                        data-label="A46"
                        id="_x34_6"
                        data-name="_x34_"
                        className="st0"
                        points="1040.1 807.9 1040.1 1071 942.6 1071 942.6 1074.6 867.1 1074.6 867.1 838.1 881.3 838.1 881.3 834.9 908.9 834.9 908.9 838.1 917.4 838.1 917.4 807.9 1040.1 807.9"
                      />
                      <polygon
                        data-label="A47"
                        id="_x35_6"
                        data-name="_x35_"
                        className="st0"
                        points="860.3 1074.6 860.3 838.1 811.1 838.1 811.1 835.4 783.2 835.4 783.2 837.8 692.3 837.8 692.3 1071.3 790.3 1071.3 790.3 1074.6 860.3 1074.6"
                      />
                      <polygon
                        data-label="A48"
                        id="_x36_6"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 837.8 685.4 1071.3 567.8 1071.3 567.8 837.8 581.7 837.8 581.7 835.4 609.2 835.4 609.2 837.7 685.4 837.8"
                      />
                      <path
                        id="_x37_6"
                        data-name="_x37_"
                        className="st0"
                        d="M561.9,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A49"
                        id="_x38_6"
                        data-name="_x38_"
                        className="st0"
                        points="377.4 838.3 377.4 875.9 381.7 875.9 381.7 968 378 968 378 1070.9 356 1068.2 355.5 1070.6 314 1060.6 314.8 1058.6 276.3 1042.9 275.1 1044.9 238.4 1023.2 239.6 1021.2 217.7 1005.1 217.7 1008.2 206.2 999 188.6 980.9 169.4 957.3 156.7 937.5 160.2 937.4 144.9 907.4 142.8 908.3 128 868.5 130.6 867.6 124.3 840 332.6 838.3 332.6 835.1 359.2 835.1 359.1 838.2 377.4 838.3"
                      />
                      <polygon
                        data-label="A50"
                        id="_x39_6"
                        data-name="_x39_"
                        className="st0"
                        points="324.1 771.9 324.1 678.3 326.8 678.3 326.8 651 324.1 651 324.1 604.8 124.8 604.8 124.8 602.3 106.1 602.3 106.1 604.8 63.4 604.8 63.4 674.1 68.1 674.1 67.9 771.9 324.1 771.9"
                      />
                      <polygon
                        data-label="A51"
                        id="_x31_04"
                        data-name="_x31_0"
                        className="st0"
                        points="323.9 599 323.9 553.4 326.8 553.4 326.8 526.6 323.9 526.6 323.9 433.2 228.6 433.2 228.6 434.6 67.7 434.6 67.7 531.7 63.4 531.7 63.4 594.1 105.4 594.1 105.4 597.4 125.2 597.4 125.2 599 184.3 599 184.3 594.1 228.3 594.1 228.3 599 323.9 599"
                      />
                      <polygon
                        data-label="A52"
                        id="_x31_14"
                        data-name="_x31_1"
                        className="st0"
                        points="324.6 428.1 324.6 331.7 326.8 331.7 326.8 303.9 324.6 303.9 324.6 257.7 64.6 257.7 64.6 328.3 68 328.3 68.1 423.2 106.3 423.2 106.3 429.2 184.8 429.2 184.8 423.9 228.8 423.9 228.8 427.9 324.6 428.1"
                      />
                      <polygon
                        data-label="A53"
                        id="_x31_24"
                        data-name="_x31_2"
                        className="st0"
                        points="377.7 252.3 377.7 75.7 239.4 48.8 239.4 45.7 173 32.1 120.3 22.1 102.3 19 89.4 21.7 79.1 28 69.3 39.4 64.6 53.4 64.6 70.3 95 70.3 95 85.2 67.4 85.2 67.4 252.3 332.8 252.3 332.8 254.8 359.9 254.8 359.9 252.1 377.7 252.3"
                      />
                      <polygon
                        data-label="A54"
                        id="_x31_34"
                        data-name="_x31_3"
                        className="st0"
                        points="383.5 305.4 561.6 305.4 561.6 191 563.7 191 563.7 137.4 560.3 137.4 560.3 111.4 388.8 77.7 388.8 117.9 383.5 117.9 383.5 217.7 389 217.7 389 261.2 380.8 261.2 380.8 288.1 383.4 288.1 383.5 305.4"
                      />
                      <polygon
                        data-label="A55"
                        id="_x31_44"
                        data-name="_x31_4"
                        className="st0"
                        points="443.1 583.3 443.1 483.7 562 483.7 562 441.5 550.8 441.5 550.8 425.2 562 425.2 562 407 567.3 407.1 567.6 419.3 603.1 419.7 603.1 352.8 561.6 352.8 561.6 311.6 383.5 311.6 383.5 435.9 380.7 435.9 380.7 463.3 383.5 463.3 383.5 583.3 443.1 583.3"
                      />
                    </g>
                    <g id="B1" data-name="B06">
                      <polygon
                        data-label="B28"
                        id="_x31_7"
                        data-name="_x31_"
                        className="st0"
                        points="1257.5 833.1 1257.5 955.2 1229.7 955.2 1229.7 1074.3 1155 1074.3 1155 1067.8 1149.1 1067.8 1149.1 1070.5 1057.2 1070.5 1057.2 807.7 1179.9 807.7 1179.9 833.4 1207.2 833.4 1207.2 831.1 1234.7 831.1 1234.7 833.7 1257.5 833.1"
                      />
                      <polygon
                        data-label="B29"
                        id="_x32_7"
                        data-name="_x32_"
                        className="st0"
                        points="1290.1 757.3 1290.1 584.6 1291.9 584.6 1291.9 542.8 1155 542.8 1155 547.8 1056.6 547.8 1056.6 802.3 1179.9 802.3 1179.9 777.4 1187.6 777.4 1187.6 780.1 1215.5 780.1 1215.5 777.1 1229.4 777.1 1229.4 756.7 1290.1 757.3"
                      />
                      <polygon
                        data-label="B30"
                        id="_x33_7"
                        data-name="_x33_"
                        className="st0"
                        points="1468.8 777.7 1468.8 547.5 1376.9 547.5 1376.9 542.8 1295.2 542.8 1295.2 757 1389.2 757 1389.2 780.6 1418.1 780.6 1418.1 777 1468.8 777.7"
                      />
                      <polygon
                        data-label="B31"
                        id="_x34_7"
                        data-name="_x34_"
                        className="st0"
                        points="1514.1 777.4 1561.4 777.4 1561.4 547.4 1474.9 547.4 1474.9 777.4 1487 777.4 1487 780.6 1514.1 780.6 1514.1 777.4"
                      />
                      <polygon
                        data-label="B32"
                        id="_x35_7"
                        data-name="_x35_"
                        className="st0"
                        points="1736.1 777.4 1736.1 543.2 1665.6 543.2 1665.6 547.4 1567.4 547.4 1567.4 777.4 1640.7 777.4 1640.7 780.6 1667.6 780.6 1667.6 777.2 1736.1 777.4"
                      />
                      <polygon
                        data-label="B33"
                        id="_x36_7"
                        data-name="_x36_"
                        className="st0"
                        points="1915.4 802.1 1915.4 547.2 1812.5 547.2 1812.5 543.2 1741.2 543.2 1741.2 778.1 1756.7 778.1 1756.7 780.6 1784.3 780.6 1784.3 777.4 1792.7 777.4 1792.7 802.1 1915.4 802.1"
                      />
                      <polygon
                        data-label="B34"
                        id="_x37_7"
                        data-name="_x37_"
                        className="st0"
                        points="1792.7 807.7 1915.4 807.7 1915.4 1071 1811.8 1071 1811.8 1075.4 1741.2 1075.4 1741.2 833.4 1756.7 833.4 1756.7 830.6 1784.3 830.6 1784.3 833.7 1792.7 833.7 1792.7 807.7"
                      />
                      <polygon
                        data-label="B35"
                        id="_x38_7"
                        data-name="_x38_"
                        className="st0"
                        points="1567.4 833.4 1640.5 833.4 1640.5 830.8 1668.1 830.8 1668.1 833.4 1736.1 833.4 1736.1 1075.4 1665.2 1075.4 1665.2 1070.6 1567.4 1070.6 1567.4 833.4"
                      />
                      <polygon
                        data-label="B36"
                        id="_x39_7"
                        data-name="_x39_"
                        className="st0"
                        points="1561.2 833.2 1561.2 1070.3 1463.8 1070.3 1463.8 1075.4 1389.6 1075.4 1389.6 833.2 1460.9 833.2 1460.9 830.8 1488.7 830.8 1488.7 833.2 1561.2 833.2"
                      />
                    </g>
                    <g id="C1" data-name="C06">
                      <polygon
                        data-label="C28"
                        id="_x31_8"
                        data-name="_x31_"
                        className="st0"
                        points="2488.9 833.2 2488.9 954.6 2459.3 954.6 2459.3 1074.6 2388.9 1074.6 2388.9 1070.3 2287.7 1070.3 2287.7 833.2 2440.9 833.2 2440.9 830.8 2468 830.8 2468 833.9 2488.9 833.2"
                      />
                      <polygon
                        data-label="C29"
                        id="_x32_8"
                        data-name="_x32_"
                        className="st0"
                        points="2206.6 830.8 2206.6 833.2 2282.4 833.2 2282.4 1070.3 2181.1 1070.3 2181.1 1074.6 2110.6 1074.6 2110.6 833.2 2178.6 833.2 2178.6 830.8 2206.6 830.8"
                      />
                      <polygon
                        data-label="C30"
                        id="_x33_8"
                        data-name="_x33_"
                        className="st0"
                        points="2105.3 1075.4 2105.3 833.4 2089.3 833.4 2089.3 830.8 2063.1 830.8 2063.1 833 2054.2 833 2054.2 807.7 1930.9 807.7 1930.9 1071 2034.9 1071 2034.9 1075.4 2105.3 1075.4"
                      />
                      <polygon
                        data-label="C31"
                        id="_x34_8"
                        data-name="_x34_"
                        className="st0"
                        points="2053.8 802.1 2053.8 777.7 2062.4 777.7 2062.4 780.4 2090 780.4 2090 777.7 2105.3 777.7 2105.3 543.2 2034.6 543.2 2034.6 547.5 1930.9 547.5 1930.9 802.1 2053.8 802.1"
                      />
                      <polygon
                        data-label="C32"
                        id="_x35_8"
                        data-name="_x35_"
                        className="st0"
                        points="2281.7 547.5 2281.7 777.7 2206.4 777.7 2206.4 780.1 2179.7 780.1 2179.7 777.4 2110.4 777.4 2110.4 543.2 2181.2 543.2 2181.2 547.8 2281.7 547.5"
                      />
                      <polygon
                        data-label="C33"
                        id="_x36_8"
                        data-name="_x36_"
                        className="st0"
                        points="2459.1 777.1 2459.1 543.2 2388.9 543.2 2388.9 547.2 2287.9 547.2 2287.9 777.1 2363.4 777.1 2363.4 780.1 2391.3 780.1 2391.3 777.7 2459.1 777.1"
                      />
                      <polygon
                        data-label="C34"
                        id="_x37_8"
                        data-name="_x37_"
                        className="st0"
                        points="2612.9 547 2612.9 757.2 2545.7 757.2 2545.7 765.2 2518.2 765.2 2518.2 757.2 2464.6 757.2 2464.6 543.2 2518.9 543.2 2518.9 547.4 2612.9 547"
                      />
                      <polygon
                        data-label="C35"
                        id="_x38_8"
                        data-name="_x38_"
                        className="st0"
                        points="2694.1 543.2 2694.1 571.2 2792.2 571.2 2792.2 782.2 2664.5 782.2 2664.5 776.9 2647.6 776.9 2647.6 780.1 2618.3 780.1 2618.3 543.2 2694.1 543.2"
                      />
                      <path
                        data-label="C36"
                        id="_x39_8"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.2,788.4v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="7" id="floor-7">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/7.png", import.meta.url).href
                      }
                    />
                    <g id="A4" data-name="A07">
                      <polygon
                        data-label="A57"
                        id="_x31_6"
                        data-name="_x31_"
                        className="st0"
                        points="567.6 777.7 581 777.5 581.1 780.6 608 780.6 607.9 777.3 683.1 777.6 683.7 739.1 687.3 739.1 686.4 547.7 567.6 548 567.6 777.7"
                      />
                      <polygon
                        data-label="A58"
                        id="_x32_6"
                        data-name="_x32_"
                        className="st0"
                        points="859.1 777.4 859.1 740 860.6 740 860.6 543 790.3 543 790.3 547.7 691.7 547.7 691.7 777.4 782.6 777.4 782.6 780.6 809.9 780.6 809.9 777.1 859.1 777.4"
                      />
                      <polygon
                        data-label="A59"
                        id="_x33_6"
                        data-name="_x33_"
                        className="st0"
                        points="1040.1 802.6 1040.1 783 1037.4 783 1037.4 739.1 1040.1 739.1 1040.1 547.4 942 547.4 942 543 866.5 543 866.5 739.4 868 739.4 868 777.7 881.6 777.7 881.6 780.6 907.7 780.6 907.7 777.4 917.4 777.4 917.4 802.6 1040.1 802.6"
                      />
                      <polygon
                        data-label="A60"
                        id="_x34_6"
                        data-name="_x34_"
                        className="st0"
                        points="1040.1 807.9 1040.1 1071 942.6 1071 942.6 1074.6 867.1 1074.6 867.1 838.1 881.3 838.1 881.3 834.9 908.9 834.9 908.9 838.1 917.4 838.1 917.4 807.9 1040.1 807.9"
                      />
                      <polygon
                        data-label="A61"
                        id="_x35_6"
                        data-name="_x35_"
                        className="st0"
                        points="860.3 1074.6 860.3 838.1 811.1 838.1 811.1 835.4 783.2 835.4 783.2 837.8 692.3 837.8 692.3 1071.3 790.3 1071.3 790.3 1074.6 860.3 1074.6"
                      />
                      <polygon
                        data-label="A62"
                        id="_x36_6"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 837.8 685.4 1071.3 567.8 1071.3 567.8 837.8 581.7 837.8 581.7 835.4 609.2 835.4 609.2 837.7 685.4 837.8"
                      />
                      <path
                        id="_x37_6"
                        data-name="_x37_"
                        className="st0"
                        d="M561.9,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A63"
                        id="_x38_6"
                        data-name="_x38_"
                        className="st0"
                        points="377.4 838.3 377.4 875.9 381.7 875.9 381.7 968 378 968 378 1070.9 356 1068.2 355.5 1070.6 314 1060.6 314.8 1058.6 276.3 1042.9 275.1 1044.9 238.4 1023.2 239.6 1021.2 217.7 1005.1 217.7 1008.2 206.2 999 188.6 980.9 169.4 957.3 156.7 937.5 160.2 937.4 144.9 907.4 142.8 908.3 128 868.5 130.6 867.6 124.3 840 332.6 838.3 332.6 835.1 359.2 835.1 359.1 838.2 377.4 838.3"
                      />
                      <polygon
                        data-label="A64"
                        id="_x39_6"
                        data-name="_x39_"
                        className="st0"
                        points="324.1 771.9 324.1 678.3 326.8 678.3 326.8 651 324.1 651 324.1 604.8 124.8 604.8 124.8 602.3 106.1 602.3 106.1 604.8 63.4 604.8 63.4 674.1 68.1 674.1 67.9 771.9 324.1 771.9"
                      />
                      <polygon
                        data-label="A65"
                        id="_x31_04"
                        data-name="_x31_0"
                        className="st0"
                        points="323.9 599 323.9 553.4 326.8 553.4 326.8 526.6 323.9 526.6 323.9 433.2 228.6 433.2 228.6 434.6 67.7 434.6 67.7 531.7 63.4 531.7 63.4 594.1 105.4 594.1 105.4 597.4 125.2 597.4 125.2 599 184.3 599 184.3 594.1 228.3 594.1 228.3 599 323.9 599"
                      />
                      <polygon
                        data-label="A66"
                        id="_x31_14"
                        data-name="_x31_1"
                        className="st0"
                        points="324.6 428.1 324.6 331.7 326.8 331.7 326.8 303.9 324.6 303.9 324.6 257.7 64.6 257.7 64.6 328.3 68 328.3 68.1 423.2 106.3 423.2 106.3 429.2 184.8 429.2 184.8 423.9 228.8 423.9 228.8 427.9 324.6 428.1"
                      />
                      <polygon
                        data-label="A67"
                        id="_x31_24"
                        data-name="_x31_2"
                        className="st0"
                        points="377.7 252.3 377.7 75.7 239.4 48.8 239.4 45.7 173 32.1 120.3 22.1 102.3 19 89.4 21.7 79.1 28 69.3 39.4 64.6 53.4 64.6 70.3 95 70.3 95 85.2 67.4 85.2 67.4 252.3 332.8 252.3 332.8 254.8 359.9 254.8 359.9 252.1 377.7 252.3"
                      />
                      <polygon
                        data-label="A68"
                        id="_x31_34"
                        data-name="_x31_3"
                        className="st0"
                        points="383.5 305.4 561.6 305.4 561.6 191 563.7 191 563.7 137.4 560.3 137.4 560.3 111.4 388.8 77.7 388.8 117.9 383.5 117.9 383.5 217.7 389 217.7 389 261.2 380.8 261.2 380.8 288.1 383.4 288.1 383.5 305.4"
                      />
                      <polygon
                        data-label="A69"
                        id="_x31_44"
                        data-name="_x31_4"
                        className="st0"
                        points="443.1 583.3 443.1 483.7 562 483.7 562 441.5 550.8 441.5 550.8 425.2 562 425.2 562 407 567.3 407.1 567.6 419.3 603.1 419.7 603.1 352.8 561.6 352.8 561.6 311.6 383.5 311.6 383.5 435.9 380.7 435.9 380.7 463.3 383.5 463.3 383.5 583.3 443.1 583.3"
                      />
                    </g>
                    <g id="B1" data-name="B07">
                      <polygon
                        data-label="B37"
                        id="_x31_7"
                        data-name="_x31_"
                        className="st0"
                        points="1257.5 833.1 1257.5 955.2 1229.7 955.2 1229.7 1074.3 1155 1074.3 1155 1067.8 1149.1 1067.8 1149.1 1070.5 1057.2 1070.5 1057.2 807.7 1179.9 807.7 1179.9 833.4 1207.2 833.4 1207.2 831.1 1234.7 831.1 1234.7 833.7 1257.5 833.1"
                      />
                      <polygon
                        data-label="B38"
                        id="_x32_7"
                        data-name="_x32_"
                        className="st0"
                        points="1290.1 757.3 1290.1 584.6 1291.9 584.6 1291.9 542.8 1155 542.8 1155 547.8 1056.6 547.8 1056.6 802.3 1179.9 802.3 1179.9 777.4 1187.6 777.4 1187.6 780.1 1215.5 780.1 1215.5 777.1 1229.4 777.1 1229.4 756.7 1290.1 757.3"
                      />
                      <polygon
                        data-label="B39"
                        id="_x33_7"
                        data-name="_x33_"
                        className="st0"
                        points="1468.8 777.7 1468.8 547.5 1376.9 547.5 1376.9 542.8 1295.2 542.8 1295.2 757 1389.2 757 1389.2 780.6 1418.1 780.6 1418.1 777 1468.8 777.7"
                      />
                      <polygon
                        data-label="B40"
                        id="_x34_7"
                        data-name="_x34_"
                        className="st0"
                        points="1514.1 777.4 1561.4 777.4 1561.4 547.4 1474.9 547.4 1474.9 777.4 1487 777.4 1487 780.6 1514.1 780.6 1514.1 777.4"
                      />
                      <polygon
                        data-label="B41"
                        id="_x35_7"
                        data-name="_x35_"
                        className="st0"
                        points="1736.1 777.4 1736.1 543.2 1665.6 543.2 1665.6 547.4 1567.4 547.4 1567.4 777.4 1640.7 777.4 1640.7 780.6 1667.6 780.6 1667.6 777.2 1736.1 777.4"
                      />
                      <polygon
                        data-label="B42"
                        id="_x36_7"
                        data-name="_x36_"
                        className="st0"
                        points="1915.4 802.1 1915.4 547.2 1812.5 547.2 1812.5 543.2 1741.2 543.2 1741.2 778.1 1756.7 778.1 1756.7 780.6 1784.3 780.6 1784.3 777.4 1792.7 777.4 1792.7 802.1 1915.4 802.1"
                      />
                      <polygon
                        data-label="B43"
                        id="_x37_7"
                        data-name="_x37_"
                        className="st0"
                        points="1792.7 807.7 1915.4 807.7 1915.4 1071 1811.8 1071 1811.8 1075.4 1741.2 1075.4 1741.2 833.4 1756.7 833.4 1756.7 830.6 1784.3 830.6 1784.3 833.7 1792.7 833.7 1792.7 807.7"
                      />
                      <polygon
                        data-label="B44"
                        id="_x38_7"
                        data-name="_x38_"
                        className="st0"
                        points="1567.4 833.4 1640.5 833.4 1640.5 830.8 1668.1 830.8 1668.1 833.4 1736.1 833.4 1736.1 1075.4 1665.2 1075.4 1665.2 1070.6 1567.4 1070.6 1567.4 833.4"
                      />
                      <polygon
                        data-label="B45"
                        id="_x39_7"
                        data-name="_x39_"
                        className="st0"
                        points="1561.2 833.2 1561.2 1070.3 1463.8 1070.3 1463.8 1075.4 1389.6 1075.4 1389.6 833.2 1460.9 833.2 1460.9 830.8 1488.7 830.8 1488.7 833.2 1561.2 833.2"
                      />
                    </g>
                    <g id="C1" data-name="C07">
                      <polygon
                        data-label="C37"
                        id="_x31_8"
                        data-name="_x31_"
                        className="st0"
                        points="2488.9 833.2 2488.9 954.6 2459.3 954.6 2459.3 1074.6 2388.9 1074.6 2388.9 1070.3 2287.7 1070.3 2287.7 833.2 2440.9 833.2 2440.9 830.8 2468 830.8 2468 833.9 2488.9 833.2"
                      />
                      <polygon
                        data-label="C38"
                        id="_x32_8"
                        data-name="_x32_"
                        className="st0"
                        points="2206.6 830.8 2206.6 833.2 2282.4 833.2 2282.4 1070.3 2181.1 1070.3 2181.1 1074.6 2110.6 1074.6 2110.6 833.2 2178.6 833.2 2178.6 830.8 2206.6 830.8"
                      />
                      <polygon
                        data-label="C39"
                        id="_x33_8"
                        data-name="_x33_"
                        className="st0"
                        points="2105.3 1075.4 2105.3 833.4 2089.3 833.4 2089.3 830.8 2063.1 830.8 2063.1 833 2054.2 833 2054.2 807.7 1930.9 807.7 1930.9 1071 2034.9 1071 2034.9 1075.4 2105.3 1075.4"
                      />
                      <polygon
                        data-label="C40"
                        id="_x34_8"
                        data-name="_x34_"
                        className="st0"
                        points="2053.8 802.1 2053.8 777.7 2062.4 777.7 2062.4 780.4 2090 780.4 2090 777.7 2105.3 777.7 2105.3 543.2 2034.6 543.2 2034.6 547.5 1930.9 547.5 1930.9 802.1 2053.8 802.1"
                      />
                      <polygon
                        data-label="C41"
                        id="_x35_8"
                        data-name="_x35_"
                        className="st0"
                        points="2281.7 547.5 2281.7 777.7 2206.4 777.7 2206.4 780.1 2179.7 780.1 2179.7 777.4 2110.4 777.4 2110.4 543.2 2181.2 543.2 2181.2 547.8 2281.7 547.5"
                      />
                      <polygon
                        data-label="C42"
                        id="_x36_8"
                        data-name="_x36_"
                        className="st0"
                        points="2459.1 777.1 2459.1 543.2 2388.9 543.2 2388.9 547.2 2287.9 547.2 2287.9 777.1 2363.4 777.1 2363.4 780.1 2391.3 780.1 2391.3 777.7 2459.1 777.1"
                      />
                      <polygon
                        data-label="C43"
                        id="_x37_8"
                        data-name="_x37_"
                        className="st0"
                        points="2612.9 547 2612.9 757.2 2545.7 757.2 2545.7 765.2 2518.2 765.2 2518.2 757.2 2464.6 757.2 2464.6 543.2 2518.9 543.2 2518.9 547.4 2612.9 547"
                      />
                      <polygon
                        data-label="C44"
                        id="_x38_8"
                        data-name="_x38_"
                        className="st0"
                        points="2694.1 543.2 2694.1 571.2 2792.2 571.2 2792.2 782.2 2664.5 782.2 2664.5 776.9 2647.6 776.9 2647.6 780.1 2618.3 780.1 2618.3 543.2 2694.1 543.2"
                      />
                      <path
                        data-label="C45"
                        id="_x39_8"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.2,788.4v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="8" id="floor-8">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/8.png", import.meta.url).href
                      }
                    />
                    <g id="A4" data-name="A08">
                      <polygon
                        data-label="A71"
                        id="_x31_6"
                        data-name="_x31_"
                        className="st0"
                        points="567.6 777.7 581 777.5 581.1 780.6 608 780.6 607.9 777.3 683.1 777.6 683.7 739.1 687.3 739.1 686.4 547.7 567.6 548 567.6 777.7"
                      />
                      <polygon
                        data-label="A72"
                        id="_x32_6"
                        data-name="_x32_"
                        className="st0"
                        points="859.1 777.4 859.1 740 860.6 740 860.6 543 790.3 543 790.3 547.7 691.7 547.7 691.7 777.4 782.6 777.4 782.6 780.6 809.9 780.6 809.9 777.1 859.1 777.4"
                      />
                      <polygon
                        data-label="A73"
                        id="_x33_6"
                        data-name="_x33_"
                        className="st0"
                        points="1040.1 802.6 1040.1 783 1037.4 783 1037.4 739.1 1040.1 739.1 1040.1 547.4 942 547.4 942 543 866.5 543 866.5 739.4 868 739.4 868 777.7 881.6 777.7 881.6 780.6 907.7 780.6 907.7 777.4 917.4 777.4 917.4 802.6 1040.1 802.6"
                      />
                      <polygon
                        data-label="A74"
                        id="_x34_6"
                        data-name="_x34_"
                        className="st0"
                        points="1040.1 807.9 1040.1 1071 942.6 1071 942.6 1074.6 867.1 1074.6 867.1 838.1 881.3 838.1 881.3 834.9 908.9 834.9 908.9 838.1 917.4 838.1 917.4 807.9 1040.1 807.9"
                      />
                      <polygon
                        data-label="A75"
                        id="_x35_6"
                        data-name="_x35_"
                        className="st0"
                        points="860.3 1074.6 860.3 838.1 811.1 838.1 811.1 835.4 783.2 835.4 783.2 837.8 692.3 837.8 692.3 1071.3 790.3 1071.3 790.3 1074.6 860.3 1074.6"
                      />
                      <polygon
                        data-label="A76"
                        id="_x36_6"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 837.8 685.4 1071.3 567.8 1071.3 567.8 837.8 581.7 837.8 581.7 835.4 609.2 835.4 609.2 837.7 685.4 837.8"
                      />
                      <path
                        id="_x37_6"
                        data-name="_x37_"
                        className="st0"
                        d="M561.9,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A77"
                        id="_x38_6"
                        data-name="_x38_"
                        className="st0"
                        points="377.4 838.3 377.4 875.9 381.7 875.9 381.7 968 378 968 378 1070.9 356 1068.2 355.5 1070.6 314 1060.6 314.8 1058.6 276.3 1042.9 275.1 1044.9 238.4 1023.2 239.6 1021.2 217.7 1005.1 217.7 1008.2 206.2 999 188.6 980.9 169.4 957.3 156.7 937.5 160.2 937.4 144.9 907.4 142.8 908.3 128 868.5 130.6 867.6 124.3 840 332.6 838.3 332.6 835.1 359.2 835.1 359.1 838.2 377.4 838.3"
                      />
                      <polygon
                        data-label="A78"
                        id="_x39_6"
                        data-name="_x39_"
                        className="st0"
                        points="324.1 771.9 324.1 678.3 326.8 678.3 326.8 651 324.1 651 324.1 604.8 124.8 604.8 124.8 602.3 106.1 602.3 106.1 604.8 63.4 604.8 63.4 674.1 68.1 674.1 67.9 771.9 324.1 771.9"
                      />
                      <polygon
                        data-label="A79"
                        id="_x31_04"
                        data-name="_x31_0"
                        className="st0"
                        points="323.9 599 323.9 553.4 326.8 553.4 326.8 526.6 323.9 526.6 323.9 433.2 228.6 433.2 228.6 434.6 67.7 434.6 67.7 531.7 63.4 531.7 63.4 594.1 105.4 594.1 105.4 597.4 125.2 597.4 125.2 599 184.3 599 184.3 594.1 228.3 594.1 228.3 599 323.9 599"
                      />
                      <polygon
                        data-label="A80"
                        id="_x31_14"
                        data-name="_x31_1"
                        className="st0"
                        points="324.6 428.1 324.6 331.7 326.8 331.7 326.8 303.9 324.6 303.9 324.6 257.7 64.6 257.7 64.6 328.3 68 328.3 68.1 423.2 106.3 423.2 106.3 429.2 184.8 429.2 184.8 423.9 228.8 423.9 228.8 427.9 324.6 428.1"
                      />
                      <polygon
                        data-label="A81"
                        id="_x31_24"
                        data-name="_x31_2"
                        className="st0"
                        points="377.7 252.3 377.7 75.7 239.4 48.8 239.4 45.7 173 32.1 120.3 22.1 102.3 19 89.4 21.7 79.1 28 69.3 39.4 64.6 53.4 64.6 70.3 95 70.3 95 85.2 67.4 85.2 67.4 252.3 332.8 252.3 332.8 254.8 359.9 254.8 359.9 252.1 377.7 252.3"
                      />
                      <polygon
                        data-label="A82"
                        id="_x31_34"
                        data-name="_x31_3"
                        className="st0"
                        points="383.5 305.4 561.6 305.4 561.6 191 563.7 191 563.7 137.4 560.3 137.4 560.3 111.4 388.8 77.7 388.8 117.9 383.5 117.9 383.5 217.7 389 217.7 389 261.2 380.8 261.2 380.8 288.1 383.4 288.1 383.5 305.4"
                      />
                      <polygon
                        data-label="A83"
                        id="_x31_44"
                        data-name="_x31_4"
                        className="st0"
                        points="443.1 583.3 443.1 483.7 562 483.7 562 441.5 550.8 441.5 550.8 425.2 562 425.2 562 407 567.3 407.1 567.6 419.3 603.1 419.7 603.1 352.8 561.6 352.8 561.6 311.6 383.5 311.6 383.5 435.9 380.7 435.9 380.7 463.3 383.5 463.3 383.5 583.3 443.1 583.3"
                      />
                    </g>
                    <g id="B1" data-name="B08">
                      <polygon
                        data-label="B46"
                        id="_x31_7"
                        data-name="_x31_"
                        className="st0"
                        points="1257.5 833.1 1257.5 955.2 1229.7 955.2 1229.7 1074.3 1155 1074.3 1155 1067.8 1149.1 1067.8 1149.1 1070.5 1057.2 1070.5 1057.2 807.7 1179.9 807.7 1179.9 833.4 1207.2 833.4 1207.2 831.1 1234.7 831.1 1234.7 833.7 1257.5 833.1"
                      />
                      <polygon
                        data-label="B47"
                        id="_x32_7"
                        data-name="_x32_"
                        className="st0"
                        points="1290.1 757.3 1290.1 584.6 1291.9 584.6 1291.9 542.8 1155 542.8 1155 547.8 1056.6 547.8 1056.6 802.3 1179.9 802.3 1179.9 777.4 1187.6 777.4 1187.6 780.1 1215.5 780.1 1215.5 777.1 1229.4 777.1 1229.4 756.7 1290.1 757.3"
                      />
                      <polygon
                        data-label="B48"
                        id="_x33_7"
                        data-name="_x33_"
                        className="st0"
                        points="1468.8 777.7 1468.8 547.5 1376.9 547.5 1376.9 542.8 1295.2 542.8 1295.2 757 1389.2 757 1389.2 780.6 1418.1 780.6 1418.1 777 1468.8 777.7"
                      />
                      <polygon
                        data-label="B49"
                        id="_x34_7"
                        data-name="_x34_"
                        className="st0"
                        points="1514.1 777.4 1561.4 777.4 1561.4 547.4 1474.9 547.4 1474.9 777.4 1487 777.4 1487 780.6 1514.1 780.6 1514.1 777.4"
                      />
                      <polygon
                        data-label="B50"
                        id="_x35_7"
                        data-name="_x35_"
                        className="st0"
                        points="1736.1 777.4 1736.1 543.2 1665.6 543.2 1665.6 547.4 1567.4 547.4 1567.4 777.4 1640.7 777.4 1640.7 780.6 1667.6 780.6 1667.6 777.2 1736.1 777.4"
                      />
                      <polygon
                        data-label="B51"
                        id="_x36_7"
                        data-name="_x36_"
                        className="st0"
                        points="1915.4 802.1 1915.4 547.2 1812.5 547.2 1812.5 543.2 1741.2 543.2 1741.2 778.1 1756.7 778.1 1756.7 780.6 1784.3 780.6 1784.3 777.4 1792.7 777.4 1792.7 802.1 1915.4 802.1"
                      />
                      <polygon
                        data-label="B52"
                        id="_x37_7"
                        data-name="_x37_"
                        className="st0"
                        points="1792.7 807.7 1915.4 807.7 1915.4 1071 1811.8 1071 1811.8 1075.4 1741.2 1075.4 1741.2 833.4 1756.7 833.4 1756.7 830.6 1784.3 830.6 1784.3 833.7 1792.7 833.7 1792.7 807.7"
                      />
                      <polygon
                        data-label="B53"
                        id="_x38_7"
                        data-name="_x38_"
                        className="st0"
                        points="1567.4 833.4 1640.5 833.4 1640.5 830.8 1668.1 830.8 1668.1 833.4 1736.1 833.4 1736.1 1075.4 1665.2 1075.4 1665.2 1070.6 1567.4 1070.6 1567.4 833.4"
                      />
                      <polygon
                        data-label="B54"
                        id="_x39_7"
                        data-name="_x39_"
                        className="st0"
                        points="1561.2 833.2 1561.2 1070.3 1463.8 1070.3 1463.8 1075.4 1389.6 1075.4 1389.6 833.2 1460.9 833.2 1460.9 830.8 1488.7 830.8 1488.7 833.2 1561.2 833.2"
                      />
                    </g>
                    <g id="C1" data-name="C08">
                      <polygon
                        data-label="C46"
                        id="_x31_8"
                        data-name="_x31_"
                        className="st0"
                        points="2488.9 833.2 2488.9 954.6 2459.3 954.6 2459.3 1074.6 2388.9 1074.6 2388.9 1070.3 2287.7 1070.3 2287.7 833.2 2440.9 833.2 2440.9 830.8 2468 830.8 2468 833.9 2488.9 833.2"
                      />
                      <polygon
                        data-label="C47"
                        id="_x32_8"
                        data-name="_x32_"
                        className="st0"
                        points="2206.6 830.8 2206.6 833.2 2282.4 833.2 2282.4 1070.3 2181.1 1070.3 2181.1 1074.6 2110.6 1074.6 2110.6 833.2 2178.6 833.2 2178.6 830.8 2206.6 830.8"
                      />
                      <polygon
                        data-label="C48"
                        id="_x33_8"
                        data-name="_x33_"
                        className="st0"
                        points="2105.3 1075.4 2105.3 833.4 2089.3 833.4 2089.3 830.8 2063.1 830.8 2063.1 833 2054.2 833 2054.2 807.7 1930.9 807.7 1930.9 1071 2034.9 1071 2034.9 1075.4 2105.3 1075.4"
                      />
                      <polygon
                        data-label="C49"
                        id="_x34_8"
                        data-name="_x34_"
                        className="st0"
                        points="2053.8 802.1 2053.8 777.7 2062.4 777.7 2062.4 780.4 2090 780.4 2090 777.7 2105.3 777.7 2105.3 543.2 2034.6 543.2 2034.6 547.5 1930.9 547.5 1930.9 802.1 2053.8 802.1"
                      />
                      <polygon
                        data-label="C50"
                        id="_x35_8"
                        data-name="_x35_"
                        className="st0"
                        points="2281.7 547.5 2281.7 777.7 2206.4 777.7 2206.4 780.1 2179.7 780.1 2179.7 777.4 2110.4 777.4 2110.4 543.2 2181.2 543.2 2181.2 547.8 2281.7 547.5"
                      />
                      <polygon
                        data-label="C51"
                        id="_x36_8"
                        data-name="_x36_"
                        className="st0"
                        points="2459.1 777.1 2459.1 543.2 2388.9 543.2 2388.9 547.2 2287.9 547.2 2287.9 777.1 2363.4 777.1 2363.4 780.1 2391.3 780.1 2391.3 777.7 2459.1 777.1"
                      />
                      <polygon
                        data-label="C52"
                        id="_x37_8"
                        data-name="_x37_"
                        className="st0"
                        points="2612.9 547 2612.9 757.2 2545.7 757.2 2545.7 765.2 2518.2 765.2 2518.2 757.2 2464.6 757.2 2464.6 543.2 2518.9 543.2 2518.9 547.4 2612.9 547"
                      />
                      <polygon
                        data-label="C53"
                        id="_x38_8"
                        data-name="_x38_"
                        className="st0"
                        points="2694.1 543.2 2694.1 571.2 2792.2 571.2 2792.2 782.2 2664.5 782.2 2664.5 776.9 2647.6 776.9 2647.6 780.1 2618.3 780.1 2618.3 543.2 2694.1 543.2"
                      />
                      <path
                        data-label="C54"
                        id="_x39_8"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.2,788.4v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="9" id="floor-9">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/9.png", import.meta.url).href
                      }
                    />
                    <g id="A" data-name="A09">
                      <polygon
                        data-label="A85"
                        id="_x31_3"
                        data-name="_x31_"
                        className="st0"
                        points="567.3 777.7 580.7 777.6 580.9 780.7 607.7 780.7 607.6 777.3 682.8 777.6 683.4 739.2 687.1 739.2 686.1 547.8 567.3 548 567.3 777.7"
                      />
                      <polygon
                        data-label="A86"
                        id="_x32_3"
                        data-name="_x32_"
                        className="st0"
                        points="858.8 777.4 858.8 740.1 860.3 740.1 860.3 543 790.1 543 790.1 547.8 691.4 547.8 691.4 777.4 782.4 777.4 782.4 780.7 809.6 780.7 809.6 777.1 858.8 777.4"
                      />
                      <polygon
                        data-label="A87"
                        id="_x33_3"
                        data-name="_x33_"
                        className="st0"
                        points="1039.9 802.6 1039.9 783 1037.2 783 1037.2 739.2 1039.9 739.2 1039.9 547.5 941.8 547.5 941.8 543 866.2 543 866.2 739.5 867.7 739.5 867.7 777.7 881.3 777.7 881.3 780.7 907.4 780.7 907.4 777.4 917.2 777.4 917.2 802.6 1039.9 802.6"
                      />
                      <polygon
                        data-label="A88"
                        id="_x34_3"
                        data-name="_x34_"
                        className="st0"
                        points="1039.9 807.9 1039.9 1071 942.4 1071 942.4 1074.6 866.8 1074.6 866.8 838.1 881 838.1 881 834.9 908.6 834.9 908.6 838.1 917.2 838.1 917.2 807.9 1039.9 807.9"
                      />
                      <polygon
                        data-label="A89"
                        id="_x35_3"
                        data-name="_x35_"
                        className="st0"
                        points="860 1074.6 860 838.1 810.8 838.1 810.8 835.5 783 835.5 783 837.9 692 837.9 692 1071.3 790.1 1071.3 790.1 1074.6 860 1074.6"
                      />
                      <polygon
                        data-label="A90"
                        id="_x36_3"
                        data-name="_x36_"
                        className="st0"
                        points="685.2 837.9 685.2 1071.3 567.6 1071.3 567.6 837.9 581.4 837.9 581.4 835.5 609 835.5 609 837.7 685.2 837.9"
                      />
                      <path
                        data-label="A91"
                        id="_x37_3"
                        data-name="_x37_"
                        className="st0"
                        d="M561.6,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A92"
                        id="_x38_3"
                        data-name="_x38_"
                        className="st0"
                        points="377.1 838.3 377.1 875.9 381.4 875.9 381.4 968.1 377.7 968.1 377.7 1070.9 355.8 1068.2 355.3 1070.6 313.7 1060.7 314.5 1058.7 276.1 1042.9 274.8 1044.9 238.1 1023.3 239.3 1021.3 217.5 1005.1 217.5 1008.2 205.9 999 188.3 980.9 169.1 957.3 156.4 937.6 159.9 937.5 144.7 907.5 142.5 908.3 127.7 868.5 130.4 867.6 124.1 840 332.3 838.3 332.4 835.2 359 835.2 358.8 838.2 377.1 838.3"
                      />
                      <polygon
                        data-label="A93"
                        id="_x39_3"
                        data-name="_x39_"
                        className="st0"
                        points="323.9 771.9 323.9 678.4 326.5 678.4 326.5 651 323.9 651 323.9 604.8 124.5 604.8 124.5 602.4 105.9 602.4 105.9 604.8 63.2 604.8 63.2 674.1 67.9 674.1 67.6 771.9 323.9 771.9"
                      />
                      <polygon
                        data-label="A94"
                        id="_x31_03"
                        data-name="_x31_0"
                        className="st0"
                        points="323.6 599 323.6 553.5 326.5 553.5 326.5 526.6 323.6 526.6 323.6 433.3 228.3 433.3 228.3 434.6 67.4 434.6 67.4 531.8 63.2 531.7 63.2 594.1 105.2 594.1 105.2 597.5 125 597.5 125 599 184.1 599 184.1 594.1 228.1 594.1 228.1 599 323.6 599"
                      />
                      <polygon
                        data-label="A95"
                        id="_x31_13"
                        data-name="_x31_1"
                        className="st0"
                        points="324.3 428.1 324.3 331.7 326.5 331.7 326.5 303.9 324.3 303.9 324.3 257.7 64.3 257.7 64.3 328.4 67.7 328.4 67.9 423.3 106.1 423.3 106.1 429.3 184.5 429.3 184.5 423.9 228.5 423.9 228.5 427.9 324.3 428.1"
                      />
                      <polygon
                        data-label="A96"
                        id="_x31_23"
                        data-name="_x31_2"
                        className="st0"
                        points="377.4 252.4 377.4 75.7 239.2 48.8 239.2 45.7 172.7 32.1 120.1 22.1 102.1 19 89.2 21.7 78.9 28 69.1 39.5 64.4 53.5 64.4 70.4 94.7 70.4 94.7 85.3 67.2 85.3 67.2 252.4 332.5 252.4 332.5 254.8 359.6 254.8 359.6 252.1 377.4 252.4"
                      />
                      <polygon
                        data-label="A97"
                        id="_x31_33"
                        data-name="_x31_3"
                        className="st0"
                        points="383.3 305.4 561.3 305.4 561.3 191 563.4 191 563.4 137.5 560.1 137.5 560.1 111.5 388.5 77.7 388.5 117.9 383.3 117.9 383.3 217.7 388.7 217.7 388.7 261.3 380.5 261.3 380.5 288.1 383.2 288.1 383.3 305.4"
                      />
                      <polygon
                        data-label="A98"
                        id="_x31_43"
                        data-name="_x31_4"
                        className="st0"
                        points="442.8 583.3 442.8 483.8 561.8 483.8 561.8 441.6 550.5 441.6 550.5 425.3 561.8 425.3 561.8 407 567.1 407.3 567.1 419.8 603 419.9 603 352.8 561.3 352.8 561.3 311.6 383.3 311.6 383.3 435.9 380.4 435.9 380.4 463.3 383.3 463.3 383.3 583.3 442.8 583.3"
                      />
                    </g>
                    <g id="B" data-name="B09">
                      <polygon
                        data-label="B55"
                        id="_x31_4"
                        data-name="_x31_"
                        className="st0"
                        points="1257.6 833.3 1257.6 955.3 1229.8 955.3 1229.8 1074.4 1155.1 1074.4 1155.1 1067.9 1149.2 1067.9 1149.2 1070.6 1057.4 1070.6 1057.4 807.8 1180 807.8 1180 833.6 1207.3 833.6 1207.3 831.2 1234.8 831.2 1234.8 833.9 1257.6 833.3"
                      />
                      <polygon
                        data-label="B56"
                        id="_x32_4"
                        data-name="_x32_"
                        className="st0"
                        points="1290.2 757.4 1290.2 584.7 1292 584.7 1292 542.9 1155.1 542.9 1155.1 547.9 1056.8 547.9 1056.8 802.4 1180 802.4 1180 777.6 1187.7 777.6 1187.7 780.2 1215.6 780.2 1215.6 777.3 1229.5 777.3 1229.5 756.8 1290.2 757.4"
                      />
                      <polygon
                        data-label="B57"
                        id="_x33_4"
                        data-name="_x33_"
                        className="st0"
                        points="1468.9 777.9 1468.9 547.6 1377.1 547.6 1377.1 542.9 1295.3 542.9 1295.3 757.1 1389.3 757.1 1389.3 780.7 1418.2 780.7 1418.2 777.1 1468.9 777.9"
                      />
                      <polygon
                        data-label="B58"
                        id="_x34_4"
                        data-name="_x34_"
                        className="st0"
                        points="1514.2 777.6 1561.5 777.6 1561.5 547.6 1475.1 547.6 1475.1 777.6 1487.1 777.6 1487.1 780.7 1514.2 780.7 1514.2 777.6"
                      />
                      <polygon
                        data-label="B59"
                        id="_x35_4"
                        data-name="_x35_"
                        className="st0"
                        points="1736.2 777.6 1736.2 543.3 1665.7 543.3 1665.7 547.6 1567.5 547.6 1567.5 777.6 1640.8 777.6 1640.8 780.7 1667.7 780.7 1667.7 777.3 1736.2 777.6"
                      />
                      <polygon
                        data-label="B60"
                        id="_x36_4"
                        data-name="_x36_"
                        className="st0"
                        points="1915.5 802.2 1915.5 547.3 1812.6 547.3 1812.6 543.3 1741.3 543.3 1741.3 778.2 1756.8 778.2 1756.8 780.7 1784.4 780.7 1784.4 777.6 1792.8 777.6 1792.8 802.2 1915.5 802.2"
                      />
                      <polygon
                        data-label="B61"
                        id="_x37_4"
                        data-name="_x37_"
                        className="st0"
                        points="1792.8 807.8 1915.5 807.8 1915.5 1071.1 1811.9 1071.1 1811.9 1075.6 1741.3 1075.6 1741.3 833.6 1756.8 833.6 1756.8 830.7 1784.4 830.7 1784.4 833.8 1792.8 833.8 1792.8 807.8"
                      />
                      <polygon
                        data-label="B62"
                        id="_x38_4"
                        data-name="_x38_"
                        className="st0"
                        points="1567.5 833.6 1640.6 833.6 1640.6 830.9 1668.2 830.9 1668.2 833.6 1736.2 833.6 1736.2 1075.6 1665.3 1075.6 1665.3 1070.7 1567.5 1070.7 1567.5 833.6"
                      />
                      <polygon
                        data-label="B63"
                        id="_x39_4"
                        data-name="_x39_"
                        className="st0"
                        points="1561.3 833.3 1561.3 1070.4 1463.9 1070.4 1463.9 1075.6 1389.7 1075.6 1389.7 833.3 1461.1 833.3 1461.1 830.9 1488.8 830.9 1488.8 833.3 1561.3 833.3"
                      />
                    </g>
                    <g id="C" data-name="C09">
                      <polygon
                        data-label="C55"
                        id="_x31_5"
                        data-name="_x31_"
                        className="st0"
                        points="2489.1 833.7 2489.1 955 2459.6 955 2459.6 1075 2389.1 1075 2389.1 1070.8 2288 1070.8 2288 833.7 2441.1 833.7 2441.1 831.2 2468.2 831.2 2468.2 834.3 2489.1 833.7"
                      />
                      <polygon
                        data-label="C56"
                        id="_x32_5"
                        data-name="_x32_"
                        className="st0"
                        points="2206.9 831.2 2206.9 833.7 2282.7 833.7 2282.7 1070.8 2181.3 1070.8 2181.3 1075 2110.9 1075 2110.9 833.7 2178.9 833.7 2178.9 831.2 2206.9 831.2"
                      />
                      <polygon
                        data-label="C57"
                        id="_x33_5"
                        data-name="_x33_"
                        className="st0"
                        points="2105.6 1075.9 2105.6 833.9 2089.6 833.9 2089.6 831.2 2063.3 831.2 2063.3 833.4 2054.5 833.4 2054.5 808.1 1931.1 808.1 1931.1 1071.4 2035.1 1071.4 2035.1 1075.9 2105.6 1075.9"
                      />
                      <polygon
                        data-label="C58"
                        id="_x34_5"
                        data-name="_x34_"
                        className="st0"
                        points="2054.1 802.6 2054.1 778.2 2062.7 778.2 2062.7 780.9 2090.2 780.9 2090.2 778.2 2105.6 778.2 2105.6 543.7 2034.8 543.7 2034.8 548 1931.1 548 1931.1 802.6 2054.1 802.6"
                      />
                      <polygon
                        data-label="C59"
                        id="_x35_5"
                        data-name="_x35_"
                        className="st0"
                        points="2281.9 548 2281.9 778.2 2206.7 778.2 2206.7 780.6 2180 780.6 2180 777.9 2110.7 777.9 2110.7 543.7 2181.5 543.7 2181.5 548.3 2281.9 548"
                      />
                      <polygon
                        data-label="C60"
                        id="_x36_5"
                        data-name="_x36_"
                        className="st0"
                        points="2459.4 777.6 2459.4 543.7 2389.2 543.7 2389.2 547.7 2288.2 547.7 2288.2 777.6 2363.7 777.6 2363.7 780.6 2391.6 780.6 2391.6 778.2 2459.4 777.6"
                      />
                      <polygon
                        data-label="C61"
                        id="_x37_5"
                        data-name="_x37_"
                        className="st0"
                        points="2613.1 547.4 2613.1 757.7 2546 757.7 2546 765.7 2518.5 765.7 2518.5 757.7 2464.9 757.7 2464.9 543.7 2519.1 543.7 2519.1 547.9 2613.1 547.4"
                      />
                      <polygon
                        data-label="C62"
                        id="_x38_5"
                        data-name="_x38_"
                        className="st0"
                        points="2694.4 543.7 2694.4 571.7 2792.5 571.7 2792.5 782.6 2664.8 782.6 2664.8 777.3 2647.9 777.3 2647.9 780.6 2618.5 780.6 2618.5 543.7 2694.4 543.7"
                      />
                      <path
                        data-label="C63"
                        id="_x39_5"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.5,788.9v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="10" id="floor-10">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/10.png", import.meta.url).href
                      }
                    />
                    <g id="A" data-name="A10">
                      <polygon
                        data-label="A99"
                        id="_x31_3"
                        data-name="_x31_"
                        className="st0"
                        points="567.3 777.7 580.7 777.6 580.9 780.7 607.7 780.7 607.6 777.3 682.8 777.6 683.4 739.2 687.1 739.2 686.1 547.8 567.3 548 567.3 777.7"
                      />
                      <polygon
                        data-label="A100"
                        id="_x32_3"
                        data-name="_x32_"
                        className="st0"
                        points="858.8 777.4 858.8 740.1 860.3 740.1 860.3 543 790.1 543 790.1 547.8 691.4 547.8 691.4 777.4 782.4 777.4 782.4 780.7 809.6 780.7 809.6 777.1 858.8 777.4"
                      />
                      <polygon
                        data-label="A101"
                        id="_x33_3"
                        data-name="_x33_"
                        className="st0"
                        points="1039.9 802.6 1039.9 783 1037.2 783 1037.2 739.2 1039.9 739.2 1039.9 547.5 941.8 547.5 941.8 543 866.2 543 866.2 739.5 867.7 739.5 867.7 777.7 881.3 777.7 881.3 780.7 907.4 780.7 907.4 777.4 917.2 777.4 917.2 802.6 1039.9 802.6"
                      />
                      <polygon
                        data-label="A102"
                        id="_x34_3"
                        data-name="_x34_"
                        className="st0"
                        points="1039.9 807.9 1039.9 1071 942.4 1071 942.4 1074.6 866.8 1074.6 866.8 838.1 881 838.1 881 834.9 908.6 834.9 908.6 838.1 917.2 838.1 917.2 807.9 1039.9 807.9"
                      />
                      <polygon
                        data-label="A103"
                        id="_x35_3"
                        data-name="_x35_"
                        className="st0"
                        points="860 1074.6 860 838.1 810.8 838.1 810.8 835.5 783 835.5 783 837.9 692 837.9 692 1071.3 790.1 1071.3 790.1 1074.6 860 1074.6"
                      />
                      <polygon
                        data-label="A104"
                        id="_x36_3"
                        data-name="_x36_"
                        className="st0"
                        points="685.2 837.9 685.2 1071.3 567.6 1071.3 567.6 837.9 581.4 837.9 581.4 835.5 609 835.5 609 837.7 685.2 837.9"
                      />
                      <path
                        data-label="A105"
                        id="_x37_3"
                        data-name="_x37_"
                        className="st0"
                        d="M561.6,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A106"
                        id="_x38_3"
                        data-name="_x38_"
                        className="st0"
                        points="377.1 838.3 377.1 875.9 381.4 875.9 381.4 968.1 377.7 968.1 377.7 1070.9 355.8 1068.2 355.3 1070.6 313.7 1060.7 314.5 1058.7 276.1 1042.9 274.8 1044.9 238.1 1023.3 239.3 1021.3 217.5 1005.1 217.5 1008.2 205.9 999 188.3 980.9 169.1 957.3 156.4 937.6 159.9 937.5 144.7 907.5 142.5 908.3 127.7 868.5 130.4 867.6 124.1 840 332.3 838.3 332.4 835.2 359 835.2 358.8 838.2 377.1 838.3"
                      />
                      <polygon
                        data-label="A107"
                        id="_x39_3"
                        data-name="_x39_"
                        className="st0"
                        points="323.9 771.9 323.9 678.4 326.5 678.4 326.5 651 323.9 651 323.9 604.8 124.5 604.8 124.5 602.4 105.9 602.4 105.9 604.8 63.2 604.8 63.2 674.1 67.9 674.1 67.6 771.9 323.9 771.9"
                      />
                      <polygon
                        data-label="A108"
                        id="_x31_03"
                        data-name="_x31_0"
                        className="st0"
                        points="323.6 599 323.6 553.5 326.5 553.5 326.5 526.6 323.6 526.6 323.6 433.3 228.3 433.3 228.3 434.6 67.4 434.6 67.4 531.8 63.2 531.7 63.2 594.1 105.2 594.1 105.2 597.5 125 597.5 125 599 184.1 599 184.1 594.1 228.1 594.1 228.1 599 323.6 599"
                      />
                      <polygon
                        data-label="A109"
                        id="_x31_13"
                        data-name="_x31_1"
                        className="st0"
                        points="324.3 428.1 324.3 331.7 326.5 331.7 326.5 303.9 324.3 303.9 324.3 257.7 64.3 257.7 64.3 328.4 67.7 328.4 67.9 423.3 106.1 423.3 106.1 429.3 184.5 429.3 184.5 423.9 228.5 423.9 228.5 427.9 324.3 428.1"
                      />
                      <polygon
                        data-label="A110"
                        id="_x31_23"
                        data-name="_x31_2"
                        className="st0"
                        points="377.4 252.4 377.4 75.7 239.2 48.8 239.2 45.7 172.7 32.1 120.1 22.1 102.1 19 89.2 21.7 78.9 28 69.1 39.5 64.4 53.5 64.4 70.4 94.7 70.4 94.7 85.3 67.2 85.3 67.2 252.4 332.5 252.4 332.5 254.8 359.6 254.8 359.6 252.1 377.4 252.4"
                      />
                      <polygon
                        data-label="A111"
                        id="_x31_33"
                        data-name="_x31_3"
                        className="st0"
                        points="383.3 305.4 561.3 305.4 561.3 191 563.4 191 563.4 137.5 560.1 137.5 560.1 111.5 388.5 77.7 388.5 117.9 383.3 117.9 383.3 217.7 388.7 217.7 388.7 261.3 380.5 261.3 380.5 288.1 383.2 288.1 383.3 305.4"
                      />
                      <polygon
                        data-label="A112"
                        id="_x31_43"
                        data-name="_x31_4"
                        className="st0"
                        points="442.8 583.3 442.8 483.8 561.8 483.8 561.8 441.6 550.5 441.6 550.5 425.3 561.8 425.3 561.8 407 567.1 407.3 567.1 419.8 603 419.9 603 352.8 561.3 352.8 561.3 311.6 383.3 311.6 383.3 435.9 380.4 435.9 380.4 463.3 383.3 463.3 383.3 583.3 442.8 583.3"
                      />
                    </g>
                    <g id="B" data-name="B10">
                      <polygon
                        data-label="B64"
                        id="_x31_4"
                        data-name="_x31_"
                        className="st0"
                        points="1257.6 833.3 1257.6 955.3 1229.8 955.3 1229.8 1074.4 1155.1 1074.4 1155.1 1067.9 1149.2 1067.9 1149.2 1070.6 1057.4 1070.6 1057.4 807.8 1180 807.8 1180 833.6 1207.3 833.6 1207.3 831.2 1234.8 831.2 1234.8 833.9 1257.6 833.3"
                      />
                      <polygon
                        data-label="B65"
                        id="_x32_4"
                        data-name="_x32_"
                        className="st0"
                        points="1290.2 757.4 1290.2 584.7 1292 584.7 1292 542.9 1155.1 542.9 1155.1 547.9 1056.8 547.9 1056.8 802.4 1180 802.4 1180 777.6 1187.7 777.6 1187.7 780.2 1215.6 780.2 1215.6 777.3 1229.5 777.3 1229.5 756.8 1290.2 757.4"
                      />
                      <polygon
                        data-label="B66"
                        id="_x33_4"
                        data-name="_x33_"
                        className="st0"
                        points="1468.9 777.9 1468.9 547.6 1377.1 547.6 1377.1 542.9 1295.3 542.9 1295.3 757.1 1389.3 757.1 1389.3 780.7 1418.2 780.7 1418.2 777.1 1468.9 777.9"
                      />
                      <polygon
                        data-label="B67"
                        id="_x34_4"
                        data-name="_x34_"
                        className="st0"
                        points="1514.2 777.6 1561.5 777.6 1561.5 547.6 1475.1 547.6 1475.1 777.6 1487.1 777.6 1487.1 780.7 1514.2 780.7 1514.2 777.6"
                      />
                      <polygon
                        data-label="B68"
                        id="_x35_4"
                        data-name="_x35_"
                        className="st0"
                        points="1736.2 777.6 1736.2 543.3 1665.7 543.3 1665.7 547.6 1567.5 547.6 1567.5 777.6 1640.8 777.6 1640.8 780.7 1667.7 780.7 1667.7 777.3 1736.2 777.6"
                      />
                      <polygon
                        data-label="B69"
                        id="_x36_4"
                        data-name="_x36_"
                        className="st0"
                        points="1915.5 802.2 1915.5 547.3 1812.6 547.3 1812.6 543.3 1741.3 543.3 1741.3 778.2 1756.8 778.2 1756.8 780.7 1784.4 780.7 1784.4 777.6 1792.8 777.6 1792.8 802.2 1915.5 802.2"
                      />
                      <polygon
                        data-label="B70"
                        id="_x37_4"
                        data-name="_x37_"
                        className="st0"
                        points="1792.8 807.8 1915.5 807.8 1915.5 1071.1 1811.9 1071.1 1811.9 1075.6 1741.3 1075.6 1741.3 833.6 1756.8 833.6 1756.8 830.7 1784.4 830.7 1784.4 833.8 1792.8 833.8 1792.8 807.8"
                      />
                      <polygon
                        data-label="B71"
                        id="_x38_4"
                        data-name="_x38_"
                        className="st0"
                        points="1567.5 833.6 1640.6 833.6 1640.6 830.9 1668.2 830.9 1668.2 833.6 1736.2 833.6 1736.2 1075.6 1665.3 1075.6 1665.3 1070.7 1567.5 1070.7 1567.5 833.6"
                      />
                      <polygon
                        data-label="B72"
                        id="_x39_4"
                        data-name="_x39_"
                        className="st0"
                        points="1561.3 833.3 1561.3 1070.4 1463.9 1070.4 1463.9 1075.6 1389.7 1075.6 1389.7 833.3 1461.1 833.3 1461.1 830.9 1488.8 830.9 1488.8 833.3 1561.3 833.3"
                      />
                    </g>
                    <g id="C" data-name="C10">
                      <polygon
                        data-label="C64"
                        id="_x31_5"
                        data-name="_x31_"
                        className="st0"
                        points="2489.1 833.7 2489.1 955 2459.6 955 2459.6 1075 2389.1 1075 2389.1 1070.8 2288 1070.8 2288 833.7 2441.1 833.7 2441.1 831.2 2468.2 831.2 2468.2 834.3 2489.1 833.7"
                      />
                      <polygon
                        data-label="C65"
                        id="_x32_5"
                        data-name="_x32_"
                        className="st0"
                        points="2206.9 831.2 2206.9 833.7 2282.7 833.7 2282.7 1070.8 2181.3 1070.8 2181.3 1075 2110.9 1075 2110.9 833.7 2178.9 833.7 2178.9 831.2 2206.9 831.2"
                      />
                      <polygon
                        data-label="C66"
                        id="_x33_5"
                        data-name="_x33_"
                        className="st0"
                        points="2105.6 1075.9 2105.6 833.9 2089.6 833.9 2089.6 831.2 2063.3 831.2 2063.3 833.4 2054.5 833.4 2054.5 808.1 1931.1 808.1 1931.1 1071.4 2035.1 1071.4 2035.1 1075.9 2105.6 1075.9"
                      />
                      <polygon
                        data-label="C67"
                        id="_x34_5"
                        data-name="_x34_"
                        className="st0"
                        points="2054.1 802.6 2054.1 778.2 2062.7 778.2 2062.7 780.9 2090.2 780.9 2090.2 778.2 2105.6 778.2 2105.6 543.7 2034.8 543.7 2034.8 548 1931.1 548 1931.1 802.6 2054.1 802.6"
                      />
                      <polygon
                        data-label="C68"
                        id="_x35_5"
                        data-name="_x35_"
                        className="st0"
                        points="2281.9 548 2281.9 778.2 2206.7 778.2 2206.7 780.6 2180 780.6 2180 777.9 2110.7 777.9 2110.7 543.7 2181.5 543.7 2181.5 548.3 2281.9 548"
                      />
                      <polygon
                        data-label="C69"
                        id="_x36_5"
                        data-name="_x36_"
                        className="st0"
                        points="2459.4 777.6 2459.4 543.7 2389.2 543.7 2389.2 547.7 2288.2 547.7 2288.2 777.6 2363.7 777.6 2363.7 780.6 2391.6 780.6 2391.6 778.2 2459.4 777.6"
                      />
                      <polygon
                        data-label="C70"
                        id="_x37_5"
                        data-name="_x37_"
                        className="st0"
                        points="2613.1 547.4 2613.1 757.7 2546 757.7 2546 765.7 2518.5 765.7 2518.5 757.7 2464.9 757.7 2464.9 543.7 2519.1 543.7 2519.1 547.9 2613.1 547.4"
                      />
                      <polygon
                        data-label="C71"
                        id="_x38_5"
                        data-name="_x38_"
                        className="st0"
                        points="2694.4 543.7 2694.4 571.7 2792.5 571.7 2792.5 782.6 2664.8 782.6 2664.8 777.3 2647.9 777.3 2647.9 780.6 2618.5 780.6 2618.5 543.7 2694.4 543.7"
                      />
                      <path
                        data-label="C72"
                        id="_x39_5"
                        data-name="_x39_"
                        className="st0"
                        d="M2792.5,788.9v282.1h-102.5v4.1s-71.1,1.4-71.1,0v-240.8h11.9v-3h26.4v2.8h8v-45.2h127.4Z"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="11" id="floor-11">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/11.png", import.meta.url).href
                      }
                    />
                    <g id="A2" data-name="A11">
                      <polygon
                        data-label="A113"
                        id="_x31_2"
                        data-name="_x31_"
                        className="st0"
                        points="567.5 777.8 580.9 777.7 581.1 780.8 607.9 780.8 607.8 777.4 683 777.7 683.6 739.3 687.3 739.3 686.3 547.9 567.5 548.1 567.5 777.8"
                      />
                      <polygon
                        data-label="A114"
                        id="_x32_2"
                        data-name="_x32_"
                        className="st0"
                        points="859 777.5 859 740.2 860.5 740.2 860.5 543.1 790.3 543.1 790.3 547.9 691.6 547.9 691.6 777.5 782.6 777.5 782.6 780.8 809.8 780.8 809.8 777.2 859 777.5"
                      />
                      <polygon
                        data-label="A115"
                        id="_x33_2"
                        data-name="_x33_"
                        className="st0"
                        points="1040 802.7 1040 783.1 1037.4 783.1 1037.4 739.3 1040 739.3 1040 547.6 942 547.6 942 543.1 866.4 543.1 866.4 739.6 867.9 739.6 867.9 777.8 881.5 777.8 881.5 780.8 907.6 780.8 907.6 777.5 917.4 777.5 917.4 802.7 1040 802.7"
                      />
                      <polygon
                        data-label="A116"
                        id="_x34_2"
                        data-name="_x34_"
                        className="st0"
                        points="1040 808 1040 1071.1 942.6 1071.1 942.6 1074.7 867 1074.7 867 838.3 881.2 838.3 881.2 835 908.8 835 908.8 838.3 917.4 838.3 917.4 808 1040 808"
                      />
                      <polygon
                        data-label="A117"
                        id="_x35_2"
                        data-name="_x35_"
                        className="st0"
                        points="860.2 1074.7 860.2 838.3 811 838.3 811 835.6 783.1 835.6 783.1 838 692.2 838 692.2 1071.4 790.3 1071.4 790.3 1074.7 860.2 1074.7"
                      />
                      <polygon
                        data-label="A118"
                        id="_x36_2"
                        data-name="_x36_"
                        className="st0"
                        points="685.4 838 685.4 1071.4 567.7 1071.4 567.7 838 581.6 838 581.6 835.6 609.1 835.6 609.1 837.8 685.4 838"
                      />
                      <path
                        data-label="A119"
                        id="_x37_2"
                        data-name="_x37_"
                        className="st0"
                        d="M561.8,1071.4s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A120"
                        id="_x38_2"
                        data-name="_x38_"
                        className="st0"
                        points="377.3 838.4 377.3 876 381.6 876 381.6 968.2 377.9 968.2 377.9 1071 356 1068.3 355.4 1070.7 313.9 1060.8 314.7 1058.8 276.3 1043 275 1045 238.3 1023.4 239.5 1021.4 217.7 1005.2 217.7 1008.3 206.1 999.1 188.5 981 169.3 957.4 156.6 937.7 160.1 937.6 144.9 907.6 142.7 908.4 127.9 868.6 130.6 867.7 124.3 840.1 332.5 838.4 332.6 835.3 359.1 835.3 359 838.3 377.3 838.4"
                      />
                      <polygon
                        data-label="A121"
                        id="_x39_2"
                        data-name="_x39_"
                        className="st0"
                        points="324 772 324 678.5 326.7 678.5 326.7 651.1 324 651.1 324 604.9 124.7 604.9 124.7 602.5 106 602.5 106 604.9 63.4 604.9 63.4 674.3 68 674.3 67.8 772 324 772"
                      />
                      <polygon
                        data-label="A122"
                        id="_x31_02"
                        data-name="_x31_0"
                        className="st0"
                        points="323.8 599.1 323.8 553.6 326.7 553.6 326.7 526.7 323.8 526.7 323.8 433.4 228.5 433.4 228.5 434.7 67.6 434.7 67.6 531.9 63.4 531.8 63.4 594.3 105.4 594.3 105.4 597.6 125.1 597.6 125.1 599.1 184.3 599.1 184.3 594.3 228.3 594.3 228.3 599.1 323.8 599.1"
                      />
                      <polygon
                        data-label="A123"
                        id="_x31_12"
                        data-name="_x31_1"
                        className="st0"
                        points="324.5 428.3 324.5 331.8 326.7 331.8 326.7 304 324.5 304 324.5 257.8 64.5 257.8 64.5 328.5 67.9 328.5 68 423.4 106.3 423.4 106.3 429.4 184.7 429.4 184.7 424 228.7 424 228.7 428 324.5 428.3"
                      />
                      <polygon
                        data-label="A124"
                        id="_x31_22"
                        data-name="_x31_2"
                        className="st0"
                        points="377.6 252.5 377.6 75.8 239.4 48.9 239.4 45.8 172.9 32.3 120.3 22.3 102.3 19.1 89.4 21.8 79 28.1 69.3 39.6 64.6 53.6 64.6 70.5 94.9 70.5 94.9 85.4 67.4 85.4 67.4 252.5 332.7 252.5 332.7 254.9 359.8 254.9 359.8 252.3 377.6 252.5"
                      />
                      <polygon
                        data-label="A125"
                        id="_x31_32"
                        data-name="_x31_3"
                        className="st0"
                        points="383.4 305.5 561.5 305.5 561.5 191.1 563.6 191.1 563.6 137.6 560.3 137.6 560.3 111.6 388.7 77.8 388.7 118 383.4 118 383.4 217.8 388.9 217.8 388.9 261.4 380.7 261.4 380.7 288.3 383.4 288.3 383.4 305.5"
                      />
                      <polygon
                        data-label="A126"
                        id="_x31_42"
                        data-name="_x31_4"
                        className="st0"
                        points="443 583.4 443 483.9 562 483.9 562 441.7 550.7 441.7 550.7 425.4 562 425.4 562 407.1 567.3 407.4 567.3 419.9 603.2 420 603.2 352.9 561.5 352.9 561.5 311.7 383.4 311.7 383.4 436 380.6 436 380.6 463.4 383.4 463.4 383.4 583.4 443 583.4"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="12" id="floor-12">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/12.png", import.meta.url).href
                      }
                    />
                    <g id="A3" data-name="A12">
                      <polygon
                        data-label="A127"
                        id="_x31_3"
                        data-name="_x31_"
                        className="st0"
                        points="567.3 777.7 580.7 777.6 580.9 780.7 607.7 780.7 607.6 777.3 682.8 777.6 683.4 739.2 687.1 739.2 686.1 547.8 567.3 548 567.3 777.7"
                      />
                      <polygon
                        data-label="A128"
                        id="_x32_3"
                        data-name="_x32_"
                        className="st0"
                        points="858.8 777.4 858.8 740.1 860.3 740.1 860.3 543 790.1 543 790.1 547.8 691.4 547.8 691.4 777.4 782.4 777.4 782.4 780.7 809.6 780.7 809.6 777.1 858.8 777.4"
                      />
                      <polygon
                        data-label="A129"
                        id="_x33_3"
                        data-name="_x33_"
                        className="st0"
                        points="1039.9 802.6 1039.9 783 1037.2 783 1037.2 739.2 1039.9 739.2 1039.9 547.5 941.8 547.5 941.8 543 866.2 543 866.2 739.5 867.7 739.5 867.7 777.7 881.3 777.7 881.3 780.7 907.4 780.7 907.4 777.4 917.2 777.4 917.2 802.6 1039.9 802.6"
                      />
                      <polygon
                        data-label="A130"
                        id="_x34_3"
                        data-name="_x34_"
                        className="st0"
                        points="1039.9 807.9 1039.9 1071 942.4 1071 942.4 1074.6 866.8 1074.6 866.8 838.1 881 838.1 881 834.9 908.6 834.9 908.6 838.1 917.2 838.1 917.2 807.9 1039.9 807.9"
                      />
                      <polygon
                        data-label="A131"
                        id="_x35_3"
                        data-name="_x35_"
                        className="st0"
                        points="860 1074.6 860 838.1 810.8 838.1 810.8 835.5 783 835.5 783 837.9 692 837.9 692 1071.3 790.1 1071.3 790.1 1074.6 860 1074.6"
                      />
                      <polygon
                        data-label="A132"
                        id="_x36_3"
                        data-name="_x36_"
                        className="st0"
                        points="685.2 837.9 685.2 1071.3 567.6 1071.3 567.6 837.9 581.4 837.9 581.4 835.5 609 835.5 609 837.7 685.2 837.9"
                      />
                      <path
                        data-label="A133"
                        id="_x37_3"
                        data-name="_x37_"
                        className="st0"
                        d="M561.6,1071.3s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h98.7Z"
                      />
                      <polygon
                        data-label="A134"
                        id="_x38_3"
                        data-name="_x38_"
                        className="st0"
                        points="377.1 838.3 377.1 875.9 381.4 875.9 381.4 968.1 377.7 968.1 377.7 1070.9 355.8 1068.2 355.3 1070.6 313.7 1060.7 314.5 1058.7 276.1 1042.9 274.8 1044.9 238.1 1023.3 239.3 1021.3 217.5 1005.1 217.5 1008.2 205.9 999 188.3 980.9 169.1 957.3 156.4 937.6 159.9 937.5 144.7 907.5 142.5 908.3 127.7 868.5 130.4 867.6 124.1 840 332.3 838.3 332.4 835.2 359 835.2 358.8 838.2 377.1 838.3"
                      />
                      <polygon
                        data-label="A135"
                        id="_x39_3"
                        data-name="_x39_"
                        className="st0"
                        points="323.9 771.9 323.9 678.4 326.5 678.4 326.5 651 323.9 651 323.9 604.8 124.5 604.8 124.5 602.4 105.9 602.4 105.9 604.8 63.2 604.8 63.2 674.1 67.9 674.1 67.6 771.9 323.9 771.9"
                      />
                      <polygon
                        data-label="A136"
                        id="_x31_03"
                        data-name="_x31_0"
                        className="st0"
                        points="323.6 599 323.6 553.5 326.5 553.5 326.5 526.6 323.6 526.6 323.6 433.3 228.3 433.3 228.3 434.6 67.4 434.6 67.4 531.8 63.2 531.7 63.2 594.1 105.2 594.1 105.2 597.5 125 597.5 125 599 184.1 599 184.1 594.1 228.1 594.1 228.1 599 323.6 599"
                      />
                      <polygon
                        data-label="A137"
                        id="_x31_13"
                        data-name="_x31_1"
                        className="st0"
                        points="324.3 428.1 324.3 331.7 326.5 331.7 326.5 303.9 324.3 303.9 324.3 257.7 64.3 257.7 64.3 328.4 67.7 328.4 67.9 423.3 106.1 423.3 106.1 429.3 184.5 429.3 184.5 423.9 228.5 423.9 228.5 427.9 324.3 428.1"
                      />
                      <polygon
                        data-label="A138"
                        id="_x31_23"
                        data-name="_x31_2"
                        className="st0"
                        points="377.4 252.4 377.4 75.7 239.2 48.8 239.2 45.7 172.7 32.1 120.1 22.1 102.1 19 89.2 21.7 78.9 28 69.1 39.5 64.4 53.5 64.4 70.4 94.7 70.4 94.7 85.3 67.2 85.3 67.2 252.4 332.5 252.4 332.5 254.8 359.6 254.8 359.6 252.1 377.4 252.4"
                      />
                      <polygon
                        data-label="A139"
                        id="_x31_33"
                        data-name="_x31_3"
                        className="st0"
                        points="383.3 305.4 561.3 305.4 561.3 191 563.4 191 563.4 137.5 560.1 137.5 560.1 111.5 388.5 77.7 388.5 117.9 383.3 117.9 383.3 217.7 388.7 217.7 388.7 261.3 380.5 261.3 380.5 288.1 383.2 288.1 383.3 305.4"
                      />
                      <polygon
                        data-label="A140"
                        id="_x31_43"
                        data-name="_x31_4"
                        className="st0"
                        points="442.8 583.3 442.8 483.8 561.8 483.8 561.8 441.6 550.5 441.6 550.5 425.3 561.8 425.3 561.8 407 567.1 407.3 567.1 419.8 603 419.9 603 352.8 561.3 352.8 561.3 311.6 383.3 311.6 383.3 435.9 380.4 435.9 380.4 463.3 383.3 463.3 383.3 583.3 442.8 583.3"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="13" id="floor-13">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/3.png", import.meta.url).href
                      }
                    />
                    <g id="A" data-name="A13">
                      <polygon
                        data-label="A141"
                        id="_x31_"
                        className="st0"
                        points="567.8 778 581.2 777.9 581.3 781 608.1 781 608.1 777.6 683.2 777.9 683.9 739.5 686.5 739.5 686.5 546 612.9 546 612.8 548.4 567.8 548.3 567.8 778"
                      />
                      <polygon
                        data-label="A142"
                        id="_x32_"
                        className="st0"
                        points="859.3 777.7 859.3 740.4 860.7 740.4 860.7 543.4 790.5 543.4 790.5 548.1 774.7 548.1 774.7 545.7 701.7 545.7 701.8 548.1 691.9 548.1 691.9 777.7 782.8 777.7 782.8 781 810.1 781 810.1 777.4 859.3 777.7"
                      />
                      <polygon
                        data-label="A143"
                        id="_x33_"
                        className="st0"
                        points="1040.3 802.9 1040.3 783.4 1037.6 783.4 1037.6 739.5 1040.3 739.5 1040.3 547.8 1030.6 547.8 1030.6 545.7 957.6 545.6 957.6 547.8 942.2 547.8 942.2 543.4 865.7 543.4 866.7 739.8 868.1 739.8 868.1 778 881.8 778 881.8 781 907.9 781 907.9 777.7 917.6 777.7 917.6 802.9 1040.3 802.9"
                      />
                      <polygon
                        data-label="A144"
                        id="_x34_"
                        className="st0"
                        points="1039.4 808.2 1039.4 1071.4 941.7 1071.4 941.7 1075.5 865.3 1075.5 865.3 838.5 880.6 838.5 880.6 835.2 908.1 835.2 908.1 838.5 916.7 838.5 916.7 808.2 1039.4 808.2"
                      />
                      <polygon
                        data-label="A145"
                        id="_x35_"
                        className="st0"
                        points="861.2 1075.5 860.4 838.5 811.3 838.5 811.3 835.8 783.4 835.8 783.4 838.2 692.4 838.2 692.4 1071.6 701.6 1071.6 701.6 1073.2 775 1073.4 774.8 1071.6 790.5 1071.6 790.5 1075.5 861.2 1075.5"
                      />
                      <polygon
                        data-label="A146"
                        id="_x36_"
                        className="st0"
                        points="685.6 838.2 685.6 1071.6 663.7 1071.6 663.7 1073.2 590.7 1073.6 590.7 1071.6 568 1071.6 568 838.2 581.9 838.2 581.9 835.8 609.4 835.8 609.4 838 685.6 838.2"
                      />
                      <path
                        data-label="A147"
                        id="_x37_"
                        className="st0"
                        d="M562.1,1071.6s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h15.6v1.9s73.1-.1,73.1-.1v-1.8h10Z"
                      />
                      <polygon
                        data-label="A148"
                        id="_x38_"
                        className="st0"
                        points="377.6 838.6 377.6 876.2 381.9 876.2 381.9 968.4 378.1 968.4 378.1 1071.2 356.2 1068.5 355.7 1070.9 314.1 1061 315 1059 276.5 1043.2 275.3 1045.2 238.6 1023.6 239.8 1021.6 217.9 1005.4 217.9 1008.5 206.4 999.4 188.7 981.2 169.6 957.6 156.9 937.9 160.4 937.8 145.1 907.8 143 908.6 128.1 868.8 130.8 867.9 124.5 840.3 332.7 838.6 332.8 835.5 359.4 835.5 359.3 838.5 377.6 838.6"
                      />
                      <polygon
                        data-label="A149"
                        id="_x39_"
                        className="st0"
                        points="324.3 772.2 324.3 678.7 327 678.7 327 651.4 324.3 651.4 324.3 605.1 125 605.1 125 602.7 106.3 602.7 106.3 605.1 63.6 605.1 63.6 674.5 68.3 674.5 68.2 698.8 65.4 698.9 65.3 753.5 68.1 753.6 68.1 772.2 324.3 772.2"
                      />
                      <polygon
                        data-label="A150"
                        id="_x31_0"
                        className="st0"
                        points="324.1 599.4 324.1 553.8 327 553.8 327 526.9 324.1 526.9 324.1 433.6 228.7 433.6 228.7 434.9 67.9 434.9 67.9 452.8 65.7 452.6 65.6 506.8 67.9 506.8 67.9 532.1 63.6 532 63.6 594.5 105.6 594.5 105.6 597.8 125.4 597.8 125.4 599.4 184.5 599.4 184.5 594.5 228.5 594.5 228.5 599.4 324.1 599.4"
                      />
                      <polygon
                        data-label="A151"
                        id="_x31_1"
                        className="st0"
                        points="324.7 428.5 324.7 332 327 332 327 304.2 324.7 304.2 324.7 258 63.4 258 63.4 328.7 68.1 328.7 68.2 353.1 65.6 353.3 65.6 407 68.3 407.1 68.3 423.6 106.5 423.6 106.5 429.6 185 429.6 185 424.2 229 424.2 229 428.2 324.7 428.5"
                      />
                      <polygon
                        data-label="A152"
                        id="_x31_2"
                        className="st0"
                        points="377.9 252.7 377.9 76 372 74.9 372.4 72.9 319.3 62.5 318.8 64.5 294.7 59.8 295.1 58 252.6 49.5 252 51.5 238.6 48.9 238.6 45 173.2 32.5 120.5 22.5 102.5 19.4 89.6 22 79.3 28.4 69.5 39.8 64.8 53.8 64.8 70.7 95.2 70.7 95.2 85.6 67.6 85.6 67.6 176.3 65.4 176.2 65.6 219.2 67.6 219.2 67.6 252.7 333 252.7 333 255.1 360.1 255.1 360.1 252.5 377.9 252.7"
                      />
                      <polygon
                        data-label="A153"
                        id="_x31_3"
                        className="st0"
                        points="383.7 305.7 561.8 305.7 561.8 302.1 563.9 302 563.9 261.8 561.8 261.9 561.8 191.4 563.9 191.4 563.9 137.8 560.5 137.8 560.5 111.8 541.9 108.1 542.1 106.4 489.4 95.9 488.8 97.7 461.7 92.3 462 90.6 419.7 82.2 419.3 84 389 78 389 118.2 383.7 118.2 383.7 218 389.2 218 389.2 261.6 381 261.6 381 288.5 383.6 288.5 383.7 305.7"
                      />
                      <polygon
                        data-label="A154"
                        id="_x31_4"
                        className="st0"
                        points="443.3 581.6 443.3 484.1 564.2 484.1 564.2 441.9 551 441.9 551 425.6 562.2 425.6 562.2 407.4 567.6 407.6 567.6 420.1 603.4 420.2 603.4 353.1 561.8 353.1 561.8 311.9 383.7 311.9 383.7 436.2 380.9 436.2 380.9 463.6 383.7 463.6 383.7 581.6 443.3 581.6"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="14" id="floor-14">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/3.png", import.meta.url).href
                      }
                    />
                    <g
                      xmlns="http://www.w3.org/2000/svg"
                      id="A"
                      data-name="A14"
                    >
                      <polygon
                        data-label="A155"
                        id="_x31_"
                        className="st0"
                        points="567.8 778 581.2 777.9 581.3 781 608.1 781 608.1 777.6 683.2 777.9 683.9 739.5 686.5 739.5 686.5 546 612.9 546 612.8 548.4 567.8 548.3 567.8 778"
                      />
                      <polygon
                        data-label="A156"
                        id="_x32_"
                        className="st0"
                        points="859.3 777.7 859.3 740.4 860.7 740.4 860.7 543.4 790.5 543.4 790.5 548.1 774.7 548.1 774.7 545.7 701.7 545.7 701.8 548.1 691.9 548.1 691.9 777.7 782.8 777.7 782.8 781 810.1 781 810.1 777.4 859.3 777.7"
                      />
                      <polygon
                        data-label="A157"
                        id="_x33_"
                        className="st0"
                        points="1040.3 802.9 1040.3 783.4 1037.6 783.4 1037.6 739.5 1040.3 739.5 1040.3 547.8 1030.6 547.8 1030.6 545.7 957.6 545.6 957.6 547.8 942.2 547.8 942.2 543.4 865.7 543.4 866.7 739.8 868.1 739.8 868.1 778 881.8 778 881.8 781 907.9 781 907.9 777.7 917.6 777.7 917.6 802.9 1040.3 802.9"
                      />
                      <polygon
                        data-label="A158"
                        id="_x34_"
                        className="st0"
                        points="1039.4 808.2 1039.4 1071.4 941.7 1071.4 941.7 1075.5 865.3 1075.5 865.3 838.5 880.6 838.5 880.6 835.2 908.1 835.2 908.1 838.5 916.7 838.5 916.7 808.2 1039.4 808.2"
                      />
                      <polygon
                        data-label="A159"
                        id="_x35_"
                        className="st0"
                        points="861.2 1075.5 860.4 838.5 811.3 838.5 811.3 835.8 783.4 835.8 783.4 838.2 692.4 838.2 692.4 1071.6 701.6 1071.6 701.6 1073.2 775 1073.4 774.8 1071.6 790.5 1071.6 790.5 1075.5 861.2 1075.5"
                      />
                      <polygon
                        data-label="A160"
                        id="_x36_"
                        className="st0"
                        points="685.6 838.2 685.6 1071.6 663.7 1071.6 663.7 1073.2 590.7 1073.6 590.7 1071.6 568 1071.6 568 838.2 581.9 838.2 581.9 835.8 609.4 835.8 609.4 838 685.6 838.2"
                      />
                      <path
                        id="_x37_"
                        data-label="A161"
                        className="st0"
                        d="M562.1,1071.6s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h15.6v1.9s73.1-.1,73.1-.1v-1.8h10Z"
                      />
                      <polygon
                        data-label="A162"
                        id="_x38_"
                        className="st0"
                        points="377.6 838.6 377.6 876.2 381.9 876.2 381.9 968.4 378.1 968.4 378.1 1071.2 356.2 1068.5 355.7 1070.9 314.1 1061 315 1059 276.5 1043.2 275.3 1045.2 238.6 1023.6 239.8 1021.6 217.9 1005.4 217.9 1008.5 206.4 999.4 188.7 981.2 169.6 957.6 156.9 937.9 160.4 937.8 145.1 907.8 143 908.6 128.1 868.8 130.8 867.9 124.5 840.3 332.7 838.6 332.8 835.5 359.4 835.5 359.3 838.5 377.6 838.6"
                      />
                      <polygon
                        data-label="A163"
                        id="_x39_"
                        className="st0"
                        points="324.3 772.2 324.3 678.7 327 678.7 327 651.4 324.3 651.4 324.3 605.1 125 605.1 125 602.7 106.3 602.7 106.3 605.1 63.6 605.1 63.6 674.5 68.3 674.5 68.2 698.8 65.4 698.9 65.3 753.5 68.1 753.6 68.1 772.2 324.3 772.2"
                      />
                      <polygon
                        data-label="A164"
                        id="_x31_0"
                        className="st0"
                        points="324.1 599.4 324.1 553.8 327 553.8 327 526.9 324.1 526.9 324.1 433.6 228.7 433.6 228.7 434.9 67.9 434.9 67.9 452.8 65.7 452.6 65.6 506.8 67.9 506.8 67.9 532.1 63.6 532 63.6 594.5 105.6 594.5 105.6 597.8 125.4 597.8 125.4 599.4 184.5 599.4 184.5 594.5 228.5 594.5 228.5 599.4 324.1 599.4"
                      />
                      <polygon
                        data-label="A165"
                        id="_x31_1"
                        className="st0"
                        points="324.7 428.5 324.7 332 327 332 327 304.2 324.7 304.2 324.7 258 63.4 258 63.4 328.7 68.1 328.7 68.2 353.1 65.6 353.3 65.6 407 68.3 407.1 68.3 423.6 106.5 423.6 106.5 429.6 185 429.6 185 424.2 229 424.2 229 428.2 324.7 428.5"
                      />
                      <polygon
                        data-label="A166"
                        id="_x31_2"
                        className="st0"
                        points="377.9 252.7 377.9 76 372 74.9 372.4 72.9 319.3 62.5 318.8 64.5 294.7 59.8 295.1 58 252.6 49.5 252 51.5 238.6 48.9 238.6 45 173.2 32.5 120.5 22.5 102.5 19.4 89.6 22 79.3 28.4 69.5 39.8 64.8 53.8 64.8 70.7 95.2 70.7 95.2 85.6 67.6 85.6 67.6 176.3 65.4 176.2 65.6 219.2 67.6 219.2 67.6 252.7 333 252.7 333 255.1 360.1 255.1 360.1 252.5 377.9 252.7"
                      />
                      <polygon
                        data-label="A167"
                        id="_x31_3"
                        className="st0"
                        points="383.7 305.7 561.8 305.7 561.8 302.1 563.9 302 563.9 261.8 561.8 261.9 561.8 191.4 563.9 191.4 563.9 137.8 560.5 137.8 560.5 111.8 541.9 108.1 542.1 106.4 489.4 95.9 488.8 97.7 461.7 92.3 462 90.6 419.7 82.2 419.3 84 389 78 389 118.2 383.7 118.2 383.7 218 389.2 218 389.2 261.6 381 261.6 381 288.5 383.6 288.5 383.7 305.7"
                      />
                      <polygon
                        data-label="A168"
                        id="_x31_4"
                        className="st0"
                        points="443.3 581.6 443.3 484.1 564.2 484.1 564.2 441.9 551 441.9 551 425.6 562.2 425.6 562.2 407.4 567.6 407.6 567.6 420.1 603.4 420.2 603.4 353.1 561.8 353.1 561.8 311.9 383.7 311.9 383.7 436.2 380.9 436.2 380.9 463.6 383.7 463.6 383.7 581.6 443.3 581.6"
                      />
                    </g>
                  </g>
                  <g className="floor-group" data-floor="15" id="floor-15">
                    <image
                      width="3149"
                      height="1310"
                      xlinkHref={
                        new URL("/images/genplans/3.png", import.meta.url).href
                      }
                    />
                    <g
                      xmlns="http://www.w3.org/2000/svg"
                      id="A"
                      data-name="A15"
                    >
                      <polygon
                        data-label="A169"
                        id="_x31_"
                        className="st0"
                        points="567.8 778 581.2 777.9 581.3 781 608.1 781 608.1 777.6 683.2 777.9 683.9 739.5 686.5 739.5 686.5 546 612.9 546 612.8 548.4 567.8 548.3 567.8 778"
                      />
                      <polygon
                        data-label="A170"
                        id="_x32_"
                        className="st0"
                        points="859.3 777.7 859.3 740.4 860.7 740.4 860.7 543.4 790.5 543.4 790.5 548.1 774.7 548.1 774.7 545.7 701.7 545.7 701.8 548.1 691.9 548.1 691.9 777.7 782.8 777.7 782.8 781 810.1 781 810.1 777.4 859.3 777.7"
                      />
                      <polygon
                        data-label="A171"
                        id="_x33_"
                        className="st0"
                        points="1040.3 802.9 1040.3 783.4 1037.6 783.4 1037.6 739.5 1040.3 739.5 1040.3 547.8 1030.6 547.8 1030.6 545.7 957.6 545.6 957.6 547.8 942.2 547.8 942.2 543.4 865.7 543.4 866.7 739.8 868.1 739.8 868.1 778 881.8 778 881.8 781 907.9 781 907.9 777.7 917.6 777.7 917.6 802.9 1040.3 802.9"
                      />
                      <polygon
                        data-label="A172"
                        id="_x34_"
                        className="st0"
                        points="1039.4 808.2 1039.4 1071.4 941.7 1071.4 941.7 1075.5 865.3 1075.5 865.3 838.5 880.6 838.5 880.6 835.2 908.1 835.2 908.1 838.5 916.7 838.5 916.7 808.2 1039.4 808.2"
                      />
                      <polygon
                        data-label="A173"
                        id="_x35_"
                        className="st0"
                        points="861.2 1075.5 860.4 838.5 811.3 838.5 811.3 835.8 783.4 835.8 783.4 838.2 692.4 838.2 692.4 1071.6 701.6 1071.6 701.6 1073.2 775 1073.4 774.8 1071.6 790.5 1071.6 790.5 1075.5 861.2 1075.5"
                      />
                      <polygon
                        data-label="A174"
                        id="_x36_"
                        className="st0"
                        points="685.6 838.2 685.6 1071.6 663.7 1071.6 663.7 1073.2 590.7 1073.6 590.7 1071.6 568 1071.6 568 838.2 581.9 838.2 581.9 835.8 609.4 835.8 609.4 838 685.6 838.2"
                      />
                      <path
                        data-label="A175"
                        id="_x37_"
                        className="st0"
                        d="M562.1,1071.6s.4-194.5,0-195-5.9,0-5.9,0v-38.2h-87.4v-2.7h-27v2.7h-52.7v37.3h-1.5v199.4h75.9v-3.6h15.6v1.9s73.1-.1,73.1-.1v-1.8h10Z"
                      />
                      <polygon
                        data-label="A176"
                        id="_x38_"
                        className="st0"
                        points="377.6 838.6 377.6 876.2 381.9 876.2 381.9 968.4 378.1 968.4 378.1 1071.2 356.2 1068.5 355.7 1070.9 314.1 1061 315 1059 276.5 1043.2 275.3 1045.2 238.6 1023.6 239.8 1021.6 217.9 1005.4 217.9 1008.5 206.4 999.4 188.7 981.2 169.6 957.6 156.9 937.9 160.4 937.8 145.1 907.8 143 908.6 128.1 868.8 130.8 867.9 124.5 840.3 332.7 838.6 332.8 835.5 359.4 835.5 359.3 838.5 377.6 838.6"
                      />
                      <polygon
                        data-label="A177"
                        id="_x39_"
                        className="st0"
                        points="324.3 772.2 324.3 678.7 327 678.7 327 651.4 324.3 651.4 324.3 605.1 125 605.1 125 602.7 106.3 602.7 106.3 605.1 63.6 605.1 63.6 674.5 68.3 674.5 68.2 698.8 65.4 698.9 65.3 753.5 68.1 753.6 68.1 772.2 324.3 772.2"
                      />
                      <polygon
                        data-label="A178"
                        id="_x31_0"
                        className="st0"
                        points="324.1 599.4 324.1 553.8 327 553.8 327 526.9 324.1 526.9 324.1 433.6 228.7 433.6 228.7 434.9 67.9 434.9 67.9 452.8 65.7 452.6 65.6 506.8 67.9 506.8 67.9 532.1 63.6 532 63.6 594.5 105.6 594.5 105.6 597.8 125.4 597.8 125.4 599.4 184.5 599.4 184.5 594.5 228.5 594.5 228.5 599.4 324.1 599.4"
                      />
                      <polygon
                        data-label="A179"
                        id="_x31_1"
                        className="st0"
                        points="324.7 428.5 324.7 332 327 332 327 304.2 324.7 304.2 324.7 258 63.4 258 63.4 328.7 68.1 328.7 68.2 353.1 65.6 353.3 65.6 407 68.3 407.1 68.3 423.6 106.5 423.6 106.5 429.6 185 429.6 185 424.2 229 424.2 229 428.2 324.7 428.5"
                      />
                      <polygon
                        data-label="A180"
                        id="_x31_2"
                        className="st0"
                        points="377.9 252.7 377.9 76 372 74.9 372.4 72.9 319.3 62.5 318.8 64.5 294.7 59.8 295.1 58 252.6 49.5 252 51.5 238.6 48.9 238.6 45 173.2 32.5 120.5 22.5 102.5 19.4 89.6 22 79.3 28.4 69.5 39.8 64.8 53.8 64.8 70.7 95.2 70.7 95.2 85.6 67.6 85.6 67.6 176.3 65.4 176.2 65.6 219.2 67.6 219.2 67.6 252.7 333 252.7 333 255.1 360.1 255.1 360.1 252.5 377.9 252.7"
                      />
                      <polygon
                        data-label="A181"
                        id="_x31_3"
                        className="st0"
                        points="383.7 305.7 561.8 305.7 561.8 302.1 563.9 302 563.9 261.8 561.8 261.9 561.8 191.4 563.9 191.4 563.9 137.8 560.5 137.8 560.5 111.8 541.9 108.1 542.1 106.4 489.4 95.9 488.8 97.7 461.7 92.3 462 90.6 419.7 82.2 419.3 84 389 78 389 118.2 383.7 118.2 383.7 218 389.2 218 389.2 261.6 381 261.6 381 288.5 383.6 288.5 383.7 305.7"
                      />
                      <polygon
                        data-label="A182"
                        id="_x31_4"
                        className="st0"
                        points="443.3 581.6 443.3 484.1 564.2 484.1 564.2 441.9 551 441.9 551 425.6 562.2 425.6 562.2 407.4 567.6 407.6 567.6 420.1 603.4 420.2 603.4 353.1 561.8 353.1 561.8 311.9 383.7 311.9 383.7 436.2 380.9 436.2 380.9 463.6 383.7 463.6 383.7 581.6 443.3 581.6"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              {tooltip && (
                <VisualTooltip
                  x={tooltip.x}
                  y={tooltip.y}
                  content={tooltip.content}
                />
              )}
            </div>

            {selectedApartment && (
              <div ref={refB} className={styles.modal_overlay}>
                <ApartmentModal
                  apartment={selectedApartment}
                  onClose={() => setSelectedApartment(null)}
                />
              </div>
            )}
          </section>
        </div>
        <div data-id="form">
          <Request />
        </div>
      </main>

      <Footer />
      {showHint && (
        <div
          className={styles.scroll_hint_overlay}
          onClick={() => setShowHint(false)}
        >
          <div className={styles.scroll_hint_text}>
            To move the plan, swipe with fingers
          </div>
        </div>
      )}
    </>
  );
};

export default FloorPlan;
