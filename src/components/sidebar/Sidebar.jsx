import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { ROUTES } from "../../routes/RoutesConstant";
import { getHostelsData } from "../../utils/auth";
import { getAuthData } from "../../utils/auth";
import { FormControl, Select, MenuItem } from "@mui/material";

const active = ({ isActive }) =>
  isActive ? "active" : "block p-2 rounded text-white";

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  // ✅ Get auth (role)
  const auth = getAuthData();
  //console.log("Auth Data in Sidebar:", auth); // Debugging line
  const role = auth?.user?.roleName;

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  // ✅ Hostel Data
  const [hostelData, setHostelData] = useState(getHostelsData());

  useEffect(() => {
    const loadHostels = () => {
      setHostelData(getHostelsData());
    };

    window.addEventListener("hostelUpdated", loadHostels);
    return () => {
      window.removeEventListener("hostelUpdated", loadHostels);
    };
  }, []);

  const { hostelId, hostels } = hostelData;
  const [selectedHostel, setSelectedHostel] = useState("");

  useEffect(() => {
    if (hostelId) {
      setSelectedHostel(Number(hostelId));
    }
  }, [hostelId]);

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setSelectedHostel(value);

    // ✅ Update auth instead of separate key
    const updatedAuth = {
      ...auth,
      hostelId: Number(value),
    };

    localStorage.setItem("auth", JSON.stringify(updatedAuth));

    window.location.reload();
  };

  // =========================
  // ✅ ROLE BASED MENU
  // =========================

  const adminMenu = [
    //{ path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "students", label: "Students", icon: "👨‍🎓" },
    { path: "rooms", label: "Rooms", icon: "🛏" },
    { path: "payments", label: "Payments", icon: "💳" },
    { path: "reminders", label: "Reminders", icon: "🔔" },
    { path: "complaints", label: "Complaints", icon: "⚠" },
    { path: "RoomInspectionList", label: "Room Inspections", icon: "📝" },
    { path: "reports", label: "Reports", icon: "📊" },
    { path: "notifications", label: "Notifications", icon: "📢" },
    { path: "settings", label: "Settings", icon: "⚙" },
  ];

  const studentMenu = [
    //{ path: "/student/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "student/rooms", label: "My Room", icon: "🛏" },
    { path: "student/payments", label: "Payments", icon: "💳" },
    { path: "student/complaints", label: "Complaints", icon: "⚠" },
    { path: "student/room-inspection", label: "Room Inspection", icon: "📝" },
    { path: "student/notifications", label: "Notifications", icon: "🔔" },
    { path: "student/profile", label: "Profile", icon: "👤" },
    { path: "student/settings", label: "Settings", icon: "⚙" },
  ];

  const menu = role === "ROLE_USER" ? studentMenu : adminMenu;

  return (
    <div className={`sidebar ${collapsed ? "w-20" : "w-64"}`}>
      <div>
        {/* Logo */}
        <Link to={ROUTES.HOME} className="no-underline">
          <div className="mb-6 flex justify-center items-center">
            {collapsed ? (
              <div className="bg-white text-indigo-600 font-bold w-10 h-10 rounded-xl flex items-center justify-center">
                R
              </div>
            ) : (
              <div className="w-full text-center">
                <h1 className="text-2xl font-bold text-white">RentRova</h1>
              </div>
            )}
          </div>
        </Link>

        {/* Hostel Switcher (Only ADMIN) */}
        {!collapsed && role !== "ROLE_USER" && (
          <div className="hostel-info">
            <FormControl fullWidth size="small">
              <Select
                value={Number(selectedHostel) || ""}
                onChange={handleChange}
                displayEmpty
                variant="standard"
                disableUnderline
                renderValue={(selected) => {
                  const hostel = hostels.find(
                    (h) => Number(h.id) === Number(selected),
                  );

                  return (
                    <div className="flex flex-col">
                      <span className="hostel-name">
                        {hostel?.hostelName || "Select Hostel"}
                      </span>
                      <span className="hostel-status">● Active</span>
                    </div>
                  );
                }}
                sx={{
                  width: "100%",
                  color: "white",
                  "& .MuiSelect-select": {
                    padding: "0px !important",
                    background: "transparent !important",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                {hostels.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.hostelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Menu */}
        <ul className="sidebar-list">
          {menu.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className={active}>
                {collapsed ? item.icon : item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <button className="logout" onClick={handleLogout}>
        <LogoutIcon fontSize="small" />
        {!collapsed && "Logout"}
      </button>
    </div>
  );
}
