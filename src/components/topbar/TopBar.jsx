import "./TopBar.css";
import React, { useState, useEffect } from "react";
import NotificationDrawer from "../notifications/NotificationDrawers";

// MUI
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";

// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAuthData } from "../../utils/auth";
import { useApp } from "../../context/AppContext";

export default function TopBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { themeMode, toggleTheme, lang, setLang, t } = useApp();

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
    const savedFromDate = localStorage.getItem("fromDate");
    const savedToDate = localStorage.getItem("toDate");

    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    if (savedFromDate && savedToDate) {
      const from = new Date(Number(savedFromDate));
      const to = new Date(Number(savedToDate));

      const sameMonth =
        from.getMonth() === today.getMonth() &&
        from.getFullYear() === today.getFullYear();

      if (sameMonth) {
        setFromDate(from);
        setToDate(to);
      } else {
        setFromDate(currentMonthStart);
        setToDate(today);
        localStorage.setItem("fromDate", currentMonthStart.getTime());
        localStorage.setItem("toDate", today.getTime());
        window.dispatchEvent(new Event("dateFilterUpdated"));
      }
    } else {
      setFromDate(currentMonthStart);
      setToDate(today);
      localStorage.setItem("fromDate", currentMonthStart.getTime());
      localStorage.setItem("toDate", today.getTime());
      window.dispatchEvent(new Event("dateFilterUpdated"));
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
      <div className="date-bar flex items-center gap-2">
        {/* Quick Language Toggle */}
        <Tooltip title={lang === "en" ? "Switch to हिंदी" : "Switch to English"}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            startIcon={<LanguageIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: "none",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "8px",
              borderColor: "#e2e8f0",
              color: themeMode === "dark" ? "#f1f5f9" : "#475569",
              minWidth: "unset",
            }}
          >
            {lang === "en" ? "हिंदी" : "EN"}
          </Button>
        </Tooltip>

        {/* Quick Theme Toggle (Dark / Light) */}
        <Tooltip title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton size="small" onClick={toggleTheme} sx={{ color: themeMode === "dark" ? "#f59e0b" : "#64748b" }}>
            {themeMode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Date Filter */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="date-filter">
            <IconButton onClick={openDatePopup} className="calendar-btn" size="small">
              <CalendarMonthIcon fontSize="small" />
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
                  size="small"
                  onClick={() => {
                    if (fromDate) {
                      localStorage.setItem("fromDate", fromDate.getTime());
                    }
                    if (toDate) {
                      localStorage.setItem("toDate", toDate.getTime());
                    }
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
              width: 34,
              height: 34,
              bgcolor: "#4f46e5",
              fontSize: "14px",
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>

          {!collapsed && (
            <div>
              <p className="owner-name text-xs font-semibold">{user?.name || "User"}</p>
              <p className="user text-[10px]">{roleLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
