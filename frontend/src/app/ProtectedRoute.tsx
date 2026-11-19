import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  authService,
} from "../core/auth";

const ProtectedRoute = () => {
  const location = useLocation();

  const authenticated =
    authService.isAuthenticated();

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;