import React, { useState } from "react";
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

export default function AddRoomDrawer({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState({
    roomNumber: editData?.roomNumber || "",
    capacity: editData?.capacity || "",
    occupied: editData?.occupied || 0,
    status: editData?.status || "AVAILABLE",
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
      roomNumber: "",
      capacity: "",
      occupied: 0,
      status: "AVAILABLE",
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
            sm: 420,
          },
        },
      }}
    >
      <Box className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            Add Room
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
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type="number"
            label="Capacity"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type="number"
            label="Occupied"
            name="occupied"
            value={form.occupied}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
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
            Save Room
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
