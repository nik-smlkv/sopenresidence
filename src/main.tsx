import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./styles/style.css";
import { LangProvider } from "./context/LangContext/LangContext";


createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider>
        <AppRoutes />
      </LangProvider>
    </BrowserRouter>
);
