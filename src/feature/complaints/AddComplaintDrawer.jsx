import React, { useEffect, useState } from "react";
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

export default function AddComplaintDrawer({
  open,
  onClose,
  editData,
  onSave,
  mode = "edit",
}) {
  const [form, setForm] = useState({
    id: "",
    complaintMessage: "",
    status: "OPEN",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id || "",
        complaintMessage: editData.complaintMessage || "",
        status: editData.status || "OPEN",
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
      id: form.id,
      complaintMessage: form.complaintMessage,
      status: form.status,
    };

    onSave(payload);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            Edit Complaint
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 flex-1">
          <TextField
            fullWidth
            label="Complaint"
            name="complaintMessage"
            value={form.complaintMessage}
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
            <MenuItem value="OPEN">
              <span className="text-yellow-600">● OPEN</span>
            </MenuItem>
            <MenuItem value="IN_PROGRESS">
              <span className="text-blue-600">● IN PROGRESS</span>
            </MenuItem>
            <MenuItem value="CLOSED">
              <span className="text-green-600">● CLOSED</span>
            </MenuItem>
          </TextField>
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
            Update Complaint
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
