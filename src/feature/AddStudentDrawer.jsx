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

export default function AddStudent({
  open,
  onClose,
  onSave,
  rooms = [],
  editData,
}) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    phone: editData?.phone || "",
    roomId: editData?.roomId || "",
    joinDate: editData?.joinDate || "",
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
      name: "",
      phone: "",
      roomId: "",
      joinDate: "",
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
            Add Student
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <TextField
            fullWidth
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Select Room"
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                Room {room.roomNumber}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="date"
            name="joinDate"
            value={form.joinDate}
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
            Save Student
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
