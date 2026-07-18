import "./TopBar.css";
import { useState, useEffect } from "react";
import NotificationDrawer from "../notifications/NotificationDrawers";

// MUI
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAuthData } from "../../utils/auth";

import { setDateFilter, getDateFilter } from "../../utils/auth";

export default function TopBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  // ===== USER =====
  const [user, setUser] = useState(null);
  const auth = getAuthData();

  const roleLabel =
    auth?.user?.roleName === "ROLE_ADMIN"
      ? "Owner"
      : auth?.user?.roleName === "ROLE_USER"
        ? "Student"
        : "User";

  useEffect(() => {
    const loadUser = () => {
      const currentAuth = getAuthData();
      setUser(currentAuth?.user || null);
    };
    loadUser();
    window.addEventListener("userUpdated", loadUser);
    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // ===== DATE =====

  const today = new Date();

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    const { fromDate: savedFromDate, toDate: savedToDate } = getDateFilter();

    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    if (savedFromDate && savedToDate) {
      const sameMonth =
        savedFromDate.getMonth() === today.getMonth() &&
        savedFromDate.getFullYear() === today.getFullYear();

      if (sameMonth) {
        setFromDate(savedFromDate);
        setToDate(savedToDate);
      } else {
        setFromDate(currentMonthStart);
        setToDate(today);

        setDateFilter(currentMonthStart, today);
      }
    } else {
      setFromDate(currentMonthStart);
      setToDate(today);

      setDateFilter(currentMonthStart, today);
    }
  }, []);

  // ===== DATE POPOVER =====

  const [anchorEl, setAnchorEl] = useState(null);

  const openDatePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="topbar">
      {/* LEFT */}
      <div className="menu-icon">
        <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* RIGHT */}
      <div className="date-bar">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="date-filter">
            <IconButton onClick={openDatePopup} className="calendar-btn">
              <CalendarMonthIcon />
            </IconButton>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={closeDatePopup}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <div className="date-popup">
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  format="dd/MM/yyyy"
                  onChange={(value) => setFromDate(value)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />

                <DatePicker
                  label="To Date"
                  value={toDate}
                  format="dd/MM/yyyy"
                  onChange={(value) => setToDate(value)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={() => {
                    if (fromDate) {
                      localStorage.setItem("fromDate", fromDate.getTime());
                    }

                    if (toDate) {
                      localStorage.setItem("toDate", toDate.getTime());
                    }

                    console.log("FROM:", localStorage.getItem("fromDate"));

                    console.log("TO:", localStorage.getItem("toDate"));

                    window.dispatchEvent(new Event("dateFilterUpdated"));

                    closeDatePopup();
                  }}
                >
                  Apply
                </Button>
              </div>
            </Popover>
          </div>
        </LocalizationProvider>

        {/* Notifications */}
        <NotificationDrawer />

        {/* User */}
        <div
          className="user-data cursor-pointer"
          onClick={() => navigate("/settings")}
        >
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
              <p className="owner-name">{user?.name || "User"}</p>

              <p className="user">{roleLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
