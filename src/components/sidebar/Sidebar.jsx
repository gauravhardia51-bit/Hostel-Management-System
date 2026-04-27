import { NavLink } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { Link } from "react-router-dom";

const active = ({ isActive }) =>
  isActive ? "active" : "block p-2 rounded text-white";

export default function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div>
          <h1 className="h1">Rentrova</h1>

          <div className="hostel-info">
            <p className="hostel-name">Galaxy Boys Hostel</p>
            <p className="hostel-status">● Active</p>
          </div>

          <ul className="sidebar-list">
            <li>
              <NavLink to="/" end className={active}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/students" className={active}>
                Students
              </NavLink>
            </li>
            <li>
              <NavLink to="/rooms" className={active}>
                Rooms
              </NavLink>
            </li>
            <li>
              <NavLink to="/payments" className={active}>
                Payments
              </NavLink>
            </li>
            <li>
              <NavLink to="/reminders" className={active}>
                Reminders
              </NavLink>
            </li>
            <li>
              <NavLink to="/complaints" className={active}>
                Complaints
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className={active}>
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={active}>
                Settings
              </NavLink>
            </li>
          </ul>
        </div>

        <button className="logout">
          <LogoutIcon fontSize="small" /> Logout
        </button>
      </div>
    </>
  );
}
