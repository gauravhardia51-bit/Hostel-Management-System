import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import NotificationsIcon from "@mui/icons-material/Notifications";

import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  const auth = getAuthData();

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/student/dashboard", {
        params: {
          userId: auth?.user?.id,
          token: auth?.token,
        },
      });

      setData(response.data.payLoad);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-96 text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "My Room",
      value: data.roomNumber,
      sub: `${data.sharingCount} Sharing`,
      icon: <MeetingRoomIcon fontSize="small" />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },

    {
      title: "Pending Amount",
      value: `₹${data.pendingAmount.toLocaleString()}`,
      sub:
        data.pendingAmount > 0
          ? "Payment Pending"
          : "No Pending Payment",
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      bg: "bg-red-100",
      color: "text-red-600",
    },

    {
      title: "Complaints",
      value: data.totalComplaints,
      sub: `${data.openComplaints} Open • ${data.closedComplaints} Closed`,
      icon: <ReportProblemIcon fontSize="small" />,
      bg: "bg-green-100",
      color: "text-green-600",
    },

    {
      title: "Notifications",
      value: data.unreadNotifications,
      sub: "Unread Notifications",
      icon: <NotificationsIcon fontSize="small" />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Welcome, {data.studentName}
        </h2>

        <p className="text-sm text-gray-500">
          Student Dashboard
        </p>
      </div>

      {/* Top Cards */}

      <div className="grid grid-cols-4 gap-5 mb-6">
        {cards.map((item, index) => (
          <Card key={index} className="rounded-xl shadow-sm">
            <div className="p-5 flex items-center gap-4">
              <div className={`${item.bg} p-3 rounded-lg ${item.color}`}>
                {item.icon}
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {item.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Details */}

      <div className="grid grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-lg mb-5">
            Room Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Student Name</span>

              <span className="font-medium">
                {data.studentName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Room Number</span>

              <span className="font-medium">
                {data.roomNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Sharing</span>

              <span className="font-medium">
                {data.sharingCount} Sharing
              </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-lg mb-5">
            Complaint Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Complaints</span>

              <span className="font-semibold">
                {data.totalComplaints}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Open</span>

              <span className="text-red-600 font-semibold">
                {data.openComplaints}
              </span>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>

              <span className="text-yellow-600 font-semibold">
                {data.inProgressComplaints}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Closed</span>

              <span className="text-green-600 font-semibold">
                {data.closedComplaints}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}