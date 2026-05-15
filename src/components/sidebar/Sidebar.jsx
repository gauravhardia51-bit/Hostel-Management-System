import { NavLink } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/RoutesConstant";
import HostelSwitcher from "./HostelSwitcher";

const active = ({ isActive }) =>
  isActive ? "active" : "block p-2 rounded text-white";

export default function Sidebar({ collapsed }) {
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
              <p className="hostel-name">Galaxy Boys Hostel</p>

              <p className="hostel-status">● Active</p>
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

        <button className="logout">
          <LogoutIcon fontSize="small" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </>
  );
}
