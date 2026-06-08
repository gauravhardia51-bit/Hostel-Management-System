// import { Navigate } from "react-router-dom";
// import { isLoggedIn } from "../utils/auth";

// export default function ProtectedRoute({ children }) {
//   return isLoggedIn() ? children : <Navigate to="/login" />;
// }

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const auth = JSON.parse(localStorage.getItem("auth"));

  const token = auth.token;
  const userRole = auth.user?.role;

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Role mismatch
  if (role && role !== userRole) {
    if (userRole === "ROLE_ADMIN") {
      return <Navigate to="/dashboard" />;
    }

    if (userRole === "ROLE_USER") {
      return <Navigate to="/student/dashboard" />;
    }
  }

  // ✅ Allowed
  return children;
}

// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, role }) {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   // ❌ Not logged in
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // ❌ Role mismatch → block access (DON'T redirect smartly)
//   if (role && role !== userRole) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ Allowed
//   return children;
// }
