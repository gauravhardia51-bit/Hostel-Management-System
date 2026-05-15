import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <TopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="flex-1 overflow-y-auto p-5 bg-gray-100">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
