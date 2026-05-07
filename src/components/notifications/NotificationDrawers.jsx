import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { Drawer, IconButton, Badge, Divider } from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";

const notificationsData = [
  {
    id: 1,
    title: "Payment Pending",
    message: "5 students have pending payments",
    type: "PAYMENT",
    isRead: false,
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Complaint Raised",
    message: "Water issue in Room 101",
    type: "COMPLAINT",
    isRead: false,
    time: "10 min ago",
  },
  {
    id: 3,
    title: "New Student Added",
    message: "Rahul joined Room 102",
    type: "STUDENT",
    isRead: true,
    time: "1 hour ago",
  },
];

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleClick = (n) => {
    markAsRead(n.id);

    // 👉 Navigation logic (React Router)
    if (n.type === "PAYMENT") window.location.href = "/payments";
    if (n.type === "COMPLAINT") window.location.href = "/complaints";
    if (n.type === "STUDENT") window.location.href = "/students";
  };

  return (
    <>
      {/* 🔔 Bell Icon */}
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* 📱 Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "w-[350px] sm:w-[400px]",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Divider />

        {/* Notification List */}
        <div className="p-3 space-y-2 overflow-y-auto h-full">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`p-3 rounded-lg cursor-pointer border transition
                ${n.isRead ? "bg-white" : "bg-blue-50"}
                hover:bg-gray-100`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-semibold">{n.title}</p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>

              <p className="text-xs text-gray-500 mt-1">{n.message}</p>

              {!n.isRead && (
                <span className="text-[10px] text-blue-600 font-semibold">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
