import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const breadcrumbMap: Record<string, string> = {
  apartments: "Apartments",
  details: "Details",
  "search-by-parameters": "Filter by features",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className={styles.breadcrumbs}>
      <ul className={styles.breadcrumbs_list}>
        <li>
          <Link to="/">Main</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          const label = breadcrumbMap[name] || decodeURIComponent(name);

          return (
            <li key={name}>
              {isLast ? (
                <span className={styles.breadcrumbs_current}>{label}</span>
              ) : (
                <Link to={routeTo}>{label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
