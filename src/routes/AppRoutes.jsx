import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import Room from "../pages/rooms/Rooms";
import Payment from "../pages/payments/Payments";
import Complaints from "../pages/complaints/Complaints";
import Reminders from "../pages/reminders/Reminders";
import NotificationDrawer from "../components/notifications/NotificationDrawer";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="rooms" element={<Room />} />
        <Route path="payments" element={<Payment />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="notificationdrawer" element={<NotificationDrawer />} />
      </Route>
    </Routes>
  );
}
