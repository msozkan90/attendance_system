import React from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isAdmin, adminOnly, children }) => {
  const params = useParams();
  const location = useLocation();

  if (
    ((!isAdmin && location.pathname == "/admin") ||
      location.pathname == "/admin/leave-requests",
    location.pathname == "/notifications")
  ) {
    return <Navigate to="/dashboard" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
