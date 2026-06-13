// 

import { Navigate } from "react-router-dom";
import { getAuthData } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const auth = getAuthData();

  const token = auth?.token;
  const userRole = auth?.user?.roleName;

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && role !== userRole) {
    if (userRole === "ROLE_ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }

    if (userRole === "ROLE_USER") {
      return <Navigate to="/student/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}