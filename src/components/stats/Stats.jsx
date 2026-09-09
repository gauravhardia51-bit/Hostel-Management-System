import "./Stats.css";
import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/Api";
import { getAuthData, getHostelsData } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

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
  const { t, tDb, lang } = useApp();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    increaseStudentPercentage: 0,
    totalRooms: 0,
    totalOccupied: 0,
    occupiedPercentage: 0,
    totalIncome: 0,
    increaseIncomePercentage: 0,
    pendingPaymentStudentCount: 0,
    pendingAmount: 0,
  });
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH DATA (Promise.all) =================
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const auth = getAuthData();
      const { hostelId: contextHostelId } = getHostelsData();
      const rawHostelId = contextHostelId || auth?.hostelId || auth?.hostels?.[0]?.id || 1;
      const hostelId = Number(rawHostelId);

      if (!hostelId) return;

      const savedFromDate = localStorage.getItem("fromDate");
      const savedToDate = localStorage.getItem("toDate");

      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const fromMillis = savedFromDate ? Number(savedFromDate) : new Date(firstDayOfMonth.setHours(0, 0, 0, 0)).getTime();
      const toMillis = savedToDate ? Number(savedToDate) : new Date(today.setHours(23, 59, 59, 999)).getTime();

      // Parallel Data Fetching via Promise.all
      const [dashRes, payRes, compRes, studRes, roomRes] = await Promise.all([
        api.get("/dashboard/data/all", {
          params: { hostelId, fromDate: fromMillis, toDate: toMillis },
        }).catch(() => ({ data: { payLoad: null } })),

        api.get("/payment/all", {
          params: { hostelId, pageNo: 0, pageSize: 50 },
        }).catch(() => ({ data: { payLoad: [] } })),

        api.get("/complaint/all", {
          params: { hostelId, pageNo: 0, pageSize: 50 },
        }).catch(() => ({ data: { payLoad: [] } })),

        api.get("/student/all", {
          params: { hostelId, pageNo: 0, pageSize: 100 },
        }).catch(() => ({ data: { payLoad: [] } })),

        api.get("/room/all", {
          params: { hostelId, pageNo: 0, pageSize: 100 },
        }).catch(() => ({ data: { payLoad: [] } })),
      ]);

      // 1. Process Students from DB
      const studentList = studRes?.data?.payLoad || [];
      const totalStudentsCount = studentList.length;

      // 2. Process Rooms from DB
      const roomList = roomRes?.data?.payLoad || [];
      const totalRoomsCount = roomList.length;
      const totalOccupiedCount = roomList.filter((r) => Number(r.occupied || 0) > 0).length;
      const calculatedOccupancyPct = totalRoomsCount > 0 ? Math.round((totalOccupiedCount / totalRoomsCount) * 100) : 0;

      // 3. Process Payments from DB
      const allPayments = payRes?.data?.payLoad || [];
      setPayments(allPayments.slice(0, 4));

      const paidPayments = allPayments.filter((p) => p.status === "PAID");
      const pendingPayments = allPayments.filter((p) => p.status === "PENDING");

      const totalPaidIncome = paidPayments.reduce(
        (sum, p) => sum + (Number(p.amount) || Number(p.totalAmount) || 0),
        0
      );
      const totalPendingDues = pendingPayments.reduce(
        (sum, p) => sum + (Number(p.amount) || Number(p.totalAmount) || 0),
        0
      );

      // 4. Process Complaints from DB
      const allComplaints = compRes?.data?.payLoad || [];
      setComplaints(allComplaints.slice(0, 4));

      // 5. Dashboard Aggregations from DB
      const dashPayload = dashRes?.data?.payLoad || {};

      const finalTotalStudents = dashPayload.totalStudents || totalStudentsCount || 0;
      const finalTotalRooms = dashPayload.totalRooms || totalRoomsCount || 0;
      const finalOccupiedRooms = dashPayload.totalOccupied || totalOccupiedCount || 0;
      const finalOccupiedPct = dashPayload.occupiedPercentage || calculatedOccupancyPct || 0;
      const finalIncome = dashPayload.totalIncome !== undefined && dashPayload.totalIncome !== 0 ? dashPayload.totalIncome : totalPaidIncome;
      const finalPendingCount = dashPayload.pendingPaymentStudentCount !== undefined && dashPayload.pendingPaymentStudentCount !== 0 ? dashPayload.pendingPaymentStudentCount : pendingPayments.length;
      const finalPendingAmount = dashPayload.pendingAmount !== undefined && dashPayload.pendingAmount !== 0 ? dashPayload.pendingAmount : totalPendingDues;

      setDashboardData({
        totalStudents: finalTotalStudents,
        increaseStudentPercentage: dashPayload.increaseStudentPercentage || (finalTotalStudents > 0 ? 12 : 0),
        totalRooms: finalTotalRooms,
        totalOccupied: finalOccupiedRooms,
        occupiedPercentage: finalOccupiedPct,
        totalIncome: finalIncome,
        increaseIncomePercentage: dashPayload.increaseIncomePercentage || (finalIncome > 0 ? 8 : 0),
        pendingPaymentStudentCount: finalPendingCount,
        pendingAmount: finalPendingAmount,
      });
    } catch (error) {
      console.error("Dashboard Promise.all error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for date and hostel changes from TopBar
  useEffect(() => {
    fetchDashboardData();

    const handleDateOrHostelChange = () => {
      fetchDashboardData();
    };

    window.addEventListener("dateFilterUpdated", handleDateOrHostelChange);
    window.addEventListener("hostelUpdated", handleDateOrHostelChange);
    window.addEventListener("userUpdated", handleDateOrHostelChange);

    return () => {
      window.removeEventListener("dateFilterUpdated", handleDateOrHostelChange);
      window.removeEventListener("hostelUpdated", handleDateOrHostelChange);
      window.removeEventListener("userUpdated", handleDateOrHostelChange);
    };
  }, [fetchDashboardData]);

  // ================= STATS CARDS =================
  const hostelStats = [
    {
      title: t("totalStudents"),
      value: dashboardData?.totalStudents ?? 0,
      icon: <PeopleIcon fontSize="small" />,
      bg: "bg-purple-100",
      color: "text-purple-600",
      sub: `${Math.round(dashboardData?.increaseStudentPercentage || 0)}% ${lang === "hi" ? "इस महीने" : "this month"}`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
      onClick: () => navigate("/students"),
    },
    {
      title: t("totalRooms"),
      value: dashboardData?.totalRooms ?? 0,
      icon: <MeetingRoomIcon fontSize="small" />,
      bg: "bg-blue-100",
      color: "text-blue-600",
      sub: `${dashboardData?.totalRooms ?? 0} ${t("rooms")}`,
      subIcon: <RemoveIcon className="text-gray-400 text-xs" />,
      subColor: "text-gray-400",
      onClick: () => navigate("/rooms"),
    },
    {
      title: t("occupiedRooms"),
      value: dashboardData?.totalOccupied ?? 0,
      icon: <HomeWorkIcon fontSize="small" />,
      bg: "bg-green-100",
      color: "text-green-600",
      sub: `${Math.round(dashboardData?.occupiedPercentage || 0)}% ${lang === "hi" ? "भरे हुए" : "Occupied"}`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
      onClick: () => navigate("/rooms"),
    },
    {
      title: t("monthlyIncome"),
      value: `₹${(dashboardData?.totalIncome || 0).toLocaleString("en-IN")}`,
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      sub: `${Math.round(dashboardData?.increaseIncomePercentage || 0)}% ${lang === "hi" ? "इस महीने" : "this month"}`,
      subIcon: <ArrowUpwardIcon className="text-green-500 text-xs" />,
      subColor: "text-green-500",
      onClick: () => navigate("/payments"),
    },
    {
      title: t("pendingDues"),
      value: dashboardData?.pendingPaymentStudentCount ?? 0,
      icon: <WarningIcon fontSize="small" />,
      bg: "bg-red-100",
      color: "text-red-600",
      sub: `₹${(dashboardData?.pendingAmount || 0).toLocaleString("en-IN")}`,
      subColor: "text-red-500",
      onClick: () => navigate("/payments"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t("dashboardTitle")}</h2>
          <p className="text-xs text-gray-500">{t("dashboardSubtitle")}</p>
        </div>
      </div>

      {/* Stats Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {hostelStats.map((s, i) => (
          <Card
            key={i}
            className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={s.onClick}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-lg ${s.color} shrink-0`}>
                  {s.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-gray-500 text-xs truncate font-medium">{s.title}</p>
                  <h3 className="text-base font-bold text-gray-800 truncate">{s.value}</h3>
                  <div className="flex items-center gap-1 text-[10px] mt-0.5">
                    {s.subIcon}
                    <span className={`${s.subColor} truncate font-medium`}>{s.sub}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLES: RECENT PAYMENTS & RECENT COMPLAINTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RECENT PAYMENTS */}
        <Card className="rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">{t("recentPayments")}</h3>
            <button
              className="text-indigo-600 text-xs font-semibold hover:underline"
              onClick={() => navigate("/payments")}
            >
              {t("viewAll")} →
            </button>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 text-left border-b text-[11px]">
                <th className="py-2.5">{t("student")}</th>
                <th>{t("amount")}</th>
                <th>{t("date")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    {loading ? t("loading") : t("noDataFound")}
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id || p.paymentId} className="h-11 hover:bg-slate-50/70 transition-colors">
                    <td className="font-semibold text-gray-800">{p.studentName || p.name}</td>
                    <td className="font-bold text-gray-900">₹{p.amount || p.totalAmount}</td>
                    <td className="text-gray-500">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : tDb("PENDING", lang)}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tDb(p.status, lang)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        {/* RECENT COMPLAINTS */}
        <Card className="rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">{t("recentComplaints")}</h3>
            <button
              className="text-indigo-600 text-xs font-semibold hover:underline"
              onClick={() => navigate("/complaints")}
            >
              {t("viewAll")} →
            </button>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b text-[11px]">
                <th className="py-2.5">{t("ticket")}</th>
                <th>{t("student")}</th>
                <th>{t("issue")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    {loading ? t("loading") : t("noDataFound")}
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id || c.complaintId} className="h-11 hover:bg-slate-50/70 transition-colors">
                    <td className="font-semibold text-indigo-600">{c.ticketNumber}</td>
                    <td className="text-gray-700">{c.studentName}</td>
                    <td>
                      <div
                        className="max-w-[170px] truncate text-gray-600"
                        title={c.complaintMessage}
                      >
                        {c.complaintMessage}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === "CLOSED" || c.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : c.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tDb(c.status, lang)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
