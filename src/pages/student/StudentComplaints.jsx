import { useEffect, useState } from "react";
import {
  Card,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import Pagination from "../../components/common/Pagination.jsx";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { formatDateForDisplay } from "../../utils/formatDate";
import { toast } from "react-toastify";

export default function StudentComplaints() {
  const auth = getAuthData();
  const hostelId = auth?.hostelsId;
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [complaintMessage, setComplaintMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaint/all", {
        params: {
          hostelId,
          pageNo: page,
          pageSize: 10,
          status: statusFilter === "ALL" ? null : statusFilter,
        },
      });

      const data = response.data;
      console.log("FETCH COMPLAINTS => ", data);
      setComplaints(data.payLoad || []);

      setTotalPages(data.totalPage || 0);

      setTotalElements(data.totalRow || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hostelId) {
      fetchComplaints();
    }
  }, [page, statusFilter, hostelId]);

  const addComplaint = async () => {
    try {
      await api.post("/complaint/add", {
        hostelId,
        complaintMessage,
      });

      toast.success("Complaint submitted successfully.");

      setComplaintMessage("");

      setOpen(false);

      fetchComplaints();
    } catch (error) {
      console.log(error);

      toast.error("Unable to submit complaint.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-100 text-yellow-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "CLOSED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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

    if (complaints.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            No complaints found
          </td>
        </tr>
      );
    }

    return complaints.map((complaint, index) => (
      <tr key={complaint.id} className="border-b hover:bg-gray-50">
        <td className="py-3">{page * 10 + index + 1}</td>
        <td>{complaint.ticketNumber}</td>
        <td>{complaint.complaintMessage}</td>
        <td>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
              complaint.status,
            )}`}
          >
            {complaint.status.replace("_", " ")}
          </span>
        </td>
        <td>{formatDateForDisplay(complaint.dateOfCreation)}</td>
        <td className="text-center">
          <Button size="small">View</Button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      {/* Header */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Complaints</h2>

        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Complaint
        </Button>
      </div>

      {/* Filter */}

      <div className="mb-4">
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => {
            setPage(0);
            setStatusFilter(e.target.value);
          }}
        >
          <MenuItem value="ALL">All Status</MenuItem>

          <MenuItem value="OPEN">Open</MenuItem>

          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>

          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </div>

      {/* Table */}

      <Card className="p-4 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-3">Ticket</th>
              <th className="text-left">Issue</th>
              <th className="text-left">Status</th>
              <th className="text-left">Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>{renderRows()}</tbody>
        </table>

        <div className="flex justify-end mt-4">
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
      </Card>

      {/* Add Complaint Dialog */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Complaint</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Complaint"
            margin="normal"
            value={complaintMessage}
            onChange={(e) => setComplaintMessage(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={addComplaint}
            disabled={!complaintMessage.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
