import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ApartmentsPage from "../pages/ApartmentsPage";
import MaintenancePage from "../pages/MaintenancePage";

const AppRoutes = () => {
  const isTechWork = true;
  return (
    <div className="wrapper">
      <Routes>
        <Route
          path="/"
          element={isTechWork ? <MaintenancePage /> : <HomePage />}
        />
        <Route path="/search-by-parameters" element={<ApartmentsPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
