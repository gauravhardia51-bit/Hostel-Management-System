import React from "react";
import { Button } from "@mui/material";

export default function PageHeader({ title, subtitle, actionLabel, actionIcon, onActionClick }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={onActionClick}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 600,
            padding: "8px 16px",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#4338ca",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.05)",
            },
            "&:active": {
              transform: "translateY(0)",
            }
          }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
