import { useContext } from "react";
import { LangContext } from "../context/LangContext/LangContext";
export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
};
