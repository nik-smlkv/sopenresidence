import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./styles/style.css";
import { LangProvider } from "./context/LangContext/LangContext";
import React from "react";
import { ApartmentsProvider } from "./context/ApartmentsContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <LangProvider>
      <ApartmentsProvider>
        <AppRoutes />
      </ApartmentsProvider>
    </LangProvider>
  </BrowserRouter>
);
