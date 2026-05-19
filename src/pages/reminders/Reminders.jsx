import React from "react";
import { Card, CardContent, Button, MenuItem, Select } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SendReminderDrawer from "../../feature/reminders/SendReminderDrawer";
import { useState } from "react";

const reminders = [
  {
    id: 1,
    student: "Rahul Kumar",
    type: "RENT",
    message: "Rent payment reminder",
    status: "SENT",
    sentAt: "29 Apr 2024 10:30 AM",
  },
  {
    id: 2,
    student: "Aman Verma",
    type: "RENT",
    message: "Rent payment reminder",
    status: "PENDING",
    sentAt: "-",
  },
  {
    id: 3,
    student: "Vikas Singh",
    type: "RENT",
    message: "Rent payment reminder",
    status: "FAILED",
    sentAt: "27 Apr 2024 08:15 AM",
  },
  {
    id: 4,
    student: "Amit Sharma",
    type: "GENERAL",
    message: "Room cleaning reminder",
    status: "SENT",
    sentAt: "27 Apr 2024 11:20 AM",
  },
  {
    id: 5,
    student: "Deepak Yadav",
    type: "RENT",
    message: "Rent payment reminder",
    status: "PENDING",
    sentAt: "-",
  },
];

export default function Reminders() {
  const getStatusStyle = (status) => {
    if (status === "SENT") return "bg-green-100 text-green-600";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-500";
  };

  const [open, setOpen] = useState(false);

  const handleSave = (data) => {
    console.log("Saved:", data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Reminders</h2>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => setOpen(true)}
        >
          Send Reminder
        </Button>

        <SendReminderDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          students={[]}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {/* Hostel Filter */}
        <Select size="small" defaultValue="ALL" className="bg-white rounded-md">
          <MenuItem value="ALL">All Hostels</MenuItem>
          <MenuItem value="1">Hostel A</MenuItem>
          <MenuItem value="2">Hostel B</MenuItem>
        </Select>

        {/* Status Filter */}
        <Select size="small" defaultValue="ALL" className="bg-white rounded-md">
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="SENT">Sent</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
        </Select>

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
                <th>Type</th>
                <th>Message</th>
                <th>Status</th>
                <th>Sent At</th>
              </tr>
            </thead>

            <tbody>
              {reminders.map((r, index) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>
                  <td>{r.student}</td>
                  <td>{r.type}</td>
                  <td>{r.message}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td>{r.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          {/* <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
            maxVisible={5}
            label="rooms"
          /> */}
        </CardContent>
      </Card>
    </div>
  );
}
