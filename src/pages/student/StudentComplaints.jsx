import { useEffect, useState } from "react";
import { Card, Select, MenuItem, Button } from "@mui/material";
import Pagination from "../../components/common/Pagination.jsx";

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // ================= DUMMY DATA =================
  useEffect(() => {
    const dummyData = [
      {
        ticket: "#CMP1012",
        issue: "WiFi not working",
        status: "OPEN",
        date: "28 Apr 2024",
      },
      {
        ticket: "#CMP1011",
        issue: "Water leakage",
        status: "IN_PROGRESS",
        date: "25 Apr 2024",
      },
      {
        ticket: "#CMP1010",
        issue: "Fan not working",
        status: "CLOSED",
        date: "20 Apr 2024",
      },
      {
        ticket: "#CMP1009",
        issue: "Room Cleaning",
        status: "CLOSED",
        date: "18 Apr 2024",
      },
    ];

    setComplaints(dummyData);
  }, []);

  // ================= FILTER =================
  const filteredComplaints =
    statusFilter === "ALL"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-600";
      case "CLOSED":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Complaints</h2>

        <Button variant="contained">+ Add Complaint</Button>
      </div>

      {/* FILTER */}
      <div className="mb-4">
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="p-4 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left border-b">
              <th className="py-2">Ticket No.</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c, i) => (
                <tr key={i} className="border-b h-12">
                  <td>{c.ticket}</td>
                  <td>{c.issue}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                        c.status,
                      )}`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </td>

                  <td>{c.date}</td>

                  <td>
                    <button className="text-indigo-600 text-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Footer */}
        <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
          {/* <span>
                    Showing {students.length === 0 ? 0 : page * 10 + 1} to{" "}
                    {page * 10 + students.length} of {totalElements} students
                  </span> */}

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
      </Card>
    </div>
  );
}
