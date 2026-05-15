import React, { useState } from "react";

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

export default function SendReminderDrawer({
  open,
  onClose,
  onSave,
  students = [],
}) {
  const [form, setForm] = useState({
    studentId: "",
    type: "PAYMENT",
    message: "",
    scheduledAt: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
      <Box className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <Typography variant="h6" fontWeight={700}>
            Create Reminder
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Student */}
          <TextField
            select
            fullWidth
            label="Select Student"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Reminder Type */}
          <TextField
            select
            fullWidth
            label="Reminder Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="PAYMENT">PAYMENT</MenuItem>

            <MenuItem value="GENERAL">GENERAL</MenuItem>

            <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
          </TextField>

          {/* Message */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reminder Message"
            name="message"
            value={form.message}
            onChange={handleChange}
          />

          {/* Schedule Date */}
          <TextField
            fullWidth
            type="datetime-local"
            label="Schedule Reminder"
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-5 flex gap-3">
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
            Save Reminder
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
