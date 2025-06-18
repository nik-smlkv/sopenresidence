import React from "react";
import { useLang } from "../../hooks/useLang";
import styles from "./Header.module.css";
const Header = () => {
  const { t, setLang, lang } = useLang();

  const languages = [
    { code: "en", label: "EN" },
    { code: "srb", label: "SRB" },
  ] as const;

  return (
    <>
      <header className={styles.maintanceHeader}>
        <img className={styles.logo} src="/logo.svg" alt="logo" />
        <div className={styles.langSwitcher}>
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={lang === code ? styles.active : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
    </>
  );
};

export default Header;
