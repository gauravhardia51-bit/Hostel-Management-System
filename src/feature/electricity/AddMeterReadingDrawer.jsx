import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";
import { useApp } from "../../context/AppContext";

export default function AddMeterReadingDrawer({
  open,
  onClose,
  onSave,
  rooms = [],
  editData = null,
  defaultUnitRate = 10,
}) {
  const { t } = useApp();
  const currentMonthYear = new Date().toISOString().slice(0, 7);

  const [form, setForm] = useState({
    roomId: "",
    roomNumber: "",
    billingMonth: currentMonthYear,
    previousReading: "",
    currentReading: "",
    ratePerUnit: defaultUnitRate || 10,
    occupantCount: 1,
    generateInvoices: true,
  });

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        roomId: editData.roomId || "",
        roomNumber: editData.roomNumber || "",
        billingMonth: editData.billingMonth || currentMonthYear,
        previousReading:
          editData.previousReading !== undefined
            ? editData.previousReading
            : "",
        currentReading:
          editData.currentReading !== undefined ? editData.currentReading : "",
        ratePerUnit:
          editData.ratePerUnit !== undefined
            ? editData.ratePerUnit
            : defaultUnitRate || 10,
        occupantCount: editData.occupantCount || 1,
        generateInvoices: false,
      });
    } else {
      setForm({
        roomId: "",
        roomNumber: "",
        billingMonth: currentMonthYear,
        previousReading: "",
        currentReading: "",
        ratePerUnit: defaultUnitRate || 10,
        occupantCount: 1,
        generateInvoices: true,
      });
    }
  }, [editData, defaultUnitRate, open]);

  // Handle Room Selection
  const handleRoomChange = (e) => {
    const selectedRoomId = e.target.value;
    const selectedRoom = rooms.find(
      (r) => String(r.id) === String(selectedRoomId)
    );

    if (selectedRoom) {
      setForm((prev) => ({
        ...prev,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.roomNo || selectedRoom.roomNumber || "",
        previousReading:
          selectedRoom.lastMeterReading !== undefined
            ? selectedRoom.lastMeterReading
            : prev.previousReading || 0,
        occupantCount: Math.max(1, selectedRoom.occupied || 1),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        roomId: selectedRoomId,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const prevVal = parseFloat(form.previousReading) || 0;
  const currVal = parseFloat(form.currentReading) || 0;
  const rateVal = parseFloat(form.ratePerUnit) || 0;
  const occupants = parseInt(form.occupantCount, 10) || 1;

  const unitsConsumed = Math.max(0, currVal - prevVal);
  const totalAmount = Math.round(unitsConsumed * rateVal * 100) / 100;
  const perStudentAmount = Math.round((totalAmount / (occupants || 1)) * 100) / 100;

  const isValid =
    form.roomId &&
    form.currentReading !== "" &&
    currVal >= prevVal &&
    rateVal > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const payload = {
      ...form,
      previousReading: prevVal,
      currentReading: currVal,
      unitsConsumed: unitsConsumed,
      ratePerUnit: rateVal,
      totalAmount: totalAmount,
      occupantCount: occupants,
      perStudentAmount: perStudentAmount,
      recordedAt: Date.now(),
      status: "BILLED",
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
            sm: 420,
          },
        },
      }}
    >
      <Box className="h-full flex flex-col bg-slate-50">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
              <BoltIcon fontSize="small" />
            </div>
            <Typography variant="h6" fontWeight={700} fontSize={16}>
              {editData ? t("edit") : t("recordReading")}
            </Typography>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Room Selection */}
          <TextField
            select
            fullWidth
            size="small"
            label={t("selectRoom")}
            name="roomId"
            value={form.roomId}
            onChange={handleRoomChange}
            disabled={!!editData}
            required
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.roomNo || room.roomNumber} ({room.occupied || 0}/{room.capacity || 0} {t("occupied")})
              </MenuItem>
            ))}
          </TextField>

          {/* Billing Month */}
          <TextField
            fullWidth
            size="small"
            type="month"
            label={t("billingMonth")}
            name="billingMonth"
            value={form.billingMonth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Previous & Current Readings */}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t("previousReading")}
              name="previousReading"
              value={form.previousReading}
              onChange={handleChange}
              placeholder="e.g. 1200"
            />

            <TextField
              fullWidth
              size="small"
              type="number"
              label={t("currentReading")}
              name="currentReading"
              value={form.currentReading}
              onChange={handleChange}
              placeholder="e.g. 1260"
              error={currVal < prevVal && form.currentReading !== ""}
              helperText={currVal < prevVal && form.currentReading !== "" ? "≥ Prev" : ""}
              required
            />
          </div>

          {/* Rate Per Unit & Occupants */}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t("ratePerUnit")}
              name="ratePerUnit"
              value={form.ratePerUnit}
              onChange={handleChange}
              placeholder="10"
              required
            />

            <TextField
              fullWidth
              size="small"
              type="number"
              label={t("occupants")}
              name="occupantCount"
              value={form.occupantCount}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              required
            />
          </div>

          {/* Simple Calculation Summary Box */}
          <div className="p-3 bg-white rounded-lg border text-xs space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>{t("unitsConsumed")}:</span>
              <span className="font-bold text-gray-800">{unitsConsumed} Units</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>{t("roomTotalBill")}:</span>
              <span className="font-bold text-indigo-700">₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-600 border-t pt-1.5">
              <span>{t("perStudentShare")}:</span>
              <span className="font-bold text-green-600">₹{perStudentAmount} / {t("student")}</span>
            </div>
          </div>

          {/* Auto-generate Invoices Switch */}
          {!editData && (
            <div className="bg-white p-2.5 rounded-lg border text-xs">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.generateInvoices}
                    onChange={handleChange}
                    name="generateInvoices"
                    size="small"
                    color="primary"
                  />
                }
                label={<span className="text-xs text-gray-700">{t("autoCreatePayments")}</span>}
              />
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t bg-white p-3.5 flex gap-3">
          <Button variant="outlined" fullWidth onClick={onClose} size="small">
            {t("cancel")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!isValid}
            size="small"
            sx={{
              backgroundColor: "#4f46e5",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {editData ? t("update") : t("save")}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
