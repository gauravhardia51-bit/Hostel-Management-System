import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { ROUTES } from "../../routes/RoutesConstant";
import HostelSwitcher from "./HostelSwitcher";
import { getAuthData } from "../../utils/auth";
import { FormControl, Select, MenuItem } from "@mui/material";

const active = ({ isActive }) =>
  isActive ? "active" : "block p-2 rounded text-white";

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  // Logout handler (production-ready)
  const handleLogout = () => {
    // remove auth data
    localStorage.removeItem("token");

    // optional: clear other stored data
    // localStorage.clear();

    // redirect safely
    navigate("/login", { replace: true });
  };

  const { hostelId, hostels } = getAuthData();
  const [selectedHostel, setSelectedHostel] = useState("");

  useEffect(() => {
    if (hostelId) {
      setSelectedHostel(Number(hostelId));
    }
  }, [hostelId]);

  const handleChange = (event) => {
    const value = event.target.value;

    setSelectedHostel(value);

    // ✅ persist
    localStorage.setItem("hostelId", value);

    // reload or later replace with Zustand
    window.location.reload();
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? "w-20" : "w-64"}`}>
        <div>
          <Link to={ROUTES.HOME} className="no-underline">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white text-indigo-600 font-bold w-10 h-10 rounded-xl flex items-center justify-center">
                R
              </div>

              {!collapsed && <h1 className="text-2xl font-bold">RentRova</h1>}
            </div>
          </Link>

          {!collapsed && (
            <div className="hostel-info">
              <FormControl fullWidth size="small">
                <Select
                  value={selectedHostel || ""}
                  onChange={handleChange}
                  displayEmpty
                  variant="standard"
                  disableUnderline
                  renderValue={(selected) => {
                    const hostel = hostels.find((h) => h.id === selected);

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

                    // remove default padding & background
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
                  <MenuItem value="">
                    <em>Select Hostel</em>
                  </MenuItem>

                  {hostels.map((h) => (
                    <MenuItem key={h.id} value={h.id}>
                      {h.hostelName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          <ul className="sidebar-list">
            <li>
              <NavLink to="/" end className={active}>
                {collapsed ? "🏠" : "Dashboard"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/students" className={active}>
                {collapsed ? "👨‍🎓" : "Students"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/rooms" className={active}>
                {collapsed ? "🛏" : "Rooms"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/payments" className={active}>
                {collapsed ? "💳" : "Payments"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/reminders" className={active}>
                {collapsed ? "🔔" : "Reminders"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/complaints" className={active}>
                {collapsed ? "⚠" : "Complaints"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className={active}>
                {collapsed ? "📊" : "Reports"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={active}>
                {collapsed ? "⚙" : "Settings"}
              </NavLink>
            </li>
          </ul>
        </div>

        <button className="logout" onClick={handleLogout}>
          <LogoutIcon fontSize="small" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </>
  );
}
