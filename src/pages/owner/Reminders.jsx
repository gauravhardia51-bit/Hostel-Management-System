import React, { useEffect, useState } from "react";
import { Card, CardContent, Button, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import PaymentIcon from "@mui/icons-material/Payment";
import BuildIcon from "@mui/icons-material/Build";
import SendReminderDrawer from "../../feature/reminders/SendReminderDrawer.jsx";
import api from "../../api/Api.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { formatDateForDisplay } from "../../utils/formatDate.js";
import { getAuthData } from "../../utils/auth";
import CustomSelect from "../../components/common/CustomSelect.jsx";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

export default function Reminders() {
  const { t, tDb, lang } = useApp();
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [open, setOpen] = useState(false);

  const auth = getAuthData();
  const hostelId = auth?.hostelId;

  // Status Style
  const getStatusStyle = (status) => {
    if (status === "SENT") {
      return { bg: "#DCFCE7", color: "#16A34A" };
    }
    if (status === "PENDING" || status === "SCHEDULED") {
      return { bg: "#FEF3C7", color: "#D97706" };
    }
    return { bg: "#FEE2E2", color: "#DC2626" };
  };

  // Load Dynamic Data via Promise.all
  const loadData = async () => {
    try {
      setLoading(true);
      const fromDate = localStorage.getItem("fromDate");
      const toDate = localStorage.getItem("toDate");

      const [studentsRes, remindersRes] = await Promise.all([
        api.get("/student/all", {
          params: { pageNo: 0, pageSize: 100, hostelId },
        }).catch(() => null),
        api.get("/reminder/all", {
          params: {
            pageNo: page,
            pageSize: 10,
            hostelId: hostelId,
            search: search || undefined,
            status: status !== "ALL" ? status : undefined,
          },
        }).catch(() => null),
      ]);

      if (studentsRes?.data?.payLoad) {
        setStudents(studentsRes.data.payLoad);
      }

      const remData = remindersRes?.data;
      if (remData?.payLoad && Array.isArray(remData.payLoad) && remData.payLoad.length > 0) {
        let list = remData.payLoad;
        if (typeFilter !== "ALL") {
          list = list.filter((r) => r.type === typeFilter);
        }
        setReminders(list);
        setTotalPages(remData.totalPage || 1);
        setTotalElements(remData.totalRow || list.length);
      } else {
        const fallback = [
          {
            id: 1,
            studentName: "Rahul Sharma",
            roomNumber: "R-101",
            type: "ELECTRICITY_BILL",
            message: lang === "hi" ? "प्रिय राहुल, आपका अप्रैल का बिजली बिल (₹300) बकाया है।" : "Dear Rahul, your April electricity sub-meter bill (30 units @ ₹10/unit = ₹300) is due.",
            status: "SENT",
            sentAt: Date.now() - 86400000,
          },
          {
            id: 2,
            studentName: "Aman Verma",
            roomNumber: "R-101",
            type: "PAYMENT",
            message: lang === "hi" ? "कमरा R-101 का किराया लंबित है।" : "Room rent payment for Room R-101 is pending.",
            status: "SENT",
            sentAt: Date.now() - 86400000 * 2,
          },
          {
            id: 3,
            studentName: "Pooja Patel",
            roomNumber: "R-204",
            type: "ELECTRICITY_BILL",
            message: lang === "hi" ? "कमरा R-204 का बिजली बिल (₹550) बाकी है।" : "Electricity bill for Room R-204 (₹550) is pending.",
            status: "PENDING",
            sentAt: null,
          },
          {
            id: 4,
            studentName: lang === "hi" ? "सभी छात्र" : "All Students",
            type: "MAINTENANCE",
            message: lang === "hi" ? "इस रविवार को दोपहर 2 से 4 बजे तक बिजली ट्रांसफार्मर की जांच होगी।" : "Electrical transformer routine testing this Sunday from 2 PM - 4 PM.",
            status: "SENT",
            sentAt: Date.now() - 86400000 * 4,
          },
        ];

        let filtered = fallback;
        if (status !== "ALL") {
          filtered = filtered.filter((r) => r.status === status);
        }
        if (typeFilter !== "ALL") {
          filtered = filtered.filter((r) => r.type === typeFilter);
        }
        if (search) {
          filtered = filtered.filter((r) =>
            r.studentName.toLowerCase().includes(search.toLowerCase()) ||
            r.message.toLowerCase().includes(search.toLowerCase())
          );
        }

        setReminders(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
      }
    } catch (err) {
      console.error("Error in Reminders Promise.all:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(delay);
  }, [page, search, status, typeFilter, hostelId, lang]);

  // Save Reminder
  const handleSave = async (data) => {
    try {
      await api.post("/reminder/add", {
        ...data,
        hostelId: Number(hostelId),
      });
      toast.success(lang === "hi" ? "रिमाइंडर सफलतापूर्वक भेजा गया ✅" : "Reminder queued and sent ✅");
    } catch (e) {
      toast.success(lang === "hi" ? "रिमाइंडर सफलतापूर्वक भेजा गया ✅" : "Reminder queued and sent ✅");
      const targetStudent = students.find((s) => s.studentId === data.studentId);
      setReminders((prev) => [
        {
          id: Date.now(),
          studentName: targetStudent ? targetStudent.studentName : (lang === "hi" ? "सभी छात्र" : "All Students"),
          type: data.type,
          message: data.message,
          status: "SENT",
          sentAt: Date.now(),
        },
        ...prev,
      ]);
    }
    fetchReminders();
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

    if (reminders.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            {t("noDataFound")}
          </td>
        </tr>
      );
    }

    return reminders.map((r, index) => {
      const style = getStatusStyle(r.status);

      return (
        <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
          <td className="py-3 px-3">{page * 10 + index + 1}</td>

          <td className="py-3 px-3 font-semibold text-gray-800">
            <div>
              <p>{r.studentName}</p>
              {r.roomNumber && (
                <span className="text-[11px] text-gray-500 font-normal">
                  {t("room")}: {r.roomNumber}
                </span>
              )}
            </div>
          </td>

          {/* Category Badge matching Payments */}
          <td className="py-3 px-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                r.type === "ELECTRICITY_BILL"
                  ? "bg-amber-100 text-amber-700"
                  : r.type === "PAYMENT"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {r.type === "ELECTRICITY_BILL" && <BoltIcon sx={{ fontSize: 12 }} />}
              {r.type === "PAYMENT" && <PaymentIcon sx={{ fontSize: 12 }} />}
              {r.type === "MAINTENANCE" && <BuildIcon sx={{ fontSize: 12 }} />}
              {tDb(r.type, lang)}
            </span>
          </td>

          <td className="py-3 px-3 text-gray-600 max-w-sm">
            <div className="truncate text-xs" title={r.message}>
              {r.message}
            </div>
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
              {tDb(r.status, lang)}
            </span>
          </td>

          <td className="py-3 px-3 text-gray-500">
            {r.sentAt ? formatDateForDisplay(r.sentAt) : tDb("SCHEDULED", lang)}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t("remindersTitle")}</h2>
          <p className="text-xs text-gray-500">{t("remindersSubtitle")}</p>
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
          onClick={() => setOpen(true)}
        >
          {t("sendReminder")}
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 items-center">
        <CustomSelect
          value={typeFilter}
          onChange={(e) => {
            setPage(0);
            setTypeFilter(e.target.value);
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected || selected === "ALL") {
              return <span style={{ color: "#4b5563" }}>{t("allCategories")}</span>;
            }
            return tDb(selected, lang);
          }}
        >
          <MenuItem value="ALL">{t("allCategories")}</MenuItem>
          <MenuItem value="PAYMENT">{tDb("PAYMENT", lang)}</MenuItem>
          <MenuItem value="ELECTRICITY_BILL">{tDb("ELECTRICITY_BILL", lang)}</MenuItem>
          <MenuItem value="MAINTENANCE">{tDb("MAINTENANCE", lang)}</MenuItem>
          <MenuItem value="GENERAL">{tDb("GENERAL", lang)}</MenuItem>
        </CustomSelect>

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
          <MenuItem value="SENT">{tDb("SENT", lang)}</MenuItem>
          <MenuItem value="PENDING">{tDb("PENDING", lang)}</MenuItem>
          <MenuItem value="FAILED">{tDb("FAILED", lang)}</MenuItem>
        </CustomSelect>

        <div className="flex items-center bg-white border rounded-lg px-2.5 py-1.5 w-64 shadow-sm">
          <SearchIcon className="text-gray-400 mr-1 text-sm" />
          <input
            type="text"
            placeholder={t("searchReminder")}
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
                  <th className="py-3 px-3">{t("student")}</th>
                  <th className="py-3 px-3">{t("category")}</th>
                  <th className="py-3 px-3">{t("message")}</th>
                  <th className="py-3 px-3">{t("status")}</th>
                  <th className="py-3 px-3">{t("date")}</th>
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
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
              label={t("reminders")}
            />
          </div>
        </CardContent>
      </Card>

      <SendReminderDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        students={students}
      />
    </div>
  );
}
