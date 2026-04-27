import React from "react";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

const payments = [
  {
    id: 1,
    name: "Rahul Kumar",
    amount: "₹5,000",
    dueDate: "05 Apr 2024",
    paidDate: "05 Apr 2024",
    status: "PAID",
  },
  {
    id: 2,
    name: "Aman Verma",
    amount: "₹4,500",
    dueDate: "05 Apr 2024",
    paidDate: "-",
    status: "PENDING",
  },
  {
    id: 3,
    name: "Vikas Singh",
    amount: "₹5,000",
    dueDate: "05 Apr 2024",
    paidDate: "05 Apr 2024",
    status: "PAID",
  },
  {
    id: 4,
    name: "Rohit Sharma",
    amount: "₹5,000",
    dueDate: "05 Apr 2024",
    paidDate: "-",
    status: "PENDING",
  },
  {
    id: 5,
    name: "Deepak Yadav",
    amount: "₹4,500",
    dueDate: "05 Apr 2024",
    paidDate: "-",
    status: "PENDING",
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    amount: "₹5,000",
    dueDate: "05 Apr 2024",
    paidDate: "05 Apr 2024",
    status: "PAID",
  },
];

export default function Payments() {
  const getStatusStyle = (status) => {
    return status === "PAID"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-500";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Payments</h2>
          <p className="text-xs text-gray-500">Dashboard / Payments</p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Add Payment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {/* Status Filter */}
        <Select size="small" defaultValue="ALL" className="bg-white rounded-md">
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="PAID">Paid</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
        </Select>

        {/* Date Range */}
        <input
          type="text"
          value="01 Apr 2024 - 30 Apr 2024"
          readOnly
          className="border px-3 py-1.5 rounded-md text-sm bg-white"
        />

        {/* Search */}
        <div className="flex items-center bg-white border rounded-md px-2 w-64">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full px-2 py-1.5 outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left text-xs border-b">
                <th className="py-2">#</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.amount}</td>
                  <td>{p.dueDate}</td>
                  <td>{p.paidDate}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>Showing 1 to 6 of 27 payments</span>

            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border rounded">&lt;</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded">2</button>
              <button className="px-3 py-1 border rounded">3</button>
              <button className="px-3 py-1 border rounded">4</button>
              <button className="px-3 py-1 border rounded">5</button>
              <button className="px-2 py-1 border rounded">&gt;</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
