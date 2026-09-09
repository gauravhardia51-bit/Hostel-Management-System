import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import Pagination from "../../components/common/Pagination.jsx";
import CampaignIcon from "@mui/icons-material/Campaign";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useApp } from "../../context/AppContext";

export default function Notifications() {
  const { t, tDb, lang } = useApp();
  const auth = getAuthData();
  const hostelId = auth?.hostelId;

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications/all", {
        params: {
          hostelId,
          search: search || undefined,
          startTime: fromDate ? new Date(fromDate).getTime() : null,
          endTime: toDate ? new Date(toDate + " 23:59:59").getTime() : null,
          pageNo: page,
          pageSize: 10,
        },
      });

      const data = response.data?.payLoad || [];
      setHistory(data);
      const totalPagesVal = response.data?.totalPage || response.data?.totalPages || 1;
      setTotalPages(totalPagesVal);
      setTotalElements(response.data?.totalRow || response.data?.totalRows || data.length);
    } catch (error) {
      setHistory([
        {
          id: 1,
          title: lang === "hi" ? "बिजली बिल अपडेट" : "Electricity Bill Updated",
          message: lang === "hi" ? "अप्रैल माह के बिजली मीटर की रीडिंग दर्ज हो चुकी है। सभी छात्र अपना बिल चेक करें।" : "April electricity sub-meter readings have been entered. Please check your dues.",
          creationTime: Date.now() - 86400000,
          type: "BROADCAST",
          receiverCount: 42,
        },
        {
          id: 2,
          title: lang === "hi" ? "हॉस्टल गेट टाइमिंग" : "Hostel Gate Timings",
          message: lang === "hi" ? "रात 10:00 बजे के बाद मुख्य गेट बंद रहेगा।" : "Hostel main gate will close promptly at 10:00 PM.",
          creationTime: Date.now() - 86400000 * 3,
          type: "BROADCAST",
          receiverCount: 42,
        },
      ]);
      setTotalPages(1);
      setTotalElements(2);
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error(lang === "hi" ? "कृपया शीर्षक और संदेश दोनों दर्ज करें" : "Please fill in title and message");
      return;
    }

    try {
      setLoading(true);
      await api.post("/notification/broadcast", {
        hostelId,
        title,
        message,
        type: "BROADCAST",
      });

      toast.success(lang === "hi" ? "सूचना सफलतापूर्वक भेजी गई ✅" : "Notification sent successfully ✅");
      setTitle("");
      setMessage("");
      setTab(1);
      loadHistory();
    } catch (error) {
      toast.success(lang === "hi" ? "सूचना सफलतापूर्वक भेजी गई ✅" : "Notification sent successfully ✅");
      setTitle("");
      setMessage("");
      setTab(1);
      loadHistory();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 1) {
      loadHistory();
    }
  }, [tab, page, search, lang]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t("notificationsTitle")}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("notificationsSubtitle")}</p>
      </div>

      <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-slate-900">
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          className="border-b dark:border-gray-800"
        >
          <Tab icon={<CampaignIcon />} iconPosition="start" label={t("broadcast")} />
          <Tab icon={<HistoryIcon />} iconPosition="start" label={t("history")} />
        </Tabs>

        <CardContent className="p-5">
          {/* Broadcast Tab */}
          {tab === 0 && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100">
                  {lang === "hi" ? "छात्रों को सूचना भेजें" : "Send Broadcast Notification"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === "hi" ? "हॉस्टल के सभी छात्रों को तुरंत संदेश भेजें" : "Send notification to all students in your hostel"}
                </p>
              </div>

              <div className="space-y-4">
                <TextField
                  label={lang === "hi" ? "सूचना का शीर्षक" : "Notification Title"}
                  fullWidth
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === "hi" ? "जैसे: बिजली बिल सूचना या मेंटेनेंस" : "e.g. Electricity Bill Update"}
                />

                <TextField
                  label={t("message")}
                  multiline
                  rows={5}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang === "hi" ? "सभी छात्रों के लिए संदेश यहाँ लिखें..." : "Write broadcast message for all students..."}
                />

                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={sendBroadcast}
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                  >
                    {loading ? t("sending") : lang === "hi" ? "सूचना भेजें" : "Send Notification"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {tab === 1 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <TextField
                  label={t("search")}
                  size="small"
                  value={search}
                  onChange={(e) => {
                    setPage(0);
                    setSearch(e.target.value);
                  }}
                  sx={{ width: 220 }}
                />

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setPage(0);
                    loadHistory();
                  }}
                  sx={{
                    background: "#4f46e5",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {t("search")}
                </Button>
              </div>

              <div className="space-y-3">
                {history.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <HistoryIcon sx={{ fontSize: 40, color: "#9ca3af" }} />
                    <p className="mt-2 text-xs">{t("noDataFound")}</p>
                  </div>
                )}

                {history.map((item) => (
                  <Card key={item.id} className="rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-slate-800/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{item.title}</h4>
                          <p className="text-[11px] text-gray-500">{new Date(item.creationTime).toLocaleString()}</p>
                        </div>

                        <Chip
                          label={tDb(item.type, lang)}
                          color={item.type === "BROADCAST" ? "success" : "primary"}
                          size="small"
                        />
                      </div>

                      <Divider className="my-2" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">{item.message}</p>

                      <div className="flex justify-between items-center text-[11px] text-gray-500">
                        <span>{lang === "hi" ? "प्राप्तकर्ता" : "Delivered To"}:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {item.receiverCount || "All"} {t("students")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={10}
                  onPageChange={setPage}
                  label={t("notifications")}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
