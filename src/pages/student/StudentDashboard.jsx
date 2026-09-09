import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BoltIcon from "@mui/icons-material/Bolt";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { t, tDb, lang } = useApp();
  const [data, setData] = useState(null);
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const defaultRate = parseFloat(localStorage.getItem(`hostel_${hostelId}_unit_rate`)) || 10;

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/student/dashboard", {
        params: {
          userId: auth?.user?.id,
          token: auth?.token,
        },
      });

      if (response.data?.payLoad) {
        setData(response.data.payLoad);
        return;
      }
    } catch (error) {
      // Graceful demo fallback
      setData({
        studentName: auth?.user?.name || "Rahul Sharma",
        roomNumber: "R-204",
        sharingCount: 2,
        pendingAmount: 5300,
        rentAmount: 5000,
        electricityAmount: 300,
        electricityUnits: 30,
        meterReading: 1560,
        totalComplaints: 3,
        openComplaints: 1,
        closedComplaints: 2,
        inProgressComplaints: 0,
        unreadNotifications: 2,
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const studentData = data || {
    studentName: auth?.user?.name || "Rahul Sharma",
    roomNumber: "R-204",
    sharingCount: 2,
    pendingAmount: 5300,
    rentAmount: 5000,
    electricityAmount: 300,
    electricityUnits: 30,
    meterReading: 1560,
    totalComplaints: 3,
    openComplaints: 1,
    closedComplaints: 2,
    inProgressComplaints: 0,
    unreadNotifications: 2,
  };

  const cards = [
    {
      title: t("myRoom"),
      value: studentData.roomNumber,
      sub: `${studentData.sharingCount} ${lang === "hi" ? "छात्र शेयरिंग" : "Sharing Room"}`,
      icon: <MeetingRoomIcon fontSize="small" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      color: "text-purple-600 dark:text-purple-400",
      onClick: () => navigate("/student/rooms"),
    },
    {
      title: `⚡ ${t("electricityBill")}`,
      value: `₹${studentData.electricityAmount || 300}`,
      sub: `${studentData.electricityUnits || 30} ${t("unitsConsumed")} @ ₹${defaultRate}/u`,
      icon: <BoltIcon fontSize="small" />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      color: "text-amber-600 dark:text-amber-400",
      onClick: () => navigate("/student/rooms"),
    },
    {
      title: t("pendingDues"),
      value: `₹${(studentData.pendingAmount || 5300).toLocaleString()}`,
      sub: lang === "hi" ? "कमरा किराया + बिजली बिल" : "Rent + Electricity Bill",
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      bg: "bg-red-100 dark:bg-red-900/30",
      color: "text-red-600 dark:text-red-400",
      onClick: () => navigate("/student/payments"),
    },
    {
      title: t("complaints"),
      value: studentData.totalComplaints,
      sub: `${studentData.openComplaints} ${tDb("OPEN", lang)} • ${studentData.closedComplaints} ${tDb("CLOSED", lang)}`,
      icon: <ReportProblemIcon fontSize="small" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600 dark:text-green-400",
      onClick: () => navigate("/student/complaints"),
    },
    {
      title: t("notifications"),
      value: studentData.unreadNotifications,
      sub: lang === "hi" ? "नई सूचनाएं" : "Unread Updates",
      icon: <NotificationsIcon fontSize="small" />,
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      color: "text-yellow-600 dark:text-yellow-400",
      onClick: () => navigate("/student/notifications"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {lang === "hi" ? `नमस्ते, ${studentData.studentName} 👋` : `Welcome, ${studentData.studentName} 👋`}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {lang === "hi" ? `छात्र पोर्टल • कमरा ${studentData.roomNumber}` : `Student Portal • Room ${studentData.roomNumber}`}
          </p>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((item, index) => (
          <Card
            key={index}
            className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-slate-900 cursor-pointer hover:shadow-md transition-shadow"
            onClick={item.onClick}
          >
            <div className="p-4 flex items-center gap-3">
              <div className={`${item.bg} p-2.5 rounded-lg ${item.color} shrink-0`}>
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{item.title}</p>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{item.value}</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Details & Electricity Sub-Meter Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room & Utility Summary */}
        <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-slate-900 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
              {lang === "hi" ? "कमरा एवं बिजली मीटर विवरण" : "Room & Utility Status"}
            </h3>
            <button
              onClick={() => navigate("/student/rooms")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {lang === "hi" ? "सब-मीटर देखें →" : "View Room Sub-Meter →"}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">{t("room")}:</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{studentData.roomNumber} ({studentData.sharingCount} {lang === "hi" ? "शेयरिंग" : "Sharing"})</span>
            </div>

            <div className="flex justify-between p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-900 dark:text-amber-300">
              <span className="font-medium flex items-center gap-1">
                <BoltIcon sx={{ fontSize: 14 }} /> {lang === "hi" ? "वर्तमान मीटर रीडिंग:" : "Current Sub-Meter Reading:"}
              </span>
              <span className="font-bold text-amber-800 dark:text-amber-400">{studentData.meterReading || 1560} kWh</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">{t("ratePerUnit")}:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">₹{defaultRate} / kWh</span>
            </div>

            <div className="flex justify-between p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-indigo-900 dark:text-indigo-300">
              <span className="font-medium">{lang === "hi" ? "आपका बिजली बिल हिस्सा:" : "Your Monthly Electricity Share:"}</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400">₹{studentData.electricityAmount || 300} ({studentData.electricityUnits || 30} {lang === "hi" ? "यूनिट" : "units"})</span>
            </div>
          </div>
        </Card>

        {/* Complaints Summary */}
        <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-slate-900 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
              {lang === "hi" ? "शिकायत व सहायता स्थिति" : "Complaint & Service Requests"}
            </h3>
            <button
              onClick={() => navigate("/student/complaints")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {lang === "hi" ? "शिकायत दर्ज करें →" : "File Request →"}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">{lang === "hi" ? "कुल दर्ज शिकायतें:" : "Total Registered Requests:"}</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{studentData.totalComplaints}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
              <span>{tDb("OPEN", lang)}:</span>
              <span className="font-bold">{studentData.openComplaints}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg">
              <span>{tDb("IN_PROGRESS", lang)}:</span>
              <span className="font-bold">{studentData.inProgressComplaints}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
              <span>{tDb("CLOSED", lang)}:</span>
              <span className="font-bold">{studentData.closedComplaints}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}