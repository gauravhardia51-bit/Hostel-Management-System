import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
