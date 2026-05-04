import "./TopBar.css";
import { Link } from "react-router-dom";
import NotificationDrawer from "../notifications/NotificationDrawer";

// Material UI imports
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="menu-icon">
        <IconButton size="small">
          <MenuIcon />
        </IconButton>
        <div>
          <h2 className="h2">Dashboard</h2>
          <p className="para">Welcome back, Amit Sharma 👋</p>
        </div>
      </div>

      <div className="date-bar">
        <div className="date">01 Apr 2024 - 30 Apr 2024</div>
        <NotificationDrawer />
        <div className="user-data">
          <Avatar
            src="https://i.pravatar.cc/40"
            sx={{ width: 32, height: 32 }}
          />
          <div>
            <p className="owner-name">Amit Sharma</p>
            <p className="user">Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
