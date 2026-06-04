import React, { useEffect, useState } from "react";
import { Card, CardContent, Select, MenuItem, Button } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import api from "../api/Api";

export default function Reports() {
  const [month, setMonth] = useState("April");

  const [revenueData, setRevenueData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [topDefaulters, setTopDefaulters] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    collected: 0,
    pending: 0,
  });

  const COLORS = ["#4ade80", "#f87171"];

  // ================= DATE HELPER =================
  const getMonthRange = (monthName) => {
    const year = new Date().getFullYear();

    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    const start = new Date(year, monthIndex, 1).getTime();
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59).getTime();

    return { start, end };
  };

  // ================= FETCH REPORT =================
  useEffect(() => {
    const fetchReports = async () => {
      const hostelId = localStorage.getItem("hostelId");

      const { start, end } = getMonthRange(month); // ✅ also fix this
      console.log("Fetching reports for:", { month, start, end });
      const res = await api.get("/reports", {
        params: {
          hostelId,
          fromDate: start,
          toDate: end,
        },
      });

      const data = res.data.payLoad;
      console.log("Report data received:", data);
      setRevenueData(data.revenueData);
      setPieData(data.pieData);
      setTopDefaulters(data.topDefaulters);

      // ✅ ADD THIS HERE
      setSummary({
        total: data.totalRevenue,
        collected: data.totalCollected,
        pending: data.totalPending,
      });
    };

    fetchReports();
  }, []);

  // ================= EXPORT (OPTIONAL) =================
  const handleExport = () => {
    alert("Export feature coming soon 🚀");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Reports</h2>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <Select
          size="small"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white"
        >
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
          <MenuItem value="April">April</MenuItem>
          <MenuItem value="May">May</MenuItem>
          <MenuItem value="June">June</MenuItem>
          <MenuItem value="July">July</MenuItem>
          <MenuItem value="August">August</MenuItem>
          <MenuItem value="September">September</MenuItem>
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="November">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card className="rounded-xl">
          <CardContent>
            <h3 className="text-sm font-semibold mb-3">Revenue Overview</h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="rounded-xl">
          <CardContent>
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
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <div className="flex justify-around text-xs mt-3">
              {pieData.map((p, i) => (
                <span key={i} style={{ color: COLORS[i % COLORS.length] }}>
                  {p.name} ({p.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Defaulters */}
        <Card className="rounded-xl">
          <CardContent>
            <h3 className="text-sm font-semibold mb-3">Top Defaulters</h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs text-left border-b">
                  <th className="py-2">Student</th>
                  <th>Due Amount</th>
                </tr>
              </thead>

              <tbody>
                {topDefaulters.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-3">
                      No data
                    </td>
                  </tr>
                ) : (
                  topDefaulters.map((d, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{d.name}</td>
                      <td className="text-red-500 font-medium">₹{d.due}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="rounded-xl">
          <CardContent>
            <h3 className="text-sm font-semibold mb-3">Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-semibold">₹{summary.total}</span>
              </div>

              <div className="flex justify-between">
                <span>Collected</span>
                <span className="text-green-600">₹{summary.collected}</span>
              </div>

              <div className="flex justify-between">
                <span>Pending</span>
                <span className="text-red-500">₹{summary.pending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
