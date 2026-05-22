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

import useFormValidation from "../../hooks/FormValidation";
import { validateRoom } from "../../validations/ValidateRoom";
import { getHostelsData } from "../../utils/auth";

export default function AddRoomDrawer({
  open,
  onClose,
  onSave,
  editData,
  mode = "add",
}) {
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
    },
    validateRoom,
  );

  // ✅ Prefill edit
  useEffect(() => {
    if (editData) {
      setValues({
        roomNumber: editData?.roomNumber?.replace("R-", "") || "",
        capacity: editData?.capacity || "",
        occupied: editData?.occupied || 0,
        status: editData?.status || "AVAILABLE",
      });
    } else {
      resetForm();
    }
  }, [editData, open]);

  const handleSubmit = () => {
    if (!validateAll()) return; // ❌ stop if invalid

    let payload = {
      roomNumber: form.roomNumber,
      capacity: Number(form.capacity),
      occupied: Number(form.occupied),
      status: form.status,
      hostelId: Number(hostelId),
    };

    if (mode === "edit" && editData?.id) {
      payload.id = editData.id;
    }

    onSave(payload);
    onClose();
  };

  const titles = {
    add: "Add Room",
    edit: "Edit Room Details",
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            {titles[mode]}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <TextField
            fullWidth
            label="Room Number"
            name="roomNumber"
            value={form.roomNumber}
            onChange={(e) => {
              const value = e.target.value;

              // ✅ allow only numbers AND max 3 digits
              if (/^[0-9]*$/.test(value) && value.length <= 3) {
                handleChange(e);
              }
            }}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber}
            inputProps={{ maxLength: 3 }} // extra safety
          />

          <TextField
            fullWidth
            type="number"
            label="Capacity"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            error={!!errors.capacity}
            helperText={errors.capacity}
          />

          <TextField
            fullWidth
            type="number"
            label="Occupied"
            name="occupied"
            value={form.occupied}
            onChange={handleChange}
            disabled={mode === "edit"}
            error={!!errors.occupied}
            helperText={errors.occupied}
          />

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={mode === "edit"}
            error={!!errors.status}
            helperText={errors.status}
          >
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="FULL">FULL</MenuItem>
          </TextField>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-3">
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
            }}
          >
            {mode === "edit" ? "Update Room" : "Save Room"}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
