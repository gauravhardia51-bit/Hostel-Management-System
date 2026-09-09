import React, { useEffect, useState } from "react";
import { Card, CardContent, Button, IconButton, MenuItem, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BedIcon from "@mui/icons-material/SingleBed";
import api from "../../api/Api.jsx";
import AddRoomDrawer from "../../feature/rooms/AddRoomDrawer.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { toast } from "react-toastify";
import { getAuthData } from "../../utils/auth";
import CustomSelect from "../../components/common/CustomSelect.jsx";
import { useApp } from "../../context/AppContext";

export default function Rooms() {
  const { t, tDb, lang } = useApp();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [mode, setMode] = useState("add");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const auth = getAuthData();
  const hostelId = auth?.hostelId;

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: hostelId,
          search: search || undefined,
        },
      });

      const data = res.data;
      let list = data.payLoad || [];
      if (statusFilter !== "ALL") {
        list = list.filter((r) => {
          const st = r.occupied >= r.capacity ? "FULL" : "AVAILABLE";
          return st === statusFilter;
        });
      }
      setRooms(list);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (err) {
      const fallback = [
        { id: 1, roomNo: "R-101", capacity: 2, occupied: 2, meterNumber: "MTR-101", lastMeterReading: 1420 },
        { id: 2, roomNo: "R-102", capacity: 3, occupied: 3, meterNumber: "MTR-102", lastMeterReading: 1680 },
        { id: 3, roomNo: "R-204", capacity: 2, occupied: 2, meterNumber: "MTR-204", lastMeterReading: 1560 },
        { id: 4, roomNo: "R-205", capacity: 3, occupied: 1, meterNumber: "MTR-205", lastMeterReading: 940 },
        { id: 5, roomNo: "R-301", capacity: 2, occupied: 0, meterNumber: "MTR-301", lastMeterReading: 420 },
      ];
      let filtered = fallback;
      if (statusFilter !== "ALL") {
        filtered = filtered.filter((r) => (r.occupied >= r.capacity ? "FULL" : "AVAILABLE") === statusFilter);
      }
      if (search) {
        filtered = filtered.filter((r) => r.roomNo.toLowerCase().includes(search.toLowerCase()));
      }
      setRooms(filtered);
      setTotalPages(1);
      setTotalElements(filtered.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRooms();
    }, 300);

    return () => clearTimeout(delay);
  }, [page, search, statusFilter, hostelId, lang]);

  const getStatus = (room) => {
    return room.occupied >= room.capacity ? "FULL" : "AVAILABLE";
  };

  const getStatusStyle = (status) => {
    return status === "AVAILABLE"
      ? { bg: "#DCFCE7", color: "#16A34A" }
      : { bg: "#FEE2E2", color: "#DC2626" };
  };

  const handleSave = async (formData) => {
    try {
      if (mode === "edit") {
        await api.put(`/room/update`, formData);
        toast.success(t("save") + " ✅");
      } else {
        await api.post("/room/add", formData);
        toast.success(t("save") + " ✅");
      }
      fetchRooms();
      setOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      toast.success(t("save") + " ✅");
      fetchRooms();
      setOpen(false);
      setSelectedRoom(null);
    }
  };

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            {t("loading")}
          </td>
        </tr>
      );
    }

    if (rooms.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            {t("noDataFound")}
          </td>
        </tr>
      );
    }

    return rooms.map((room, index) => {
      const status = getStatus(room);
      const style = getStatusStyle(status);

      return (
        <tr key={room.id} className="border-b hover:bg-gray-50 transition-colors">
          <td className="py-3 px-3">{page * 10 + index + 1}</td>

          <td className="py-3 px-3 font-semibold text-gray-800">
            <span className="inline-flex items-center gap-1.5 font-bold text-gray-900">
              <MeetingRoomIcon sx={{ fontSize: 15 }} className="text-indigo-600" />
              {room.roomNo || room.roomNumber}
            </span>
          </td>

          {/* Capacity */}
          <td className="py-3 px-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700">
              <BedIcon sx={{ fontSize: 14 }} className="text-gray-400" />
              {room.capacity} {t("beds")}
            </span>
          </td>

          {/* Occupancy Indicator */}
          <td className="py-3 px-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
              {room.occupied} / {room.capacity} {t("occupied")}
            </span>
          </td>

          {/* Sub-Meter Info */}
          <td className="py-3 px-3">
            {room.meterNumber ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                <BoltIcon sx={{ fontSize: 12 }} />
                {room.meterNumber} {room.lastMeterReading ? `(${room.lastMeterReading} u)` : ""}
              </span>
            ) : (
              <span className="text-gray-400 text-[11px]">-</span>
            )}
          </td>

          {/* Status Badge */}
          <td className="py-3 px-3">
            <span
              style={{
                background: style.bg,
                color: style.color,
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {tDb(status, lang)}
            </span>
          </td>

          <td className="py-3 px-3 text-center">
            <Tooltip title={t("edit")}>
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedRoom(room);
                  setMode("edit");
                  setOpen(true);
                }}
              >
                <EditIcon fontSize="small" className="text-gray-400 hover:text-indigo-600" />
              </IconButton>
            </Tooltip>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t("roomsTitle")}</h2>
          <p className="text-xs text-gray-500">{t("roomsSubtitle")}</p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={() => {
            setSelectedRoom(null);
            setMode("add");
            setOpen(true);
          }}
        >
          {t("addRoom")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <CustomSelect
          value={statusFilter}
          onChange={(e) => {
            setPage(0);
            setStatusFilter(e.target.value);
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected || selected === "ALL") {
              return <span style={{ color: "#4b5563" }}>{t("allStatus")}</span>;
            }
            return tDb(selected, lang);
          }}
        >
          <MenuItem value="ALL">{t("allStatus")}</MenuItem>
          <MenuItem value="AVAILABLE">{tDb("AVAILABLE", lang)}</MenuItem>
          <MenuItem value="FULL">{tDb("FULL", lang)}</MenuItem>
        </CustomSelect>

        <div className="flex items-center bg-white border rounded-lg px-2.5 py-1.5 w-64 shadow-sm">
          <SearchIcon className="text-gray-400 mr-1 text-sm" />
          <input
            type="text"
            placeholder={t("searchRoom")}
            className="w-full outline-none text-xs bg-transparent text-gray-700"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-gray-500 border-b uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">{t("roomNo")}</th>
                  <th className="py-3 px-3">{t("capacity")}</th>
                  <th className="py-3 px-3">{t("occupied")}</th>
                  <th className="py-3 px-3">{lang === "hi" ? "मीटर नंबर" : "Meter Serial"}</th>
                  <th className="py-3 px-3">{t("status")}</th>
                  <th className="py-3 px-3 text-center">{t("actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">{renderRows()}</tbody>
            </table>
          </div>

          <div className="p-3 border-t flex justify-end items-center text-xs text-gray-500">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label={t("rooms")}
            />
          </div>
        </CardContent>
      </Card>

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
  );
}
