import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Room from "../pages/Rooms";
import Payment from "../pages/Payments";
import Complaints from "../pages/Complaints";
import Reminders from "../pages/Reminders";
import NotificationDrawer from "../components/notifications/NotificationDrawers";
import Settings from "../pages/Settings";
import Reports from "../pages/reports";
import ProtectedRoute from "./ProtectedRoutes";
<<<<<<< Updated upstream
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
=======
import Login from "../feature/auth/Login";
>>>>>>> Stashed changes
import { ROUTES } from "./RoutesConstant";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.VerifyOtp} element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="rooms"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="notificationdrawers"
          element={
            <ProtectedRoute>
              <NotificationDrawer />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
