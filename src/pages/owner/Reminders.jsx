import React, { useEffect, useState } from "react";
import { Card, CardContent, Button, MenuItem, Select } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import SendReminderDrawer from "../../feature/reminders/SendReminderDrawer.jsx";

import api from "../../api/Api.jsx";

import Pagination from "../../components/common/Pagination.jsx";

import { formatDateForDisplay } from "../../utils/formatDate.js";

export default function Reminders() {
  const [loading, setLoading] = useState(false);

  const [reminders, setReminders] = useState([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [open, setOpen] = useState(false);
  const auth = getAuthData();
  const hostelId = auth?.hostelId;

  // ================= STATUS STYLE =================
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const getStatusStyle = (status) => {
    if (status === "SENT") {
      return "bg-green-100 text-green-600";
    }

    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-600";
    }

    return "bg-red-100 text-red-500";
  };

  // ================= FETCH REMINDERS =================

  const fetchReminders = async () => {
    try {
      setLoading(true);

      const fromDate = localStorage.getItem("fromDate");

      const toDate = localStorage.getItem("toDate");

      const res = await api.get("/reminder/all", {
        params: {
          pageNo: page,

          pageSize: 10,

          hostelId: hostelId,

          search: search || undefined,

          status: status !== "ALL" ? status : undefined,

          scheduleStartTime: fromDate || undefined,

          scheduleEndTime: toDate || undefined,
        },
      });

      const data = res.data;

      setReminders(data.payLoad || []);

      setTotalPages(data.totalPage || 0);

      setTotalElements(data.totalRow || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DATE FILTER EVENT =================

  useEffect(() => {
    const handleDateChange = () => {
      setPage(0);

      fetchReminders();
    };

    window.addEventListener("dateFilterUpdated", handleDateChange);

    return () => {
      window.removeEventListener("dateFilterUpdated", handleDateChange);
    };
  }, []);

  // ================= AUTO FETCH =================

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchReminders();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, status]);

  // ================= SAVE =================

  const handleSave = async (data) => {
    console.log("Saved:", data);

    fetchReminders();
  };

  // ================= TABLE ROWS =================

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            Loading...
          </td>
        </tr>
      );
    }

    if (reminders.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            No reminders found
          </td>
        </tr>
      );
    }

    return reminders.map((r, index) => (
      <tr key={r.id} className="border-b hover:bg-gray-50">
        <td className="py-3">{page * 10 + index + 1}</td>

        <td>{r.studentName}</td>

        <td>{r.type}</td>

        <td>{r.message}</td>

        <td>
          <span
            className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(
              r.status,
            )}`}
          >
            {r.status}
          </span>
        </td>

        <td>{r.sentAt ? formatDateForDisplay(r.sentAt) : "-"}</td>
      </tr>
    ));
  };

  return (
    <div>
      {/* HEADER */}

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

      {/* FILTERS */}

      <div className="flex gap-3 mb-4">
        {/* STATUS FILTER */}

        <Select
          size="small"
          value={status}
          onChange={(e) => {
            setPage(0);

            setStatus(e.target.value);
          }}
          className="bg-white rounded-md"
        >
          <MenuItem value="ALL">All Status</MenuItem>

          <MenuItem value="SENT">Sent</MenuItem>

          <MenuItem value="PENDING">Pending</MenuItem>

          <MenuItem value="FAILED">Failed</MenuItem>
        </Select>

        {/* SEARCH */}

        <div className="flex items-center bg-white border rounded-md px-2 w-64">
          <SearchIcon className="text-gray-400" />

          <input
            type="text"
            placeholder="Search student..."
            className="w-full px-2 py-1.5 outline-none text-sm"
            value={search}
            onChange={(e) => {
              setPage(0);

              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* TABLE */}

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

            <tbody>{renderRows()}</tbody>
          </table>

          {/* PAGINATION */}

          <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label="reminders"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
