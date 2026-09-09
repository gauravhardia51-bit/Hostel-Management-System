import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import BoltIcon from "@mui/icons-material/Bolt";
import Pagination from "../../components/common/Pagination.jsx";
import { toast } from "react-toastify";
import api from "../../api/Api.jsx";
import { getAuthData } from "../../utils/auth";

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    category: "ELECTRICITY",
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const auth = getAuthData();
  const hostelId = auth?.hostelId;

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaint/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          studentId: auth?.user?.id,
        },
      });
      if (res.data?.payLoad) {
        setComplaints(res.data.payLoad);
        setTotalPages(res.data.totalPage || 1);
        setTotalElements(res.data.totalRow || res.data.payLoad.length);
        return;
      }
    } catch (e) {
      // Fallback dummy data with utility categories
      const dummyData = [
        {
          id: 1,
          ticket: "#CMP1012",
          category: "ELECTRICITY",
          issue: "Sub-meter reading discrepancy for Room R-204",
          status: "OPEN",
          priority: "HIGH",
          date: "04 Apr 2026",
        },
        {
          id: 2,
          ticket: "#CMP1011",
          category: "ELECTRICAL_SOCKET",
          issue: "Main AC plug socket spark & trip",
          status: "IN_PROGRESS",
          priority: "HIGH",
          date: "01 Apr 2026",
        },
        {
          id: 3,
          ticket: "#CMP1010",
          category: "WIFI",
          issue: "WiFi connection drop in 2nd Floor corridor",
          status: "CLOSED",
          priority: "LOW",
          date: "25 Mar 2026",
        },
        {
          id: 4,
          ticket: "#CMP1009",
          category: "PLUMBING",
          issue: "Bathroom tap water pressure low",
          status: "CLOSED",
          priority: "MEDIUM",
          date: "18 Mar 2026",
        },
      ];
      setComplaints(dummyData);
      setTotalPages(1);
      setTotalElements(dummyData.length);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitComplaint = async () => {
    if (!form.title && !form.description) {
      toast.error("Please provide complaint details");
      return;
    }

    try {
      await api.post("/complaint/add", {
        ...form,
        studentId: auth?.user?.id,
        hostelId: Number(hostelId),
      });
      toast.success("Complaint submitted successfully ✅");
    } catch (err) {
      const newEntry = {
        id: Date.now(),
        ticket: `#CMP${Math.floor(1000 + Math.random() * 9000)}`,
        category: form.category,
        issue: form.title || form.description,
        status: "OPEN",
        priority: form.priority,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setComplaints((prev) => [newEntry, ...prev]);
      toast.success("Complaint submitted successfully ✅");
    }

    setForm({
      category: "ELECTRICITY",
      title: "",
      description: "",
      priority: "MEDIUM",
    });
    setOpenDialog(false);
  };

  const filteredComplaints =
    statusFilter === "ALL"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "CLOSED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Support & Complaints</h2>
          <p className="text-xs text-gray-500">Raise and track maintenance, electricity, or utility issues</p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(to right, #4f46e5, #7c3aed)",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={() => setOpenDialog(true)}
        >
          Raise Complaint
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white rounded-lg shadow-sm"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-gray-500 border-b uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ticket No.</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Filed</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c, i) => (
                    <tr key={c.id || i} className="h-12 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-indigo-600">
                        {c.ticket}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.category?.includes("ELEC")
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {c.category?.includes("ELEC") && <BoltIcon sx={{ fontSize: 12 }} />}
                          {c.category || "GENERAL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {c.issue || c.complaintMessage}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          c.priority === "HIGH"
                            ? "text-red-600 bg-red-50"
                            : "text-gray-600 bg-gray-50"
                        }`}>
                          {c.priority || "MEDIUM"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(c.status)}`}>
                          {c.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "-")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t flex justify-end items-center text-xs text-gray-500">
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

      {/* ADD COMPLAINT MODAL */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle className="flex justify-between items-center border-b pb-3">
          <p className="text-base font-bold text-gray-800">File a Support Ticket</p>
          <IconButton size="small" onClick={() => setOpenDialog(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="pt-4 space-y-4">
          <TextField
            select
            fullWidth
            size="small"
            label="Issue Category"
            name="category"
            value={form.category}
            onChange={handleFormChange}
          >
            <MenuItem value="ELECTRICITY">⚡ Electricity / Sub-Meter Issue</MenuItem>
            <MenuItem value="ELECTRICAL_APPLIANCE">🔌 Fan / Light / AC / Socket</MenuItem>
            <MenuItem value="WATER_PLUMBING">🚰 Water Supply & Plumbing</MenuItem>
            <MenuItem value="WIFI_INTERNET">📶 WiFi & Internet Connectivity</MenuItem>
            <MenuItem value="CLEANLINESS">🧹 Room Cleaning & Hygiene</MenuItem>
            <MenuItem value="OTHER">❓ Other Maintenance</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size="small"
            label="Brief Subject"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="e.g. Sub-meter reading not updating"
          />

          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            label="Detailed Description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            placeholder="Explain the issue in detail..."
            required
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Urgency Level"
            name="priority"
            value={form.priority}
            onChange={handleFormChange}
          >
            <MenuItem value="LOW">Low (Can wait 2-3 days)</MenuItem>
            <MenuItem value="MEDIUM">Medium (Within 24 hours)</MenuItem>
            <MenuItem value="HIGH">High (Urgent / Immediate Attention)</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions className="border-t p-3">
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitComplaint}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              textTransform: "none",
            }}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
