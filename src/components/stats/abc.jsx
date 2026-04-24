import React from "react";
import { Card, CardContent, Avatar, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WarningIcon from "@mui/icons-material/Warning";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RemoveIcon from "@mui/icons-material/Remove";
import { PieChart, Pie, Cell } from "recharts";

const stats = [
  {
    title: "Total Students",
    value: 68,
    icon: <PeopleIcon fontSize="small" />,
    bg: "bg-purple-100",
    color: "text-purple-600",
    sub: "4 this month",
    subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
    subColor: "text-green-500",
  },
  {
    title: "Total Rooms",
    value: 24,
    icon: <MeetingRoomIcon fontSize="small" />,
    bg: "bg-blue-100",
    color: "text-blue-600",
    sub: "No change",
    subIcon: <RemoveIcon className="text-gray-400 text-xs" />,
    subColor: "text-gray-400",
  },
  {
    title: "Occupied Rooms",
    value: 18,
    icon: <HomeWorkIcon fontSize="small" />,
    bg: "bg-green-100",
    color: "text-green-600",
    sub: "75% Occupied",
    subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
    subColor: "text-green-500",
  },
  {
    title: "Monthly Income",
    value: "₹2,45,800",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    sub: "12% this month",
    subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
    subColor: "text-green-500",
  },
  {
    title: "Pending Payments",
    value: 27,
    icon: <WarningIcon fontSize="small" />,
    bg: "bg-red-100",
    color: "text-red-600",
    sub: "₹64,500",
    subColor: "text-red-500",
  },
];

const pieData = [
  { name: "Paid", value: 41 },
  { name: "Pending", value: 27 },
];

const COLORS = ["#22c55e", "#ef4444"];

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

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#1e293b] to-[#4f46e5] text-white p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">Rentrova</h1>

          <div className="bg-[#312e81] p-3 rounded-lg mb-6">
            <p className="text-sm">Galaxy Boys Hostel</p>
            <p className="text-green-400 text-xs">● Active</p>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="bg-white text-black p-2 rounded">Dashboard</li>
            <li>Students</li>
            <li>Rooms</li>
            <li>Payments</li>
            <li>Reminders</li>
            <li>Complaints</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </div>

        <button className="flex items-center gap-2 text-red-400 text-sm">
          <LogoutIcon fontSize="small" /> Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <IconButton size="small">
              <MenuIcon />
            </IconButton>
            <div>
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-gray-500 text-xs">
                Welcome back, Amit Sharma 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-1 rounded-md shadow text-xs">
              01 Apr 2024 - 30 Apr 2024
            </div>
            <IconButton size="small">
              <NotificationsIcon />
            </IconButton>
            <div className="flex items-center gap-2">
              <Avatar
                src="https://i.pravatar.cc/40"
                sx={{ width: 32, height: 32 }}
              />
              <div>
                <p className="text-xs font-semibold">Amit Sharma</p>
                <p className="text-[10px] text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((s, i) => (
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
      </div>
    </div>
  );
}
