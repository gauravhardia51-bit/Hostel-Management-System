import React, { useState } from "react";
import { useHostelStore } from "../../app/useHostelStore";

import { Menu, MenuItem, Typography, Grow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

export default function HostelSwitcher() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const hostels = [
    { id: 1, name: "Galaxy Boys Hostel", status: "Active" },
    { id: 2, name: "Sunrise Girls Hostel", status: "Inactive" },
  ];

  const { selectedHostel, setHostel } = useHostelStore();

  // ✅ fallback if nothing selected yet
  const currentHostel = selectedHostel || hostels[0];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (hostel) => {
    setHostel(hostel); // ✅ global + persisted
    handleClose();
  };

  return (
    <>
      {/* Header */}
      <div
        className="hostel-info cursor-pointer flex items-center justify-between"
        onClick={handleClick}
      >
        <div>
          <p className="hostel-name">{currentHostel.name}</p>
          <p className="hostel-status">● {currentHostel.status}</p>
        </div>

        <KeyboardArrowDownIcon
          style={{
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 220,
          },
        }}
      >
        {hostels.map((hostel) => {
          const isSelected = currentHostel.id === hostel.id;

          return (
            <MenuItem
              key={hostel.id}
              onClick={() => handleSelect(hostel)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: isSelected ? "#eef2ff" : "transparent",
              }}
            >
              <div>
                <Typography variant="body2">{hostel.name}</Typography>
                <Typography variant="caption" color="gray">
                  ● {hostel.status}
                </Typography>
              </div>

              {isSelected && (
                <CheckIcon fontSize="small" sx={{ color: "#4f46e5" }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
