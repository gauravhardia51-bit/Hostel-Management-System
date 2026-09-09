import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../../context/AppContext";

export default function SendReminderDrawer({
  open,
  onClose,
  onSave,
  students = [],
}) {
  const { t, tDb, lang } = useApp();
  const [form, setForm] = useState({
    studentId: "",
    type: "PAYMENT", // PAYMENT | ELECTRICITY_BILL | GENERAL | MAINTENANCE
    message: "",
    scheduledAt: "",
  });

  const messageTemplates = {
    PAYMENT:
      lang === "hi"
        ? "नमस्ते, यह एक रिमाइंडर है कि आपके कमरे का किराया देय है। कृपया समय पर भुगतान करें।"
        : "Dear Student, this is a friendly reminder that your monthly room rent payment is due. Kindly clear your dues on time.",
    ELECTRICITY_BILL:
      lang === "hi"
        ? "नमस्ते, आपके कमरे का बिजली बिल (सब-मीटर) तैयार है। कृपया अपने पोर्टल में बिल देखकर भुगतान करें।"
        : "Dear Student, your monthly electricity sub-meter bill has been calculated. Please check your Student Portal and clear your electricity dues.",
    GENERAL:
      lang === "hi"
        ? "हॉस्टल के सभी छात्रों के लिए महत्वपूर्ण सूचना।"
        : "Important notification for all hostel residents regarding hostel rules and timings.",
    MAINTENANCE:
      lang === "hi"
        ? "सूचना: इस सप्ताहांत हॉस्टल में आवश्यक बिजली और प्लंबिंग रखरखाव कार्य किया जाएगा।"
        : "Notice: Scheduled electrical and plumbing maintenance will be carried out this weekend.",
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setForm((prev) => ({
      ...prev,
      type: selectedType,
      message: messageTemplates[selectedType] || prev.message,
    }));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (open && !form.message) {
      setForm((prev) => ({
        ...prev,
        message: messageTemplates.PAYMENT,
      }));
    }
  }, [open, lang]);

  const handleSubmit = () => {
    onSave(form);
    setForm({
      studentId: "",
      type: "PAYMENT",
      message: "",
      scheduledAt: "",
    });
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 450,
          },
        },
      }}
    >
      <Box className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-slate-900 p-5">
          <div>
            <Typography variant="h6" fontWeight={700} className="text-gray-800 dark:text-gray-100">
              {t("sendReminder")}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {t("remindersSubtitle")}
            </Typography>
          </div>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Student */}
          <TextField
            select
            fullWidth
            size="small"
            label={lang === "hi" ? "छात्र चुनें / सामूहिक" : "Select Student / Broadcast"}
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            helperText={lang === "hi" ? "सभी छात्रों को भेजने के लिए खाली रखें" : "Leave unselected or choose All to broadcast"}
          >
            <MenuItem value="">📢 {lang === "hi" ? "हॉस्टल के सभी छात्र (Broadcast)" : "All Hostel Students (Broadcast)"}</MenuItem>
            {students.map((student) => (
              <MenuItem
                key={student.studentId || student.id}
                value={student.studentId || student.id}
              >
                {student.studentName || student.name} ({t("room")} {student.roomNumber || student.roomNo || "N/A"})
              </MenuItem>
            ))}
          </TextField>

          {/* Reminder Type */}
          <TextField
            select
            fullWidth
            size="small"
            label={t("category")}
            name="type"
            value={form.type}
            onChange={handleTypeChange}
          >
            <MenuItem value="PAYMENT">💳 {tDb("PAYMENT", lang)}</MenuItem>
            <MenuItem value="ELECTRICITY_BILL">⚡ {tDb("ELECTRICITY_BILL", lang)}</MenuItem>
            <MenuItem value="GENERAL">📢 {tDb("GENERAL", lang)}</MenuItem>
            <MenuItem value="MAINTENANCE">🔧 {tDb("MAINTENANCE", lang)}</MenuItem>
          </TextField>

          {/* Message */}
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            label={t("message")}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={lang === "hi" ? "रिमाइंडर संदेश लिखें..." : "Write reminder message..."}
            required
          />

          {/* Schedule Date */}
          <TextField
            fullWidth
            size="small"
            type="datetime-local"
            label={lang === "hi" ? "तय समय (वैकल्पिक)" : "Schedule Time (Optional)"}
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            helperText={lang === "hi" ? "तुरंत भेजने के लिए खाली छोड़ें" : "Leave empty to send immediately"}
          />
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-800 bg-white dark:bg-slate-900 p-4 flex gap-3">
          <Button variant="outlined" fullWidth onClick={onClose}>
            {t("cancel")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!form.message}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {t("send")}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
