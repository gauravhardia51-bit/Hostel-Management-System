import React, { useState } from "react";
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

export default function Reports() {
  const [month, setMonth] = useState("April");

  // 📊 Dummy Data
  const revenueData = [
    { name: "Week 1", amount: 20000 },
    { name: "Week 2", amount: 35000 },
    { name: "Week 3", amount: 28000 },
    { name: "Week 4", amount: 40000 },
  ];

  const pieData = [
    { name: "Paid", value: 60 },
    { name: "Pending", value: 40 },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  const topDefaulters = [
    { name: "Rohit Sharma", due: "₹5000" },
    { name: "Aman Verma", due: "₹4000" },
    { name: "Vikas Singh", due: "₹3000" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Reports</h2>
        </div>

        <Button variant="contained" startIcon={<DownloadIcon />}>
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
          <MenuItem value="April">April</MenuItem>
          <MenuItem value="March">March</MenuItem>
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

        {/* Payment Pie */}
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
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <div className="flex justify-around text-xs mt-3">
              <span className="text-green-600">Paid (60%)</span>
              <span className="text-red-500">Pending (40%)</span>
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
                {topDefaulters.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{d.name}</td>
                    <td className="text-red-500 font-medium">{d.due}</td>
                  </tr>
                ))}
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
                <span className="font-semibold">₹1,23,000</span>
              </div>

              <div className="flex justify-between">
                <span>Collected</span>
                <span className="text-green-600">₹75,000</span>
              </div>

              <div className="flex justify-between">
                <span>Pending</span>
                <span className="text-red-500">₹48,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
