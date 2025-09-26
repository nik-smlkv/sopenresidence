import styles from "./Footer.module.css";
import Contact from "../Contact/Contact";
import { useLang } from "../../hooks/useLang";
const handleClick = (id: string) => {
  const targetEl = document.getElementById(id);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const Footer = () => {
  const { t } = useLang();
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footer__body} >
        <div className={styles.footer__info_block}>
          <Contact />
          <a href="https://clck.ru/3NxQwf" target="_blank" className={styles.get__directions}>
            <span>{t.t_get_dir_btn}</span>
          </a>
        </div>
        <div className={styles.footer__content}>
          <div className={styles.footer__content_body}>
            <div className={styles.footer__text}>
              <span>(Niš, Serbia)</span>
						<h2 className={styles.footer_title}>{t.t_title}</h2>
            </div>
            <p className={styles.footer__roots}>{t.t_anot}</p>
            <div className={styles.arrow_up_body}>
              <svg
                className={styles.arrow__up}
                onClick={() => {
                  handleClick("main");
                }}
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="-0.416667"
                  y="-0.416667"
                  width="49.1667"
                  height="49.1667"
                  rx="24.5833"
                  transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 49.1667 49.1667)"
                  stroke="white"
                  stroke-width="0.833333"
                />
                <path
                  d="M25.0002 33.333L25.0002 17.2953M25.0002 17.2953L33.019 25.5571M25.0002 17.2953L16.9813 25.5571"
                  stroke="white"
                  stroke-width="0.833333"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
