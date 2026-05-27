import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/Api";

import { Drawer, IconButton, Badge, Divider, Button } from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NotificationDrawer() {
  const navigate = useNavigate();

  const hostelId = localStorage.getItem("hostelId");

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  // ================= LOAD COUNT =================

  const loadUnreadCount = async () => {
    try {
      if (!hostelId) return;

      const res = await api.get("/get/notification/unread/count", {
        params: {
          hostelId,
        },
      });

      setUnreadCount(res.data.payLoad?.unreadCount || 0);
    } catch (error) {
      console.log("Count Error", error);
    }
  };

  // ================= LOAD ALL =================

  const loadNotifications = async () => {
    try {
      if (!hostelId) return;

      const res = await api.get("/get/notification/all/by/hostel-id", {
        params: {
          hostelId,
        },
      });

      setNotifications(res.data.payLoad || []);
    } catch (error) {
      console.log("Notification Error", error);
    }
  };

  // ================= AUTO REFRESH =================

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();

      if (open) {
        loadNotifications();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [open]);

  // ================= OPEN =================

  const handleOpen = async () => {
    setOpen(true);

    await loadNotifications();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ================= MARK READ =================

  const markAsRead = async (id) => {
    try {
      await api.put("/update/notification/read", {
        id,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                isRead: true,
              }
            : n,
        ),
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE SINGLE =================

  const deleteNotification = async (id, e) => {
    e.stopPropagation();

    try {
      await api.delete("/delete/notification", {
        params: {
          id,
        },
      });

      const deleted = notifications.find((n) => n.id === id);

      setNotifications((prev) => prev.filter((n) => n.id !== id));

      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CLEAR ALL =================

  const handleClearAll = async () => {
    try {
      const deletePromises = notifications.map((n) =>
        api.delete("/delete/notification", {
          params: {
            id: n.id,
          },
        }),
      );

      await Promise.all(deletePromises);

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.log("Clear all error:", error);
    }
  };

  // ================= HANDLE CLICK =================

  const handleClick = async (n) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }

    if (n.type === "PAYMENT") {
      navigate("/payments");
    }

    if (n.type === "COMPLAINT") {
      navigate("/complaints");
    }

    if (n.type === "STUDENT") {
      navigate("/students");
    }

    if (n.type === "SYSTEM") {
      navigate("/");
    }

    setOpen(false);
  };

  // ================= TIME FORMAT =================

  const getTimeAgo = (time) => {
    const diff = Date.now() - time;

    const mins = Math.floor(diff / (1000 * 60));

    if (mins < 1) return "Just now";

    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) return `${hrs} hr ago`;

    const days = Math.floor(hrs / 24);

    return `${days} day ago`;
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "w-[350px] sm:w-[400px]",
        }}
      >
        {/* HEADER */}

        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <div className="flex items-center gap-2">
            <Button size="small" color="error" onClick={handleClearAll}>
              Clear All
            </Button>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <Divider />

        {/* LIST */}

        <div className="p-3 space-y-2 overflow-y-auto h-full">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-5">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`
                  p-3
                  rounded-lg
                  cursor-pointer
                  border

                  ${n.isRead ? "bg-white" : "bg-blue-50"}

                  hover:bg-gray-100
                `}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {n.title}
                    </p>

                    <span className="text-xs text-gray-400">
                      {getTimeAgo(n.creationTime)}
                    </span>
                  </div>

                  <IconButton
                    size="small"
                    onClick={(e) => deleteNotification(n.id, e)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>

                <p className="text-xs text-gray-500 mt-2">{n.message}</p>

                {!n.isRead && (
                  <span className="text-[10px] text-blue-600 font-semibold">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Drawer>
    </>
  );
}
