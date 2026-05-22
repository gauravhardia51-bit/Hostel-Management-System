import React, { useEffect } from "react";
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

import useFormValidation from "../../hooks/FormValidation";
import { validateStudent } from "../../validations/ValidateStudent";

import {
  convertToTimestamp,
  formatDateForBackend,
} from "../../utils/formatDate";
import { getHostelsData } from "../../utils/auth";

export default function AddStudentDrawer({
  open,
  onClose,
  onSave,
  rooms = [],
  editData,
  mode = "add",
}) {
  const { hostelId } = getHostelsData();
  console.log("Rooms in AddStudentDrawer: ", rooms);
  const {
    values: form,
    errors,
    handleChange,
    validateAll,
    resetForm,
    setValues,
  } = useFormValidation(
    {
      name: "",
      phone: "",
      email: "",
      roomId: "",
      joinDate: "",
      status: "ACTIVE",
    },
    validateStudent,
  );

  // ✅ Prefill edit
  useEffect(() => {
    if (editData) {
      console.log("Edit data in drawer: ", editData);
      setValues({
        id: editData.id || "",
        name: editData.name || "",
        phone: editData.phone || "",
        email: editData.email || "",
        roomId: editData.roomId || "",
        joinDate: formatDateForBackend(editData.joinDate) || "",
        status: editData.status || "ACTIVE",
      });
    } else {
      resetForm();
    }
  }, [editData, open]);

  const handleSubmit = () => {
    console.log("Form values on submit: ", form);
    if (!validateAll()) return; // ❌ stop if error
    let payload = {
      name: form.name,
      phone: form.phone,
      roomId: Number(form.roomId),
      joinDate: convertToTimestamp(form.joinDate),
      status: form.status,
      hostelId: Number(hostelId),
    };
    if (mode === "edit" && form.id) {
      payload.id = form.id;
    }
    if (mode === "add" && editData?.email) {
      payload.email = editData.email;
    }
    onSave(payload);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 450 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            {mode === "edit" ? "Edit Student" : "Add Student"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 flex-1">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          {mode === "add" && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          )}

          <TextField
            select
            fullWidth
            label="Room"
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            error={!!errors.roomId}
            helperText={errors.roomId}
          >
            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                Room {r.roomNumber}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            error={!!errors.joinDate}
            helperText={errors.joinDate}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-2">
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to right, #4f46e5, #7c3aed)",
            }}
          >
            {mode === "edit" ? "Update Student" : "Save Student"}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
