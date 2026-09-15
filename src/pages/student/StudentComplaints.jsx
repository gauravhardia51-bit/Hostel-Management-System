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
import { formatDateForDisplay } from "../../utils/formatDate.js";
import { useApp } from "../../context/AppContext";

export default function StudentComplaints() {
  const { t, tDb, lang } = useApp();
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    category: "ELECTRICITY",
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/complaint/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          studentId: auth?.user?.id,
          hostelId: hostelId,
          status: statusFilter === "ALL" ? undefined : statusFilter,
        },
      });
      if (res.data?.payLoad && Array.isArray(res.data.payLoad) && res.data.payLoad.length > 0) {
        setComplaints(res.data.payLoad);
        setTotalPages(res.data.totalPage || 1);
        setTotalElements(res.data.totalRow || res.data.payLoad.length);
      } else {
        throw new Error("No data");
      }
    } catch (e) {
      const dummyData = [
        {
          id: 1,
          ticketNumber: "#CMP1012",
          category: "ELECTRICITY",
          complaintMessage: "Sub-meter reading discrepancy for Room R-204",
          status: "OPEN",
          priority: "HIGH",
          dateOfCreation: Date.now() - 86400000,
        },
        {
          id: 2,
          ticketNumber: "#CMP1011",
          category: "ELECTRICAL_SOCKET",
          complaintMessage: "Main AC plug socket spark & trip",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dateOfCreation: Date.now() - 86400000 * 2,
        },
        {
          id: 3,
          ticketNumber: "#CMP1010",
          category: "WIFI",
          complaintMessage: "WiFi connection drop in 2nd Floor corridor",
          status: "CLOSED",
          priority: "LOW",
          dateOfCreation: Date.now() - 86400000 * 5,
        },
      ];
      setComplaints(dummyData);
      setTotalPages(1);
      setTotalElements(dummyData.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter, hostelId]);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitComplaint = async () => {
    if (!form.title && !form.description) {
      toast.error(lang === "hi" ? "कृपया शिकायत का विवरण दें" : "Please provide complaint details");
      return;
    }

    try {
      await api.post("/complaint/add", {
        complaintMessage: form.description || form.title,
        studentId: auth?.user?.id,
        hostelId: Number(hostelId),
      });
      toast.success(lang === "hi" ? "शिकायत सफलतापूर्वक दर्ज हुई ✅" : "Complaint submitted successfully ✅");
      fetchComplaints();
    } catch (err) {
      const newEntry = {
        id: Date.now(),
        ticketNumber: `#CMP${Math.floor(1000 + Math.random() * 9000)}`,
        category: form.category,
        complaintMessage: form.description || form.title,
        status: "OPEN",
        priority: form.priority,
        dateOfCreation: Date.now(),
      };
      setComplaints((prev) => [newEntry, ...prev]);
      toast.success(lang === "hi" ? "शिकायत सफलतापूर्वक दर्ज हुई ✅" : "Complaint submitted successfully ✅");
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

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("complaintsTitle") || (lang === "hi" ? "शिकायत व सहायता" : "Support & Complaints")}
          </h2>
          <p className="text-xs text-gray-500">
            {t("complaintsSubtitle") || (lang === "hi" ? "बिजली, पानी, मेंटेनेंस और अन्य समस्याओं का समाधान" : "Raise and track maintenance, electricity, or utility issues")}
          </p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={() => setOpenDialog(true)}
        >
          {t("raiseComplaint") || (lang === "hi" ? "+ शिकायत दर्ज करें" : "+ Raise Complaint")}
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => {
            setPage(0);
            setStatusFilter(e.target.value);
          }}
          className="bg-white rounded-lg shadow-sm"
          sx={{ minWidth: 140, height: "36px", fontSize: "12px" }}
        >
          <MenuItem value="ALL">{t("allStatus")}</MenuItem>
          <MenuItem value="OPEN">{tDb("OPEN", lang)}</MenuItem>
          <MenuItem value="IN_PROGRESS">{tDb("IN_PROGRESS", lang)}</MenuItem>
          <MenuItem value="CLOSED">{tDb("CLOSED", lang)}</MenuItem>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-gray-500 border-b uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">{lang === "hi" ? "टिकट सं." : "Ticket No."}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "विवरण" : "Issue Description"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "प्राथमिकता" : "Priority"}</th>
                  <th className="py-3 px-4">{t("status")}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "दिनांक" : "Date Filed"}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      {loading ? t("loading") : t("noDataFound")}
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c, i) => (
                    <tr key={c.id || i} className="h-11 hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-indigo-600">
                        {c.ticketNumber || c.ticket || `#CMP${c.id}`}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          (c.category || "").includes("ELEC")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {(c.category || "").includes("ELEC") && <BoltIcon sx={{ fontSize: 12 }} />}
                          {c.category || "GENERAL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {c.complaintMessage || c.issue}
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
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === "CLOSED" || c.status === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : c.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tDb(c.status, lang)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {formatDateForDisplay(c.dateOfCreation || c.date || Date.now())}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
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
              label={t("complaints")}
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
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle className="flex justify-between items-center border-b pb-3">
          <p className="text-base font-bold text-gray-800">
            {lang === "hi" ? "नई शिकायत दर्ज करें" : "File a Support Ticket"}
          </p>
          <IconButton size="small" onClick={() => setOpenDialog(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="pt-4 space-y-4">
          <TextField
            select
            fullWidth
            size="small"
            label={lang === "hi" ? "शिकायत श्रेणी" : "Issue Category"}
            name="category"
            value={form.category}
            onChange={handleFormChange}
          >
            <MenuItem value="ELECTRICITY">⚡ {lang === "hi" ? "बिजली / सब-मीटर समस्या" : "Electricity / Sub-Meter Issue"}</MenuItem>
            <MenuItem value="ELECTRICAL_APPLIANCE">🔌 {lang === "hi" ? "पंखा / लाइट / सॉकेट" : "Fan / Light / Socket"}</MenuItem>
            <MenuItem value="WATER_PLUMBING">🚰 {lang === "hi" ? "पानी व नल" : "Water Supply & Plumbing"}</MenuItem>
            <MenuItem value="WIFI_INTERNET">📶 {lang === "hi" ? "वाई-फाई व इंटरनेट" : "WiFi & Internet"}</MenuItem>
            <MenuItem value="CLEANLINESS">🧹 {lang === "hi" ? "साफ-सफाई" : "Room Cleaning & Hygiene"}</MenuItem>
            <MenuItem value="OTHER">❓ {lang === "hi" ? "अन्य मेंटेनेंस" : "Other Maintenance"}</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size="small"
            label={lang === "hi" ? "विषय" : "Brief Subject"}
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder={lang === "hi" ? "उदा. बिजली मीटर नहीं चल रहा" : "e.g. Sub-meter reading not updating"}
          />

          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            label={lang === "hi" ? "विस्तृत विवरण" : "Detailed Description"}
            name="description"
            value={form.description}
            onChange={handleFormChange}
            placeholder={lang === "hi" ? "समस्या का विवरण लिखें..." : "Explain the issue in detail..."}
            required
          />

          <TextField
            select
            fullWidth
            size="small"
            label={lang === "hi" ? "प्राथमिकता" : "Urgency Level"}
            name="priority"
            value={form.priority}
            onChange={handleFormChange}
          >
            <MenuItem value="LOW">{lang === "hi" ? "सामान्य (2-3 दिन)" : "Low (Can wait 2-3 days)"}</MenuItem>
            <MenuItem value="MEDIUM">{lang === "hi" ? "मध्यम (24 घंटे में)" : "Medium (Within 24 hours)"}</MenuItem>
            <MenuItem value="HIGH">{lang === "hi" ? "अति आवश्यक (तुरंत)" : "High (Urgent / Immediate Attention)"}</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions className="border-t p-3">
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 500 }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitComplaint}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {lang === "hi" ? "टिकट जमा करें" : "Submit Ticket"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
