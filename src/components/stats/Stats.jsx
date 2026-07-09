import "./Stats.css";
import { useState, useEffect } from "react";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

// MUI
import { Card, CardContent } from "@mui/material";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RemoveIcon from "@mui/icons-material/Remove";
import WarningIcon from "@mui/icons-material/Warning";

export default function Stats() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // ================= FETCH DATA =================

  const fetchDashboardData = async () => {
    try {
      const auth = getAuthData();
      const hostelId = auth?.hostelId;

      if (!hostelId) return;

      const today = new Date();

      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      const fromMillis = new Date(
        firstDayOfMonth.setHours(0, 0, 0, 0),
      ).getTime();

      const toMillis = new Date(today.setHours(23, 59, 59, 999)).getTime();
      const [dashboardRes, paymentRes, complaintRes] = await Promise.all([
        api.get("/dashboard/data/all", {
          params: {
            hostelId,
            fromDate: fromMillis,
            toDate: toMillis,
          },
        }),

        api.get("/payment/all", {
          params: {
            hostelId,
          },
        }),

        api.get("/complaint/all", {
          params: {
            hostelId,
          },
        }),
      ]);

      setDashboardData(dashboardRes.data.payLoad);
      setPayments(paymentRes.data.payLoad?.slice(0, 3));

      setComplaints(complaintRes.data.payLoad?.slice(0, 3));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= STATS =================

  const hostelStats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents || 0,
      icon: <PeopleIcon fontSize="small" />,
      bg: "bg-purple-100",
      color: "text-purple-600",
      sub: `${Math.round(
        dashboardData?.increaseStudentPercentage || 0,
      )}% this month`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
    },

    {
      title: "Total Rooms",
      value: dashboardData?.totalRooms || 0,
      icon: <MeetingRoomIcon fontSize="small" />,
      bg: "bg-blue-100",
      color: "text-blue-600",
      sub: `${dashboardData?.totalRooms || 0} Rooms`,
      subIcon: <RemoveIcon className="text-gray-400 text-xs" />,
      subColor: "text-gray-400",
    },

    {
      title: "Occupied Rooms",
      value: dashboardData?.totalOccupied || 0,
      icon: <HomeWorkIcon fontSize="small" />,
      bg: "bg-green-100",
      color: "text-green-600",
      sub: `${Math.round(dashboardData?.occupiedPercentage || 0)}% Occupied`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
    },

    {
      title: "Monthly Income",
      value: `₹${(dashboardData?.totalIncome || 0).toLocaleString()}`,
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      sub: `${Math.round(
        dashboardData?.increaseIncomePercentage || 0,
      )}% this month`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
    },

    {
      title: "Pending Payments",
      value: dashboardData?.pendingPaymentStudentCount || 0,
      icon: <WarningIcon fontSize="small" />,
      bg: "bg-red-100",
      color: "text-red-600",
      sub: `₹${(dashboardData?.pendingAmount || 0).toLocaleString()}`,
      subColor: "text-red-500",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-5 gap-4 mb-6">
        {hostelStats.map((s, i) => (
          <Card key={i} className="rounded-xl shadow-sm">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-md ${s.color}`}>
                  {s.icon}
                </div>

                <div>
                  <p className="text-gray-500 text-xs">{s.title}</p>

                  <h3 className="text-base font-bold">{s.value}</h3>

                  <div className="flex items-center gap-1 text-[10px]">
                    {s.subIcon}

                    <span className={s.subColor}>{s.sub}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLES */}

      <div className="grid grid-cols-2 gap-6">
        {/* RECENT PAYMENTS */}

        <Card className="rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Payments</h3>

            <button
              className="text-indigo-600 text-sm"
              onClick={() => navigate("/payments")}
            >
              View All
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t h-12">
                  <td>{p.studentName}</td>

                  <td>₹{p.amount}</td>

                  <td>
                    {new Date(p.paidAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs

${
  p.status === "PAID"
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600"
}
`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* RECENT COMPLAINTS */}

        <Card className="rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Complaints</h3>

            <button
              className="text-indigo-600 text-sm"
              onClick={() => navigate("/complaints")}
            >
              View All
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Ticket</th>
                <th>Student</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-t h-12">
                  <td>{c.ticketNumber}</td>

                  <td>{c.studentName}</td>

                  <td>
                    <div
                      className="max-w-[180px] truncate cursor-pointer"
                      title={c.complaintMessage}
                    >
                      {c.complaintMessage}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs

${
  c.status === "CLOSED"
    ? "bg-green-100 text-green-600"
    : c.status === "IN_PROGRESS"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-600"
}
`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
