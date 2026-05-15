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

export default function AddPaymentDrawer({
  open,
  onClose,
  onSave,
  students = [],
  editData,
}) {
  const [form, setForm] = useState({
    studentId: editData?.studentId || "",
    amount: editData?.amount || "",
    status: editData?.status || "PENDING",
    dueDate: editData?.dueDate || "",
    paidAt: editData?.paidAt || "",
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
      amount: "",
      status: "PENDING",
      dueDate: "",
      paidAt: "",
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
            Add Payment
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

          {/* Amount */}
          <TextField
            fullWidth
            type="number"
            label="Amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
          />

          {/* Status */}
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="PENDING">PENDING</MenuItem>

            <MenuItem value="PAID">PAID</MenuItem>
          </TextField>

          {/* Due Date */}
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Paid Date */}
          {form.status === "PAID" && (
            <TextField
              fullWidth
              type="date"
              label="Paid Date"
              name="paidAt"
              value={form.paidAt}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
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
            Save Payment
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
