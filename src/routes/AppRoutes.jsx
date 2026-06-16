import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

// OWNER PAGES
import Dashboard from "../pages/owner/Dashboard";
import Students from "../pages/owner/Students";
import Room from "../pages/owner/Rooms";
import Payment from "../pages/owner/Payments";
import Complaints from "../pages/owner/Complaints";
import Reminders from "../pages/owner/Reminders";
import NotificationDrawer from "../components/notifications/NotificationDrawers";
import Settings from "../pages/owner/Settings";
import Reports from "../pages/owner/reports";
import Notifications from "../pages/owner/notifications";
// STUDENT PAGES (CREATE THESE)
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentPayments from "../pages/student/StudentPayments";
import StudentComplaints from "../pages/student/StudentComplaints";
import StudentRoom from "../pages/student/StudentRoom";
import StudentNotifications from "../pages/student/StudentNotifications";
import StudentProfile from "../pages/student/StudentProfile";
//import StudentSettings from "../pages/student/StudentSettings";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { getAuthData } from "../utils/auth";
import ProtectedRoute from "./ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* ================= COMMON LAYOUT ================= */}
      <Route path="/" element={<MainLayout />}>
        {/* DEFAULT REDIRECT BASED ON ROLE */}
        <Route
          index
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        {/* ================= OWNER ROUTES ================= */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="students"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="rooms"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="complaints"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="reminders"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="notificationdrawers"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <NotificationDrawer />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="notifications"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT ROUTES ================= */}
        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/payments"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/complaints"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/rooms"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/notifications"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/profile"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="student/settings"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentSettings />
            </ProtectedRoute>
          }
        /> */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
}

/* ================= ROLE REDIRECT ================= */
function RoleRedirect() {
  const auth = getAuthData();
  const role = auth?.user?.roleName;

  if (role === "ROLE_ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  if (role === "ROLE_USER") {
    return <Navigate to="/student/dashboard" />;
  }

  return <Navigate to="/login" />;
}
