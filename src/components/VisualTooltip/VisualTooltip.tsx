import React from "react";
import styles from "./VisualTooltip.module.css";

interface VisualTooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
}

const VisualTooltip: React.FC<VisualTooltipProps> = ({ x, y, content }) => {
  return (
    <div
      className={`tooltip ${styles.tooltipVisible}`}
      style={{
        position: "fixed",
        top: y,
        left: x,
        pointerEvents: "none",
        transform: "translate(70px, 12px)",
      }}
    >
      {content}
    </div>
  );
};

export default VisualTooltip;
