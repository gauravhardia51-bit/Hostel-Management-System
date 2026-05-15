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

export default function AddStudent({
  open,
  onClose,
  onSave,
  rooms = [],
  editData,
  mode = "add",
}) {
  const isView = mode === "view";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    roomId: "",
    joinDate: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        phone: editData.phone || "",
        roomId: editData.roomId || "",
        joinDate: editData.joinDate || "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        roomId: "",
        joinDate: "",
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
    onSave({
      ...form,
      roomId: Number(form.roomId),
      joinDate: convertToTimestamp(form.joinDate),
    });
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
