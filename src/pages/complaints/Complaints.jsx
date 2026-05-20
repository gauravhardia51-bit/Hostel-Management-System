import React, { useEffect, useState } from "react";
import { Card, CardContent, IconButton, MenuItem, Select } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

import api from "../../api/Api.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import AddComplaintDrawer from "../../feature/complaints/AddComplaintDrawer.jsx";
import { toast } from "react-toastify";
import { formatDateForInput } from "../../utils/formatDate.js";

export default function Complaints() {
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ✅ FETCH API
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await api.get("/complaint/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: localStorage.getItem("hostelId"),
          search: search,
          status: status !== "ALL" ? status : undefined,
        },
      });

      const data = res.data;

      setComplaints(data.payLoad || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //AUTO FETCH
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchComplaints();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, status]);

  const handleSave = async (formData) => {
    try {
      await api.put("/complaint/update", formData);

      toast.success("Complaint updated successfully ✅");

      fetchComplaints();
      setOpen(false);
      setSelectedComplaint(null);
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌");
    }
  };

  //STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "OPEN") return "bg-yellow-100 text-yellow-600";
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-600";
    return "bg-green-100 text-green-600";
  };

  //TABLE ROWS
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

    if (complaints.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No complaints found
          </td>
        </tr>
      );
    }

    return complaints.map((c, index) => (
      <tr key={c.id} className="border-b hover:bg-gray-50">
        <td className="py-3">{page * 10 + index + 1}</td>
        <td>{c.ticketNumber}</td>
        <td>{c.studentName}</td>
        <td>{c.complaintMessage}</td>

        <td>
          <span
            className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(
              c.status,
            )}`}
          >
            {c.status || "N/A"}
          </span>
        </td>

        <td>{formatDateForInput(c.dateOfCreation)}</td>

        <td className="text-center space-x-1">
          <IconButton size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => {
              setSelectedComplaint(c);
              setOpen(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Complaints</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {/* Status Filter */}
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
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>

        {/* Search */}
        <div className="flex items-center bg-white border rounded-md px-2 w-64">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search complaint..."
            className="w-full px-2 py-1.5 outline-none text-sm"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
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
                <th>Ticket No.</th>
                <th>Student</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>{renderRows()}</tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>
              Showing {complaints.length === 0 ? 0 : page * 10 + 1} to{" "}
              {page * 10 + complaints.length} of {totalElements} complaints
            </span>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label="complaints"
            />
          </div>
        </CardContent>
      </Card>

      {/* ✅ Drawer */}
      <AddComplaintDrawer
        key={selectedComplaint?.id || "new"}
        open={open}
        onClose={() => setOpen(false)}
        editData={selectedComplaint}
        onSave={handleSave}
      />
    </div>
  );
}
