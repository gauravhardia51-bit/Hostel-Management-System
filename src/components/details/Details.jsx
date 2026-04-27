import { Card, CardContent, Avatar, IconButton } from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const pieData = [
  { name: "Paid", value: 41 },
  { name: "Pending", value: 27 },
];

const payments = [
  {
    name: "Rahul Kumar",
    amount: "₹5,000",
    date: "28 Apr 2024",
    status: "PAID",
  },
  {
    name: "Aman Verma",
    amount: "₹4,500",
    date: "28 Apr 2024",
    status: "PENDING",
  },
];

const complaints = [
  {
    ticket: "#CMP1009",
    name: "Rohit Sharma",
    issue: "Water Problem",
    status: "OPEN",
  },
  {
    ticket: "#CMP1008",
    name: "Aman Verma",
    issue: "WiFi Issue",
    status: "IN PROGRESS",
  },
];

export default function data() {
  return (
    <>
      {/* Tables */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Payments */}
        <Card className="p-4 rounded-xl">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent Payments</h3>
            <span className="text-blue-500 text-xs">View all</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 text-left">
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.amount}</td>
                  <td>{p.date}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-[10px] ${p.status === "PAID" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Complaints */}
        <Card className="p-4 rounded-xl">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent Complaints</h3>
            <span className="text-blue-500 text-xs">View all</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 text-left">
                <th>Ticket</th>
                <th>Student</th>
                <th>Issue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={i} className="border-t">
                  <td>{c.ticket}</td>
                  <td>{c.name}</td>
                  <td>{c.issue}</td>
                  <td className="text-blue-600 text-[10px]">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      {/* Pie Chart Bottom */}
      <Card className="p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-3">Payment Status</h3>
        <div className="flex justify-center">
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
        </div>
        <div className="flex justify-around text-xs mt-3">
          <span className="text-green-600">Paid (60%)</span>
          <span className="text-red-500">Pending (40%)</span>
        </div>
      </Card>
    </>
  );
}
