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
      className={`${styles.tooltip} ${styles.tooltipVisible}`}
      style={{ top: y, left: x }}
    >
      {content}
    </div>
  );
};

export default VisualTooltip;
