import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";
import useFormValidation from "../../hooks/FormValidation";
import { validateRoom } from "../../validations/ValidateRoom";
import { getHostelsData } from "../../utils/auth";
import { useApp } from "../../context/AppContext";

export default function AddRoomDrawer({
  open,
  onClose,
  onSave,
  editData,
  mode = "add",
}) {
  const { t, tDb, lang } = useApp();
  const { hostelId } = getHostelsData();

  const {
    values: form,
    errors,
    handleChange,
    validateAll,
    resetForm,
    setValues,
  } = useFormValidation(
    {
      roomNumber: "",
      capacity: "",
      occupied: 0,
      status: "AVAILABLE",
      meterNumber: "",
      initialMeterReading: "",
    },
    validateRoom,
  );

  // Prefill edit
  useEffect(() => {
    if (editData) {
      setValues({
        roomNumber: editData?.roomNumber?.replace("R-", "") || editData?.roomNo?.replace("R-", "") || "",
        capacity: editData?.capacity || "",
        occupied: editData?.occupied || 0,
        status: editData?.status || "AVAILABLE",
        meterNumber: editData?.meterNumber || "",
        initialMeterReading: editData?.lastMeterReading || editData?.initialMeterReading || "",
      });
    } else {
      resetForm();
    }
  }, [editData, open]);

  const handleSubmit = () => {
    if (!validateAll()) return;

    let payload = {
      roomNumber: form.roomNumber.startsWith("R-") ? form.roomNumber : `R-${form.roomNumber}`,
      capacity: Number(form.capacity),
      occupied: Number(form.occupied),
      status: form.status,
      meterNumber: form.meterNumber || undefined,
      initialMeterReading: form.initialMeterReading ? Number(form.initialMeterReading) : undefined,
      lastMeterReading: form.initialMeterReading ? Number(form.initialMeterReading) : undefined,
      hostelId: Number(hostelId),
    };

    if (mode === "edit" && editData?.id) {
      payload.id = editData.id;
    }

    onSave(payload);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 440 }} className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-800 bg-white dark:bg-slate-900">
          <div>
            <Typography variant="h6" fontWeight={700} className="text-gray-800 dark:text-gray-100">
              {mode === "edit" ? (lang === "hi" ? "कमरा विवरण बदलें" : "Edit Room") : t("addRoom")}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {t("roomsSubtitle")}
            </Typography>
          </div>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <TextField
            fullWidth
            size="small"
            label={`${t("roomNumber")} (e.g. 101, 204)`}
            name="roomNumber"
            value={form.roomNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*$/.test(value) && value.length <= 4) {
                handleChange(e);
              }
            }}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber || (lang === "hi" ? "यह स्वतः R-xxx बनेगा" : "Will be prefixed as R-xxx")}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              size="small"
              type="number"
              label={`${t("capacity")} (${t("beds")})`}
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
            />

            <TextField
              fullWidth
              size="small"
              type="number"
              label={t("occupied")}
              name="occupied"
              value={form.occupied}
              onChange={handleChange}
              disabled={mode === "edit"}
              error={!!errors.occupied}
              helperText={errors.occupied}
            />
          </div>

          <TextField
            select
            fullWidth
            size="small"
            label={t("status")}
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={mode === "edit"}
            error={!!errors.status}
            helperText={errors.status}
          >
            <MenuItem value="AVAILABLE">{tDb("AVAILABLE", lang)}</MenuItem>
            <MenuItem value="FULL">{tDb("FULL", lang)}</MenuItem>
          </TextField>

          {/* Sub-meter details */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
              <BoltIcon fontSize="small" className="text-amber-600" />
              <span>{t("electricitySubmeter")}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                fullWidth
                size="small"
                label={t("meterSerial")}
                name="meterNumber"
                value={form.meterNumber || ""}
                onChange={handleChange}
                placeholder="e.g. MTR-204"
              />

              <TextField
                fullWidth
                size="small"
                type="number"
                label={t("initialMeterReading")}
                name="initialMeterReading"
                value={form.initialMeterReading || ""}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-slate-900 flex gap-3">
          <Button variant="outlined" fullWidth onClick={onClose}>
            {t("cancel")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {mode === "edit" ? t("update") : t("save")}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
