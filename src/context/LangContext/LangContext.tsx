import React, { createContext, useState, type ReactNode } from "react";
import { langArr } from "./langArr.ts";

export type LangType = "en" | "srb" /* | "ru" */;

interface LangContextProps {
  lang: LangType;
  setLang: (lang: LangType) => void;
  t: (typeof langArr)["srb"];
}

export const LangContext = createContext<LangContextProps | undefined>(
  undefined
);

export const LangProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<LangType>(() => {
    const saved = localStorage.getItem("lang");
    return (saved as LangType) || "srb";
  });

  const setLang = (newLang: LangType) => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  };

  const value: LangContextProps = {
    lang,
    setLang,
    t: langArr[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};
