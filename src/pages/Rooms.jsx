import React from "react";
import { Card, CardContent, Button, IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import api from "../api/Api.jsx";
import AddRoomDrawer from "../feature/rooms/AddRoomDrawer.jsx";
import SearchIcon from "@mui/icons-material/Search";
import "./Rooms.css";
import Pagination from "../components/common/Pagination.jsx";
import { toast } from "react-toastify";

export default function Rooms() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit | view
  const [search, setSearch] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: localStorage.getItem("hostelId"),
          search: search,
        },
      });

      const data = res.data;

      setRooms(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
      console.log("41 Fetched rooms:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRooms();
    }, 300); // rooms usually don’t need long debounce

    return () => clearTimeout(delay);
  }, [page, search]);

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
          <td>
            {room.roomNumber?.startsWith("R-")
              ? room.roomNumber
              : `R-${room.roomNo || room.roomNumber}`}
          </td>
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
            <IconButton
              size="small"
              onClick={() => {
                setSelectedRoom(room);
                setMode("edit");
                setOpen(true);
              }}
            >
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

  const handleSave = async (formData) => {
    console.log("Saving room with data:", formData.roomNumber);
    try {
      if (mode === "edit") {
        await api.put(`/room/update`, formData);
        toast.success("Room updated successfully ✅");
      } else {
        await api.post("/room/add", formData);
        toast.success("Room added successfully ✅");
      }
      fetchRooms(); // refresh table
      setOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("FULL ERROR:", err.response);
      toast.error("Something went wrong ❌");
    }
  };

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
          onClick={() => {
            setSelectedRoom(null);
            setMode("add");
            setOpen(true);
          }}
        >
          Add Room
        </Button>
        <AddRoomDrawer
          key={selectedRoom?.id || mode}
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          rooms={rooms}
          editData={selectedRoom}
          mode={mode}
        />
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search room by number..."
            className="w-full px-2 py-2 outline-none text-sm"
            value={search}
            onChange={(e) => {
              setPage(0); // reset page
              setSearch(e.target.value);
            }}
          />
        </div>
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
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>
              Showing {rooms.length === 0 ? 0 : page * 8 + 1} to{" "}
              {page * 8 + rooms.length} of {totalElements} rooms
            </span>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label="students"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
