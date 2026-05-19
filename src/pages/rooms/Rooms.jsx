import React from "react";
import { Card, CardContent, Button, IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import api from "../../api/Api.jsx";
import AddRoomDrawer from "../../feature/rooms/AddRoomDrawer.jsx";
import Pagination from "../../components/common/Pagination.jsx";

export default function Rooms() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            Loading...
          </td>
        </tr>
      );
    }

    if (rooms.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No rooms found
          </td>
        </tr>
      );
    }

    // ✅ IMPORTANT: return map
    return rooms.map((room, index) => {
      const status = getStatus(room);

      return (
        <tr key={room.id} className="border-b hover:bg-gray-50">
          <td className="py-3">{page * 6 + index + 1}</td>
          <td>{room.roomNo || room.roomNumber}</td>
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
    });
  };

  const getStatus = (room) => {
    return room.occupied === room.capacity ? "FULL" : "AVAILABLE";
  };

  const getStatusStyle = (status) => {
    return status === "FULL"
      ? "bg-red-100 text-red-500"
      : "bg-green-100 text-green-600";
  };

  localStorage.getItem("token");

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room/all", {
        params: {
          pageNo: page,
          pageSize: 6,
        },
      });

      const data = res.data;

      setRooms(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleSave = (data) => {
    console.log("Saved:", data);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRooms();
    }, 300); // rooms usually don’t need long debounce

    return () => clearTimeout(delay);
  }, [page]);

  return (
    <div className="bg-[#f5f7fb]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Rooms</h2>
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
          Add Room
        </Button>
        <AddRoomDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          rooms={[]}
        />
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

            <tbody>{renderRows()}</tbody>
          </table>

          {/* Footer */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
            maxVisible={5}
            label="rooms"
          />
        </CardContent>
      </Card>
    </div>
  );
}
