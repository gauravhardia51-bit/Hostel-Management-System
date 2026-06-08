import { useEffect, useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import api from "../../api/Api";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function StDetails() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/student/dashboard");
      setData(res.data.payLoad);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="p-5">Loading...</p>;

  const pieData = [
    {
      name: "Paid",
      value: data.paymentOverview.paid,
    },
    {
      name: "Pending",
      value: data.paymentOverview.pending,
    },
  ];

  const paidPercent =
    data.paymentOverview.total > 0
      ? Math.round(
          (data.paymentOverview.paid / data.paymentOverview.total) * 100,
        )
      : 0;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* PAYMENT OVERVIEW */}
      <Card className="rounded-xl">
        <CardContent>
          <div className="flex justify-between">
            <h3 className="text-sm font-semibold">Payment Overview</h3>
            <span className="text-xs text-gray-400">This Month</span>
          </div>

          <h2 className="text-lg font-bold mt-2">
            ₹ {data.paymentOverview.total}
          </h2>

          <div className="flex justify-center mt-4">
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
              <Tooltip />
            </PieChart>
          </div>

          <div className="text-center text-sm">{paidPercent}% Paid</div>
        </CardContent>
      </Card>

      {/* ROOM DETAILS */}
      <Card className="rounded-xl">
        <CardContent>
          <h3 className="text-sm font-semibold mb-3">Room Details</h3>

          <p>Room: {data.room.roomNumber}</p>
          <p>Floor: {data.room.floor}</p>
          <p>Sharing: {data.room.sharingType}</p>
          <p>Joined: {data.room.joinDate}</p>

          <Button variant="outlined" className="mt-3">
            View Room Details
          </Button>
        </CardContent>
      </Card>

      {/* RECENT PAYMENTS */}
      <Card className="rounded-xl">
        <CardContent>
          <h3 className="text-sm font-semibold mb-3">Recent Payments</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left">
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.month}</td>
                  <td>₹{p.amount}</td>
                  <td
                    className={
                      p.status === "PAID" ? "text-green-600" : "text-red-500"
                    }
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* RECENT COMPLAINTS */}
      <Card className="rounded-xl">
        <CardContent>
          <h3 className="text-sm font-semibold mb-3">Recent Complaints</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left">
                <th>Ticket</th>
                <th>Issue</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentComplaints.map((c, i) => (
                <tr key={i}>
                  <td>{c.ticketNo}</td>
                  <td>{c.issue}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
