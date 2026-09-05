import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Worksheet from "../pages/Worksheet/Worksheet";
import ReferenceDataPage from "../pages/ReferenceData/ReferenceDataPage";
import ProtectedRoute from "./ProtectedRoute";

const DashboardRoute = () => {
  const navigate = useNavigate();

  return (
    <Dashboard
      onNavigate={(screen, worksheetId, lab) => {
        if (screen === "worksheet") {
          const params = new URLSearchParams();

          if (worksheetId) {
            params.set("worksheetId", worksheetId);
          }

          if (lab) {
            params.set("lab", lab);
          }

          const queryString = params.toString();

          navigate(
            queryString
              ? `/worksheet?${queryString}`
              : "/worksheet"
          );

          return;
        }

        if (screen === "create") {
          navigate("/worksheet?mode=create");

          return;
        }

        if (screen === "reference-data") {
          navigate("/reference-data");

          return;
        }
      }}
    />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          LOGIN
          ===================================================== */}
      <Route
        path="/login"
        element={
          <Login
            onLoginSuccess={() => {
              window.location.assign("/dashboard");
            }}
          />
        }
      />

      {/* =====================================================
          PROTECTED APPLICATION
          ===================================================== */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardRoute />}
        />

        {/* Worksheet */}
        <Route
          path="/worksheet"
          element={<Worksheet />}
        />

        {/* Reference Data Management */}
        <Route
          path="/reference-data"
          element={<ReferenceDataPage />}
        />
      </Route>

      {/* =====================================================
          DEFAULT
          ===================================================== */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          UNKNOWN ROUTES
          ===================================================== */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;