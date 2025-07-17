import React from "react";
import styles from "./Navigation.module.css";

type NavigationItem = {
  label: string;
  targetId: string;
};
type NavigationProps = {
  items: NavigationItem[];
};
const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const handleClick = (id: string) => {
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={styles.navigation}>
      {items.map(({ label, targetId }) => (
        <p
          key={targetId}
          className={styles.nav__link}
          onClick={() => handleClick(targetId)}
			 data-close
        >
          {label}
        </p>
      ))}
    </nav>
  );
};

export default Navigation;
