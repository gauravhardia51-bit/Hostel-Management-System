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
  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    console.log("Invalid user data");
  }

  // ===== DEFAULT DATES =====

  const today = new Date();

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const [fromDate, setFromDate] =
    useState(firstDayOfMonth);

  const [toDate, setToDate] =
    useState(today);

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

          <p className="para">
            Welcome back,
            {user?.name || "User"} 👋
          </p>

        </div>

      </div>

      {/* CENTER DATE */}
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
      >

        <div className="flex items-center gap-3">

          <DatePicker
            label="From Date"
            value={fromDate}
            format="dd/MM/yyyy"
            onChange={(value) =>
              setFromDate(value)
            }
            slotProps={{
              textField: {
                size: "small"
              }
            }}
          />

          <span>→</span>

          <DatePicker
            label="To Date"
            value={toDate}
            format="dd/MM/yyyy"
            onChange={(value) =>
              setToDate(value)
            }
            slotProps={{
              textField: {
                size: "small"
              }
            }}
          />

        </div>

      </LocalizationProvider>

      {/* RIGHT */}
      <div className="date-bar">

        <NotificationDrawer />

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