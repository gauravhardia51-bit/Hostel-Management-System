import React from "react";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/sidebar/Sidebar";
import TopBar from "../../components/topbar/TopBar";

const students = [
  {
    id: 1,
    name: "Rahul Kumar",
    phone: "9876543210",
    room: "101",
    joinDate: "12 Jan 2024",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Aman Verma",
    phone: "9123456780",
    room: "102",
    joinDate: "15 Jan 2024",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Vikas Singh",
    phone: "9988776655",
    room: "201",
    joinDate: "20 Feb 2024",
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "Rohit Sharma",
    phone: "8877665544",
    room: "103",
    joinDate: "25 Feb 2024",
    status: "ACTIVE",
  },
  {
    id: 5,
    name: "Deepak Yadav",
    phone: "9988123456",
    room: "202",
    joinDate: "01 Mar 2024",
    status: "ACTIVE",
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    phone: "9123987654",
    room: "203",
    joinDate: "05 Mar 2024",
    status: "INACTIVE",
  },
  {
    id: 7,
    name: "Sandeep Patel",
    phone: "9234567890",
    room: "104",
    joinDate: "10 Mar 2024",
    status: "ACTIVE",
  },
  {
    id: 8,
    name: "Pooja Singh",
    phone: "8877112233",
    room: "204",
    joinDate: "18 Mar 2024",
    status: "ACTIVE",
  },
];

export default function Students() {
  const getStatusStyle = (status) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-500";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-xs text-gray-500">Dashboard / Students</p>
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
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 w-1/3">
        <div className="flex items-center bg-white border rounded-lg px-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search student by name or phone..."
            className="w-full px-2 py-2 outline-none text-sm"
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
                <th>Name</th>
                <th>Phone</th>
                <th>Room</th>
                <th>Join Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, index) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.phone}</td>
                  <td>{s.room}</td>
                  <td>{s.joinDate}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(s.status)}`}
                    >
                      {s.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-center space-x-1">
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>Showing 1 to 8 of 68 students</span>

            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border rounded">&lt;</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded">2</button>
              <button className="px-3 py-1 border rounded">3</button>
              <button className="px-3 py-1 border rounded">...</button>
              <button className="px-3 py-1 border rounded">9</button>
              <button className="px-2 py-1 border rounded">&gt;</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
