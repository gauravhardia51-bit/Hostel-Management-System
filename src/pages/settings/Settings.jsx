import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";

export default function Settings() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-xs text-gray-500">Dashboard / Settings</p>
      </div>

      {/* Tabs */}
      <Card className="rounded-xl shadow-sm">
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          className="border-b"
        >
          <Tab label="Profile" />
          <Tab label="Hostel" />
          <Tab label="Rent" />
          <Tab label="Notifications" />
          <Tab label="Users" />
          <Tab label="Subscription" />
        </Tabs>

        <CardContent>
          {/* PROFILE */}
          {tab === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Name" fullWidth defaultValue="Amit Sharma" />
              <TextField
                label="Email"
                fullWidth
                defaultValue="amit@gmail.com"
              />
              <TextField label="Phone" fullWidth defaultValue="9876543210" />
              <TextField label="Password" type="password" fullWidth />

              <div className="col-span-2">
                <Button variant="contained">Save Changes</Button>
              </div>
            </div>
          )}

          {/* HOSTEL */}
          {tab === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Hostel Name"
                fullWidth
                defaultValue="Galaxy Boys Hostel"
              />
              <TextField
                label="Owner Name"
                fullWidth
                defaultValue="Amit Sharma"
              />
              <TextField label="Phone" fullWidth />
              <TextField label="Address" fullWidth />
              <TextField label="Check-in Time" fullWidth />
              <TextField label="Check-out Time" fullWidth />

              <div className="col-span-2">
                <Button variant="contained">Save Changes</Button>
              </div>
            </div>
          )}

          {/* RENT */}
          {tab === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Default Rent (₹)" fullWidth />
              <TextField label="Due Date (1-31)" fullWidth />
              <TextField label="Late Fee (₹/day)" fullWidth />
              <TextField label="Grace Period (days)" fullWidth />

              <div className="col-span-2">
                <Button variant="contained">Save Changes</Button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 3 && (
            <div className="space-y-3">
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable SMS Notifications"
              />
              <FormControlLabel
                control={<Switch />}
                label="Enable WhatsApp Notifications"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Send Payment Reminders"
              />

              <Button variant="contained">Save Changes</Button>
            </div>
          )}

          {/* USERS */}
          {tab === 4 && (
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Staff Name" fullWidth />
              <TextField label="Role" fullWidth />
              <TextField label="Phone" fullWidth />

              <div className="col-span-2">
                <Button variant="contained">Add User</Button>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {tab === 5 && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p>
                  <b>Current Plan:</b> Pro
                </p>
                <p>
                  <b>Expiry Date:</b> 30 May 2024
                </p>
              </div>

              <Button variant="contained" color="secondary">
                Upgrade Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
