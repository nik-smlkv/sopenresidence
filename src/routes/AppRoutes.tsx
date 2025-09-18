import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ApartmentsPage from "../pages/ApartmentsPage";
import MaintenancePage from "../pages/MaintenancePage";
import VisualApartments from "../components/VisualApartments/VisualApartments";
import FloorPlan from "../components/FloorPlan/FloorPlan";

const AppRoutes = () => {
  const isTechWork = false;
  return (
    <div className="wrapper">
      <Routes>
        <Route
          path="/"
          element={isTechWork ? <MaintenancePage /> : <HomePage />}
        />
        <Route path="/search-by-parameters" element={<ApartmentsPage />} />
        <Route
          path="/visual-selectional-of-apartments"
          element={<VisualApartments />}
        />
        <Route path="/" element={<VisualApartments />} />
        <Route path="/floor/:floorId" element={<FloorPlan />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
