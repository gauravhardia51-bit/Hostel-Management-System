import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { getAuthData } from "../../utils/auth";
import { useApp } from "../../context/AppContext";

export default function AddPaymentDrawer({
  open,
  onClose,
  onSave,
  rooms = [], // students list
  editData, // single object
}) {
  const { t, tDb, lang } = useApp();
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const defaultRate = parseFloat(localStorage.getItem(`hostel_${hostelId}_unit_rate`)) || 10;

  const [form, setForm] = useState({
    studentId: "",
    paymentType: "COMBINED", // COMBINED | RENT | ELECTRICITY
    rentAmount: "",
    unitsConsumed: "",
    ratePerUnit: defaultRate,
    electricityAmount: "",
    amount: "", // Total Amount
    status: "PENDING",
    dueDate: "",
    paidAt: "",
    month: new Date().toLocaleString(lang === "hi" ? "hi-IN" : "en-US", { month: "long", year: "numeric" }),
  });

  // Populate form when editData changes
  useEffect(() => {
    if (editData) {
      const pType = editData.paymentType || "COMBINED";
      const rent = editData.rentAmount !== undefined ? editData.rentAmount : (editData.amount || "");
      const units = editData.unitsConsumed !== undefined ? editData.unitsConsumed : "";
      const rate = editData.ratePerUnit !== undefined ? editData.ratePerUnit : defaultRate;
      const elec = editData.electricityAmount !== undefined ? editData.electricityAmount : "";
      const total = editData.amount || editData.totalAmount || "";

      setForm({
        id: editData.id,
        studentId: editData.studentId || "",
        paymentType: pType,
        rentAmount: rent,
        unitsConsumed: units,
        ratePerUnit: rate,
        electricityAmount: elec,
        amount: total,
        status: editData.status || "PENDING",
        dueDate: editData.dueDate
          ? new Date(editData.dueDate).toISOString().split("T")[0]
          : "",
        paidAt:
          editData.paidAt && editData.paidAt !== 0
            ? new Date(editData.paidAt).toISOString().split("T")[0]
            : "",
        month: editData.month || new Date().toLocaleString(lang === "hi" ? "hi-IN" : "en-US", { month: "long", year: "numeric" }),
      });
    } else {
      setForm({
        studentId: "",
        paymentType: "COMBINED",
        rentAmount: "",
        unitsConsumed: "",
        ratePerUnit: defaultRate,
        electricityAmount: "",
        amount: "",
        status: "PENDING",
        dueDate: "",
        paidAt: "",
        month: new Date().toLocaleString(lang === "hi" ? "hi-IN" : "en-US", { month: "long", year: "numeric" }),
      });
    }
  }, [editData, defaultRate, open, lang]);

  // Recalculate totals when components change
  const handleTypeOrAmountChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      const rent = parseFloat(updated.rentAmount) || 0;
      const units = parseFloat(updated.unitsConsumed) || 0;
      const rate = parseFloat(updated.ratePerUnit) || defaultRate;

      let calcElec = parseFloat(updated.electricityAmount) || 0;
      if (name === "unitsConsumed" || name === "ratePerUnit") {
        calcElec = Math.round(units * rate * 100) / 100;
        updated.electricityAmount = calcElec > 0 ? calcElec : "";
      } else if (name === "electricityAmount") {
        calcElec = parseFloat(value) || 0;
      }

      let total = 0;
      if (updated.paymentType === "COMBINED") {
        total = rent + calcElec;
      } else if (updated.paymentType === "RENT") {
        total = rent;
      } else if (updated.paymentType === "ELECTRICITY") {
        total = calcElec;
      }

      if (name !== "amount") {
        updated.amount = total > 0 ? total : "";
      }

      return updated;
    });
  };

  // Submit
  const handleSubmit = () => {
    const payload = {
      ...form,
      studentId: Number(form.studentId),
      rentAmount: parseFloat(form.rentAmount) || 0,
      electricityAmount: parseFloat(form.electricityAmount) || 0,
      unitsConsumed: parseFloat(form.unitsConsumed) || 0,
      ratePerUnit: parseFloat(form.ratePerUnit) || defaultRate,
      amount: parseFloat(form.amount) || 0,
      totalAmount: parseFloat(form.amount) || 0,
      dueDate: form.dueDate ? new Date(form.dueDate).getTime() : null,
      paidAt: form.paidAt ? new Date(form.paidAt).getTime() : null,
    };

    onSave(payload);
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
            sm: 480,
          },
        },
      }}
    >
      <Box className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-slate-900 p-5">
          <div>
            <Typography variant="h6" fontWeight={700} className="text-gray-800 dark:text-gray-100">
              {editData ? (lang === "hi" ? "भुगतान विवरण बदलें" : "Edit Payment") : t("addPayment")}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {t("paymentsSubtitle")}
            </Typography>
          </div>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Student Dropdown */}
          <TextField
            select
            fullWidth
            size="small"
            label={lang === "hi" ? "छात्र चुनें" : "Select Student"}
            name="studentId"
            value={form.studentId}
            onChange={handleTypeOrAmountChange}
            required
          >
            {rooms.map((student) => (
              <MenuItem key={student.studentId || student.id} value={student.studentId || student.id}>
                {student.studentName || student.name} ({t("room")} {student.roomNo || student.roomNumber || "N/A"})
              </MenuItem>
            ))}
          </TextField>

          {/* Payment Type */}
          <TextField
            select
            fullWidth
            size="small"
            label={t("category")}
            name="paymentType"
            value={form.paymentType}
            onChange={handleTypeOrAmountChange}
          >
            <MenuItem value="COMBINED">{tDb("COMBINED", lang)}</MenuItem>
            <MenuItem value="RENT">{tDb("RENT", lang)}</MenuItem>
            <MenuItem value="ELECTRICITY">{tDb("ELECTRICITY", lang)}</MenuItem>
          </TextField>

          {/* Rent Section */}
          {(form.paymentType === "COMBINED" || form.paymentType === "RENT") && (
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                <HomeIcon fontSize="small" className="text-indigo-600 dark:text-indigo-400" />
                <span>{t("roomRent")}</span>
              </div>
              <TextField
                fullWidth
                size="small"
                type="number"
                label={`${t("roomRent")} (₹)`}
                name="rentAmount"
                value={form.rentAmount}
                onChange={handleTypeOrAmountChange}
                placeholder="e.g. 5000"
              />
            </div>
          )}

          {/* Electricity Section */}
          {(form.paymentType === "COMBINED" || form.paymentType === "ELECTRICITY") && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <BoltIcon fontSize="small" className="text-amber-600" />
                <span>{t("electricityBill")} (₹{form.ratePerUnit || 10}/{lang === "hi" ? "यूनिट" : "unit"})</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label={`${t("unitsConsumed")} (kWh)`}
                  name="unitsConsumed"
                  value={form.unitsConsumed}
                  onChange={handleTypeOrAmountChange}
                  placeholder="e.g. 40"
                  helperText={lang === "hi" ? "छात्र के हिस्से की यूनिट" : "Student's share of units"}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label={t("ratePerUnit")}
                  name="ratePerUnit"
                  value={form.ratePerUnit}
                  onChange={handleTypeOrAmountChange}
                  placeholder="10"
                />
              </div>

              <TextField
                fullWidth
                size="small"
                type="number"
                label={`${t("electricityBill")} (₹)`}
                name="electricityAmount"
                value={form.electricityAmount}
                onChange={handleTypeOrAmountChange}
                placeholder="e.g. 400"
              />
            </div>
          )}

          {/* Total Amount Summary */}
          <Card className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{t("totalPayable")}</p>
                  <p className="text-[10px] text-gray-500">
                    {form.paymentType === "COMBINED"
                      ? `${t("roomRent")} (₹${form.rentAmount || 0}) + ${t("electricityBill")} (₹${form.electricityAmount || 0})`
                      : tDb(form.paymentType, lang)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                    ₹{form.amount || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <TextField
            select
            fullWidth
            size="small"
            label={t("status")}
            name="status"
            value={form.status}
            onChange={handleTypeOrAmountChange}
          >
            <MenuItem value="PENDING">{tDb("PENDING", lang)}</MenuItem>
            <MenuItem value="PAID">{tDb("PAID", lang)}</MenuItem>
          </TextField>

          {/* Due Date & Paid Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("dueDate")}
              name="dueDate"
              value={form.dueDate}
              onChange={handleTypeOrAmountChange}
              InputLabelProps={{ shrink: true }}
            />

            {form.status === "PAID" && (
              <TextField
                fullWidth
                size="small"
                type="date"
                label={t("paidDate")}
                name="paidAt"
                value={form.paidAt}
                onChange={handleTypeOrAmountChange}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </div>
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
            disabled={!form.studentId || !form.amount}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {t("save")}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
