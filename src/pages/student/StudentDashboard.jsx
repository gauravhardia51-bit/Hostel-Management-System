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

const COLORS = ["#22c55e", "#ef4444"];

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ DUMMY DATA
    setData({
      room: "R-204",
      sharing: "Triple Sharing",
      pendingAmount: 4500,
      complaints: 2,
      notifications: 3,
      totalRent: 5000,
      paidPercent: 60,
      pendingPercent: 40,

      payments: [
        {
          month: "April 2024",
          amount: 5000,
          due: "05 Apr 2024",
          status: "PAID",
        },
        {
          month: "May 2024",
          amount: 5000,
          due: "05 May 2024",
          status: "PENDING",
        },
        {
          month: "June 2024",
          amount: 5000,
          due: "05 Jun 2024",
          status: "PENDING",
        },
      ],

      complaintsList: [
        {
          ticket: "#CMP1012",
          issue: "WiFi not working",
          status: "OPEN",
          date: "28 Apr 2024",
        },
        {
          ticket: "#CMP1011",
          issue: "Water leakage",
          status: "IN_PROGRESS",
          date: "25 Apr 2024",
        },
        {
          ticket: "#CMP1010",
          issue: "Fan not working",
          status: "CLOSED",
          date: "20 Apr 2024",
        },
      ],
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  const pieData = [
    { name: "Paid", value: data.paidPercent },
    { name: "Pending", value: data.pendingPercent },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

      {/* ===== TOP CARDS ===== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 rounded-xl">
          <p className="text-gray-500 text-sm">My Room</p>
          <h2 className="text-xl font-bold">{data.room}</h2>
          <p className="text-xs text-gray-500">{data.sharing}</p>
        </Card>

        <Card className="p-4 rounded-xl">
          <p className="text-gray-500 text-sm">Pending Amount</p>
          <h2 className="text-xl font-bold text-red-500">
            ₹ {data.pendingAmount}
          </h2>
        </Card>

        <Card className="p-4 rounded-xl">
          <p className="text-gray-500 text-sm">Complaints</p>
          <h2 className="text-xl font-bold">{data.complaints}</h2>
        </Card>

        <Card className="p-4 rounded-xl">
          <p className="text-gray-500 text-sm">Notifications</p>
          <h2 className="text-xl font-bold">{data.notifications}</h2>
        </Card>
      </div>

      {/* ===== MIDDLE ===== */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* PAYMENT OVERVIEW */}
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Payment Overview</h3>

          <p className="text-lg font-bold">₹ {data.totalRent}</p>

          <PieChart width={250} height={200}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </Card>

        {/* ROOM DETAILS */}
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Room Details</h3>

          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            className="rounded mb-3 h-32 w-full object-cover"
          />

          <p>Room: {data.room}</p>
          <p>Sharing: {data.sharing}</p>
        </Card>
      </div>

      {/* ===== TABLES ===== */}
      <div className="grid grid-cols-2 gap-6">
        {/* PAYMENTS */}
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Recent Payments</h3>

          <table className="w-full text-sm">
            <tbody>
              {data.payments.map((p, i) => (
                <tr key={i} className="border-b">
                  <td>{p.month}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* COMPLAINTS */}
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Recent Complaints</h3>

          <table className="w-full text-sm">
            <tbody>
              {data.complaintsList.map((c, i) => (
                <tr key={i} className="border-b">
                  <td>{c.ticket}</td>
                  <td>{c.issue}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
