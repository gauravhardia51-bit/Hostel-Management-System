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
import { formatDateForInput, convertToTimestamp } from "../../utils/formatDate";
import { getHostelsData } from "../../utils/auth";

export default function AddStudent({
  open,
  onClose,
  onSave,
  rooms = [],
  editData,
  mode = "add",
}) {
  const isView = mode === "view";
  const { hostelId } = getHostelsData();
  //console.log("Hostel ID in AddStudentDrawer: ", hostelId);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    roomId: "",
    joinDate: "",
    status: "ACTIVE", // ✅ default
  });

  useEffect(() => {
    //console.log("32= " + editData);
    if (editData) {
      setForm({
        id: editData.id || "",
        name: editData.name || "",
        phone: editData.phone || "",
        email: editData.email || "",
        roomId: editData.roomId || "",
        joinDate: editData.joinDate || "",
        status: editData.status || "ACTIVE",
      });
    } else {
      setForm({
        id: "",
        name: "",
        phone: "",
        email: "",
        roomId: "",
        joinDate: "",
        status: "ACTIVE",
      });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    let payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      roomId: Number(form.roomId),
      joinDate: convertToTimestamp(form.joinDate),
      status: form.status,
      hostelId: Number(hostelId), // ✅ ADD THIS
    };

    // ✅ Only add id in edit mode
    if (mode === "edit" && form.id) {
      payload.id = form.id;
    }

    // ✅ Remove empty fields
    Object.keys(payload).forEach(
      (key) => payload[key] === "" && delete payload[key],
    );

    onSave(payload);
    onClose();
  };

  const titles = {
    add: "Add Student",
    edit: "Edit Student Details",
    view: "View Student Details",
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 450 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            {titles[mode]}
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
            disabled={isView}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={isView}
          />

          {mode === "add" && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isView}
            />
          )}

          <TextField
            select
            fullWidth
            label="Room"
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            disabled={isView}
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
            value={formatDateForInput(form.joinDate)}
            onChange={handleChange}
            disabled={isView}
            InputLabelProps={{ shrink: true }}
          />

          {mode === "edit" && (
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="ACTIVE">
                <span className="px-2 py-1 text-xs rounded-md font-semibold bg-green-100 text-green-600">
                  ● ACTIVE
                </span>
              </MenuItem>

              <MenuItem value="INACTIVE">
                <span className="px-2 py-1 text-xs rounded-md font-semibold bg-red-100 text-red-500">
                  ● INACTIVE
                </span>
              </MenuItem>
            </TextField>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-2">
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          {mode !== "view" && (
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
          )}
        </div>
      </Box>
    </Drawer>
  );
}
