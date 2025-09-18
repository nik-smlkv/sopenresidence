import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";
import { useLang } from "../../hooks/useLang";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const { t } = useLang();
  const breadcrumbMap: Record<string, string> = {
    apartments: "Apartments",
    details: "Details",
    "search-by-parameters": t.t_apart_view_filter,
    "visual-selectional-of-apartments": "Visual Selectional Of Apartments",
  };
  return (
    <nav className={`${styles.breadcrumbs} breadcrumbs_section`}>
      <ul className={styles.breadcrumbs_list}>
        <li>
          <Link to="/">{t.t_bread_main_txt}</Link>
        </li>
        /
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
