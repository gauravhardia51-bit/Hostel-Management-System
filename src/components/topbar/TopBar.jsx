import "./TopBar.css";
import { useState } from "react";
import NotificationDrawer from "../notifications/NotificationDrawers";

// MUI
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function TopBar({
  collapsed,
  setCollapsed,
}) {

  // ===== USER =====
const storedUser = localStorage.getItem("user");

let user = null;

try {
  user = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch (error) {
  console.log("Invalid user data");
}
console.log(user);
  // ===== DATE =====
  const [fromDate, setFromDate] = useState(
    new Date()
  );

  const [toDate, setToDate] = useState(
    new Date()
  );

  return (
    <div className="topbar">

      {/* LEFT */}
      <div className="menu-icon">

        <IconButton
          size="small"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >
          <MenuIcon />
        </IconButton>

        <div>
          <h2 className="h2">
            Dashboard
          </h2>

          <p className="para">
            Welcome back,
            {user?.name || "User"} 👋
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="date-bar">

        {/* DATE PICKERS */}
        <div className="date-picker">

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
          >

            <div className="flex items-center gap-2">

              <DatePicker
                label="From"
                value={fromDate}
                format="dd/MM/yyyy"
                onChange={(newValue) =>
                  setFromDate(newValue)
                }
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />

              <DatePicker
                label="To"
                value={toDate}
                format="dd/MM/yyyy"
                onChange={(newValue) =>
                  setToDate(newValue)
                }
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />

            </div>

          </LocalizationProvider>

        </div>

        {/* NOTIFICATION */}
        <NotificationDrawer />

        {/* USER */}
        <div className="user-data">

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#4f46e5",
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>

          {!collapsed && (
            <div>
              <p className="owner-name">
                {user?.name || "User"}
              </p>

              <p className="user">
                Owner
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}