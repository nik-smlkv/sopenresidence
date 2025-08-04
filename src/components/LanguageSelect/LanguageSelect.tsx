import { useEffect, useRef, useState } from "react";
import styles from "./LanguageSelect.module.css";
import { useLang } from "../../hooks/useLang";
import type { LangType } from "../../context/LangContext/LangContext";

const languages = [
  { code: "en", label: "EN" },
  { code: "srb", label: "SRB" },
  { code: "ru", label: "RUS" },
] as const;

export const LanguageSelect = () => {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (code: LangType) => {
    setLang(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const currentLabel =
    languages.find((l) => l.code === lang)?.label || "Select";

  return (
    <div
      className={`${styles.langSwitcher} lang_switcher ${
        isOpen ? "active" : ""
      }`}
      ref={wrapperRef}
    >
      <div className={styles.selectWrapper}>
        <div className={styles.selected} onClick={toggleDropdown}>
          {currentLabel}
          <span className={styles.arrow}>
            <svg
              width="6"
              height="4"
              viewBox="0 0 6 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L3 3L5 1" stroke="white" />
            </svg>
          </span>
        </div>
        <ul className={styles.options}>
          {languages
            .filter(({ code }) => code !== lang)
            .map(({ code, label }) => (
              <li
                key={code}
                className={`${styles.option} ${
                  lang === code ? styles.active : ""
                }`}
                onClick={() => handleSelect(code)}
              >
                {label}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
