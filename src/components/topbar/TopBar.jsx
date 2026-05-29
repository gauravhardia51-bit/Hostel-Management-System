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

export default function TopBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  // ===== USER =====
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");

        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        console.log("Invalid user data");
      }
    };

    loadUser();

    // listen for updates
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // ===== DEFAULT DATES =====
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);

  const [toDate, setToDate] = useState(today);

  // ===== POPOVER =====
  const [anchorEl, setAnchorEl] = useState(null);

  const openDatePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  useEffect(() => {
    const savedFromDate = localStorage.getItem("fromDate");
    const savedToDate = localStorage.getItem("toDate");

    if (savedFromDate) {
      setFromDate(new Date(Number(savedFromDate)));
    }

    if (savedToDate) {
      setToDate(new Date(Number(savedToDate)));
    }
  }, []);

  return (
    <div className="topbar">
      {/* LEFT */}
      <div className="menu-icon">
        <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* CENTER DATE ICON */}

      {/* RIGHT */}
      <div className="date-bar">
        {/* CENTER DATE */}
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
        <NotificationDrawer />

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

              <p className="user">Owner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
