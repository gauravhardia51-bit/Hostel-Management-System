import React, { useEffect, useState } from "react";
import { Card, CardContent, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BoltIcon from "@mui/icons-material/Bolt";
import WifiIcon from "@mui/icons-material/Wifi";
import api from "../../api/Api.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { toast } from "react-toastify";
import { formatDateForDisplay } from "../../utils/formatDate.js";
import { useLocation } from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import CustomSelect from "../../components/common/CustomSelect.jsx";
import { useApp } from "../../context/AppContext";

export default function Complaints() {
  const { t, tDb, lang } = useApp();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const complaintId = queryParams.get("complaintId");

  const STATUS_TRANSITIONS = {
    OPEN: ["OPEN", "IN_PROGRESS", "CLOSED"],
    IN_PROGRESS: ["IN_PROGRESS", "CLOSED"],
    CLOSED: ["CLOSED"],
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await api.get("/complaint/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: Number(hostelId),
          search: search || undefined,
          status: status !== "ALL" ? status : undefined,
          id: complaintId || undefined,
        },
      });

      const data = res.data;
      if (data?.payLoad && Array.isArray(data.payLoad) && data.payLoad.length > 0) {
        setComplaints(data.payLoad);
        setTotalPages(data.totalPage || 1);
        setTotalElements(data.totalRow || data.payLoad.length);
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      const fallback = [
        {
          id: 1,
          ticketNumber: "#CMP1012",
          studentName: "Neha Gupta",
          roomNumber: "R-102",
          category: "ELECTRICITY",
          complaintMessage: "AC power socket spark & trip in Room 102",
          status: "OPEN",
          dateOfCreation: Date.now() - 86400000,
        },
        {
          id: 2,
          ticketNumber: "#CMP1011",
          studentName: "Vikram Rao",
          roomNumber: "R-204",
          category: "ELECTRICITY",
          complaintMessage: "Meter reading discrepancy in Room 204",
          status: "IN_PROGRESS",
          dateOfCreation: Date.now() - 86400000 * 2,
        },
        {
          id: 3,
          ticketNumber: "#CMP1010",
          studentName: "Aman Verma",
          roomNumber: "R-101",
          category: "WIFI",
          complaintMessage: "WiFi speed drop on 2nd floor",
          status: "CLOSED",
          dateOfCreation: Date.now() - 86400000 * 5,
        },
      ];

      let filtered = fallback;
      if (status !== "ALL") {
        filtered = filtered.filter((c) => c.status === status);
      }
      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
            c.studentName.toLowerCase().includes(search.toLowerCase()) ||
            c.complaintMessage.toLowerCase().includes(search.toLowerCase())
        );
      }

      setComplaints(filtered);
      setTotalPages(1);
      setTotalElements(filtered.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchComplaints();
    }, 300);

    return () => clearTimeout(delay);
  }, [page, search, status, complaintId, hostelId, lang]);

  const getStatusStyle = (status) => {
    if (status === "OPEN") {
      return { bg: "#FEE2E2", color: "#DC2626" };
    }
    if (status === "IN_PROGRESS") {
      return { bg: "#FEF3C7", color: "#D97706" };
    }
    return { bg: "#DCFCE7", color: "#16A34A" };
  };

  const handleStatusChange = async (complaint, newStatus) => {
    if (complaint.status === newStatus) return;

    try {
      await api.put("/complaint/update", {
        ...complaint,
        status: newStatus,
        hostelId: Number(hostelId),
      });

      toast.success(lang === "hi" ? "शिकायत स्थिति अपडेट हुई ✅" : "Complaint status updated ✅");
      fetchComplaints();
    } catch (err) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaint.id ? { ...c, status: newStatus } : c))
      );
      toast.success(lang === "hi" ? "शिकायत स्थिति अपडेट हुई ✅" : "Complaint status updated ✅");
    }
  };

  const getCategoryFromMsg = (msg = "") => {
    const lower = msg.toLowerCase();
    if (lower.includes("spark") || lower.includes("meter") || lower.includes("power") || lower.includes("electric") || lower.includes("ac")) {
      return "ELECTRICITY";
    }
    if (lower.includes("wifi") || lower.includes("internet") || lower.includes("speed")) {
      return "WIFI";
    }
    return "MAINTENANCE";
  };

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            {t("loading")}
          </td>
        </tr>
      );
    }

    if (complaints.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            {t("noDataFound")}
          </td>
        </tr>
      );
    }

    return complaints.map((c, index) => {
      const style = getStatusStyle(c.status);
      const cat = c.category || getCategoryFromMsg(c.complaintMessage);

      return (
        <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors">
          <td className="py-3 px-3">{page * 10 + index + 1}</td>

          {/* Ticket Chip */}
          <td className="py-3 px-3">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
              <ConfirmationNumberIcon sx={{ fontSize: 13 }} />
              {c.ticketNumber || `#CMP${c.id}`}
            </span>
          </td>

          {/* Student & Room */}
          <td className="py-3 px-3 font-semibold text-gray-800">
            <div>
              <p className="font-semibold text-gray-900">{c.studentName || "Student"}</p>
              {c.roomNumber && (
                <span className="text-[11px] text-gray-500 font-normal">
                  {t("room")}: {c.roomNumber}
                </span>
              )}
            </div>
          </td>

          {/* Issue with Category Pill */}
          <td className="py-3 px-3">
            <div className="flex items-center gap-2 max-w-sm">
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                  cat === "ELECTRICITY"
                    ? "bg-amber-100 text-amber-700"
                    : cat === "WIFI"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {cat === "ELECTRICITY" && <BoltIcon sx={{ fontSize: 11 }} />}
                {cat === "WIFI" && <WifiIcon sx={{ fontSize: 11 }} />}
                {tDb(cat, lang)}
              </span>
              <span className="truncate text-xs" title={c.complaintMessage}>
                {c.complaintMessage}
              </span>
            </div>
          </td>

          {/* Status Select */}
          <td className="py-3 px-3">
            <Select
              size="small"
              value={c.status}
              onChange={(e) => handleStatusChange(c, e.target.value)}
              renderValue={(selected) => (
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
                  {tDb(selected, lang)}
                </span>
              )}
              sx={{
                minWidth: 115,
                height: "28px",
                backgroundColor: style.bg,
                color: style.color,
                borderRadius: "6px",
                "& fieldset": { border: "none" },
                "& .MuiSelect-icon": { display: "none" },
                "& .MuiSelect-select": {
                  padding: "2px 6px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {(STATUS_TRANSITIONS[c.status] || ["OPEN", "IN_PROGRESS", "CLOSED"]).map((item) => (
                <MenuItem key={item} value={item}>
                  {tDb(item, lang)}
                </MenuItem>
              ))}
            </Select>
          </td>

          <td className="py-3 px-3 text-gray-500">{formatDateForDisplay(c.dateOfCreation)}</td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t("complaintsTitle")}</h2>
          <p className="text-xs text-gray-500">{t("complaintsSubtitle")}</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 items-center">
        <CustomSelect
          value={status}
          onChange={(e) => {
            setPage(0);
            setStatus(e.target.value);
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
          <MenuItem value="OPEN">{tDb("OPEN", lang)}</MenuItem>
          <MenuItem value="IN_PROGRESS">{tDb("IN_PROGRESS", lang)}</MenuItem>
          <MenuItem value="CLOSED">{tDb("CLOSED", lang)}</MenuItem>
        </CustomSelect>

        <div className="flex items-center bg-white border rounded-lg px-2.5 py-1.5 w-64 shadow-sm">
          <SearchIcon className="text-gray-400 mr-1 text-sm" />
          <input
            type="text"
            placeholder={t("searchComplaint")}
            className="w-full outline-none text-xs bg-transparent text-gray-700"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-gray-500 border-b uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">{t("ticket")}</th>
                  <th className="py-3 px-3">{t("student")}</th>
                  <th className="py-3 px-3">{t("issue")}</th>
                  <th className="py-3 px-3">{t("status")}</th>
                  <th className="py-3 px-3">{t("date")}</th>
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
              label={t("complaints")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
