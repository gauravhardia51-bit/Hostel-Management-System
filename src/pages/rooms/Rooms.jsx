import React from "react";
import { Card, CardContent, Button, IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const rooms = [
  { id: 1, roomNo: "101", capacity: 3, occupied: 3 },
  { id: 2, roomNo: "102", capacity: 3, occupied: 2 },
  { id: 3, roomNo: "103", capacity: 3, occupied: 3 },
  { id: 4, roomNo: "201", capacity: 2, occupied: 2 },
  { id: 5, roomNo: "202", capacity: 2, occupied: 1 },
  { id: 6, roomNo: "203", capacity: 2, occupied: 0 },
];

export default function Rooms() {
  const getStatus = (room) => {
    return room.occupied === room.capacity ? "FULL" : "AVAILABLE";
  };

  const getStatusStyle = (status) => {
    return status === "FULL"
      ? "bg-red-100 text-red-500"
      : "bg-green-100 text-green-600";
  };

  return (
    <div className="bg-[#f5f7fb]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Rooms</h2>
          <p className="text-xs text-gray-500">Dashboard / Rooms</p>
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
          Add Room
        </Button>
      </div>

      {/* Table Card */}
      <Card className="rounded-xl shadow-sm">
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left text-xs border-b">
                <th className="py-2">#</th>
                <th>Room No.</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room, index) => {
                const status = getStatus(room);

                return (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{index + 1}</td>
                    <td>{room.roomNo}</td>
                    <td>{room.capacity}</td>
                    <td>{room.occupied}</td>

                    <td>
                      <span
                        className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(
                          status,
                        )}`}
                      >
                        {status}
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
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>Showing 1 to 6 of 24 rooms</span>

            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border rounded">&lt;</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded">2</button>
              <button className="px-3 py-1 border rounded">3</button>
              <button className="px-3 py-1 border rounded">4</button>
              <button className="px-2 py-1 border rounded">&gt;</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
