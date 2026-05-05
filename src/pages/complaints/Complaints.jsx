import React from "react";
import { Card, CardContent, IconButton, MenuItem, Select } from "@mui/material";
import api from "../../api/Api.jsx";
import { useEffect, useState } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

// const complaints = [
//   {
//     id: 1,
//     ticket: "#CMP1009",
//     student: "Rohit Sharma",
//     issue: "Water Problem",
//     status: "OPEN",
//     date: "28 Apr 2024",
//   },
//   {
//     id: 2,
//     ticket: "#CMP1008",
//     student: "Aman Verma",
//     issue: "WiFi Issue",
//     status: "IN_PROGRESS",
//     date: "27 Apr 2024",
//   },
//   {
//     id: 3,
//     ticket: "#CMP1007",
//     student: "Vikas Singh",
//     issue: "Electricity Problem",
//     status: "OPEN",
//     date: "27 Apr 2024",
//   },
//   {
//     id: 4,
//     ticket: "#CMP1006",
//     student: "Rahul Kumar",
//     issue: "Room Cleaning",
//     status: "CLOSED",
//     date: "26 Apr 2024",
//   },
//   {
//     id: 5,
//     ticket: "#CMP1005",
//     student: "Deepak Yadav",
//     issue: "Washroom Issue",
//     status: "OPEN",
//     date: "25 Apr 2024",
//   },
//   {
//     id: 6,
//     ticket: "#CMP1004",
//     student: "Rajesh Kumar",
//     issue: "Fan Not Working",
//     status: "IN_PROGRESS",
//     date: "25 Apr 2024",
//   },
// ];

export default function Complaints() {
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await api.get("/complaint/all", {
        params: {
          pageNo: page,
          pageSize: 8,
          //studentName: search,
          //phone: search,
        },
      });

      const data = res.data;
      console.log("Fetched complaints:", data);
      setComplaints(data.payLoad || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchComplaints();
    }, 500);

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
        <td className="py-3">{page * 8 + index + 1}</td>
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
        <td>{c.dateOfCreation}</td>
        <td className="text-center space-x-1">
          <IconButton size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </td>
      </tr>
    ));
  };

  const getStatusStyle = (status) => {
    if (status === "OPEN") return "bg-yellow-100 text-yellow-600";
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Complaints</h2>
          <p className="text-xs text-gray-500">Dashboard / Complaints</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {/* Status Filter */}
        <Select size="small" defaultValue="ALL" className="bg-white rounded-md">
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
              setPage(0); // reset page
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
              Showing {complaints.length === 0 ? 0 : page * 8 + 1} to{" "}
              {page * 8 + complaints.length} of {totalElements} complaints
            </span>

            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-1 border rounded"
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded ${
                    i === page ? "bg-indigo-600 text-white" : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-1 border rounded"
              >
                &gt;
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
