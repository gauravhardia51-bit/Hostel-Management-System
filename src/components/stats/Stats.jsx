import "./Stats.css";
import { Link } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RemoveIcon from "@mui/icons-material/Remove";
import WarningIcon from "@mui/icons-material/Warning";
import { Card, CardContent, Avatar, IconButton } from "@mui/material";

const hostelStats = [
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

export default function Stats() {
  return (
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
  );
}
