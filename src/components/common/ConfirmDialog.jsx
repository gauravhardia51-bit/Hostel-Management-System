import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function ConfirmDialog({ open, title = "Are you sure?", message = "This action cannot be undone.", onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "8px",
          maxWidth: "400px",
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            borderColor: "gray.200",
            color: "text.primary",
            "&:hover": {
              borderColor: "gray.300",
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            backgroundColor: "#ef4444",
            "&:hover": {
              backgroundColor: "#dc2626"
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
