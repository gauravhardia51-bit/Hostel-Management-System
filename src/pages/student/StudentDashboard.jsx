// import React from "react";
// import StStats from "../../components/stats/StStats";
// import StDetails from "../../components/details/StDetails";

// export default function StudentDashboard() {
//   return (
//     <div>
//       <StStats />
//       <StDetails />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";

const COLORS = ["#22c55e", "#ef4444"];

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  const auth = getAuthData();
  const userId = auth?.user?.id;
  const token = auth?.token;
  const fetchDashboard = async () => {
    try {
      const response = await api.get("/student/dashboard", {
        params: {
          userId: userId,
          token: token,
        },
      });

      setData(response.data.payLoad);
    } catch (error) {
      console.log("Dashboard Error :", error);
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

  const pieData = [
    {
      name: "Paid",
      value: data.paymentOverview.paidPercentage,
    },
    {
      name: "Pending",
      value: data.paymentOverview.pendingPercentage,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-5">Student Dashboard</h2>

      {/* ================= TOP CARDS ================= */}

      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* ROOM */}

        <Card className="rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">My Room</p>

          <h2 className="text-2xl font-bold mt-1">{data.summary.roomNumber}</h2>

          <p className="text-xs text-gray-500 mt-1">
            {data.summary.sharingType}
          </p>
        </Card>

        {/* PENDING AMOUNT */}

        <Card className="rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Pending Amount</p>

          <h2 className="text-2xl font-bold text-red-500 mt-1">
            ₹{data.summary.pendingAmount.toLocaleString()}
          </h2>

          <p className="text-xs text-red-500 mt-1">
            Please pay before due date
          </p>
        </Card>

        {/* COMPLAINTS */}

        <Card className="rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Complaints</p>

          <h2 className="text-2xl font-bold mt-1">
            {data.summary.complaintCount}
          </h2>

          <p className="text-xs text-gray-500 mt-1">Active complaints</p>
        </Card>

        {/* NOTIFICATIONS */}

        <Card className="rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Notifications</p>

          <h2 className="text-2xl font-bold mt-1">
            {data.summary.notificationCount}
          </h2>

          <p className="text-xs text-gray-500 mt-1">Unread notifications</p>
        </Card>
      </div>

      {/* ================= MIDDLE SECTION ================= */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* PAYMENT OVERVIEW */}
        <Card className="p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Payment Overview</h3>

          <h2 className="text-2xl font-bold mb-4">
            ₹{data.paymentOverview.totalRent.toLocaleString()}
          </h2>

          <div className="flex justify-center">
            <PieChart width={260} height={220}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="flex justify-center gap-8 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Paid ({data.paymentOverview.paidPercentage}%)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Pending ({data.paymentOverview.pendingPercentage}%)</span>
            </div>
          </div>
        </Card>

        {/* ROOM DETAILS */}
        <Card className="p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Room Details</h3>

          <img
            src={data.roomDetails.image}
            alt="Room"
            className="rounded-lg h-44 w-full object-cover mb-4"
          />

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Room Number :</span>{" "}
              {data.roomDetails.roomNumber}
            </p>

            <p>
              <span className="font-semibold">Floor :</span>{" "}
              {data.roomDetails.floor}
            </p>

            <p>
              <span className="font-semibold">Sharing :</span>{" "}
              {data.roomDetails.sharingType}
            </p>

            <p>
              <span className="font-semibold">Joined On :</span>{" "}
              {new Date(data.roomDetails.joinedOn).toLocaleDateString("en-IN")}
            </p>
          </div>
        </Card>
      </div>

      {/* ================= TABLES ================= */}

      <div className="grid grid-cols-2 gap-6">
        {/* RECENT PAYMENTS */}

        <Card className="rounded-xl shadow-sm p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Payments</h3>

            <button className="text-indigo-600 text-sm">View All</button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Month</th>

                <th>Amount</th>

                <th>Due Date</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentPayments.map((payment, index) => (
                <tr key={index} className="border-b h-12">
                  <td>{payment.month}</td>

                  <td>₹{payment.amount}</td>

                  <td>
                    {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs

${
  payment.status === "PAID"
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600"
}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* RECENT COMPLAINTS */}

        <Card className="rounded-xl shadow-sm p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Complaints</h3>

            <button className="text-indigo-600 text-sm">View All</button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Ticket</th>

                <th>Issue</th>

                <th>Date</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentComplaints.map((complaint, index) => (
                <tr key={index} className="border-b h-12">
                  <td>{complaint.ticketNumber}</td>

                  <td className="max-w-[180px] truncate">{complaint.issue}</td>

                  <td>
                    {new Date(complaint.date).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs

${
  complaint.status === "CLOSED"
    ? "bg-green-100 text-green-600"
    : complaint.status === "IN_PROGRESS"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-600"
}`}
                    >
                      {complaint.status}
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
