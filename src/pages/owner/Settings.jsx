import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/Api";

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

  const [userLoading, setUserLoading] = useState(false);

  const [hostelLoading, setHostelLoading] = useState(false);

  const [hostelEditMode, setHostelEditMode] = useState(false);

  const [editMode, setEditMode] = useState(false);

  // ================= USER =================

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  // ================= HOSTEL =================

  const [hostelData, setHostelData] = useState({
    id: "",
    hostelName: "",
    ownerName: "",
    phone: "",
    status: "",
    userId: "",
  });

  // ================= LOAD USER =================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setUserData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
        roleId: user.roleName === "ROLE_ADMIN" ? 1 : 2,
      });
    }
  }, []);

  // ================= LOAD HOSTEL =================

  useEffect(() => {
    loadHostel();
  }, []);

  const loadHostel = async () => {
    try {
      const hostelId = localStorage.getItem("hostelId");

      if (!hostelId) return;

      const response = await api.get("/hostel/id", {
        params: {
          id: hostelId,
        },
      });

      const data = response.data.payLoad;

      setHostelData(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= USER CHANGE =================

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HOSTEL CHANGE =================

  const handleHostelChange = (e) => {
    setHostelData({
      ...hostelData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= USER UPDATE =================

  const handleUpdate = async () => {
    try {
      setUserLoading(true);

      const payload = Object.fromEntries(
        Object.entries(userData).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        ),
      );

      await api.put("/users/update", payload);

      // ================= UPDATE USER LOCAL STORAGE =================

      const existingUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...existingUser,
        ...payload,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));

      // ================= UPDATE HOSTEL OWNER NAME =================

      const updatedHostelData = {
        ...hostelData,
        ownerName: payload.name || hostelData.ownerName,
      };

      await api.put("/hostel/update", updatedHostelData);

      setHostelData(updatedHostelData);

      // update hostel localStorage list also
      const hostels = JSON.parse(localStorage.getItem("hostels")) || [];

      const updatedHostels = hostels.map((h) =>
        h.id === updatedHostelData.id
          ? {
              ...h,
              ownerName: updatedHostelData.ownerName,
            }
          : h,
      );

      localStorage.setItem("hostels", JSON.stringify(updatedHostels));

      window.dispatchEvent(new Event("hostelUpdated"));

      setUserData({
        ...updatedUser,
        password: "",
      });

      toast.success("Profile updated successfully ✅");

      setEditMode(false);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setUserLoading(false);
    }
  };

  // ================= HOSTEL UPDATE =================

  const handleHostelUpdate = async () => {
    try {
      setHostelLoading(true);

      await api.put("/hostel/update", hostelData);

      // update localStorage
      const hostels = JSON.parse(localStorage.getItem("hostels")) || [];

      const updatedHostels = hostels.map((h) =>
        h.id === hostelData.id
          ? {
              ...h,
              ...hostelData,
            }
          : h,
      );

      localStorage.setItem("hostels", JSON.stringify(updatedHostels));

      window.dispatchEvent(new Event("hostelUpdated"));

      toast.success("Hostel updated successfully ✅");

      setHostelEditMode(false);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setHostelLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      {/* MAIN CARD */}
      <Card className="rounded-xl shadow-sm">
        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          className="border-b"
        >
          <Tab label="Profile" />
          <Tab label="Hostel" />
          <Tab label="Rent" />
          <Tab label="Notifications" />
          <Tab label="Subscription" />
        </Tabs>

        <CardContent>
          {/* ================= PROFILE ================= */}
          {tab === 0 && (
            <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold text-lg">User Profile</h3>

                  <p className="text-sm text-gray-500">
                    Update your account details
                  </p>
                </div>

                {!editMode && (
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  label="Role"
                  value={userData.roleId === 1 ? "Owner" : "Student"}
                  disabled
                  fullWidth
                />

                <TextField
                  label="New Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  placeholder="Leave empty if unchanged"
                />
              </div>

              {editMode && (
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={userLoading}
                  >
                    {userLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= HOSTEL ================= */}
          {tab === 1 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Hostel Information</h3>

                  <p className="text-sm text-gray-500">
                    Manage your hostel details
                  </p>
                </div>

                {!hostelEditMode && (
                  <Button
                    variant="contained"
                    onClick={() => setHostelEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Hostel Name"
                  name="hostelName"
                  value={hostelData.hostelName}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  label="Owner Name"
                  name="ownerName"
                  value={hostelData.ownerName}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  label="Phone"
                  name="phone"
                  value={hostelData.phone}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  label="Status"
                  name="status"
                  value={hostelData.status}
                  disabled
                  fullWidth
                />
              </div>

              {hostelEditMode && (
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="contained"
                    onClick={handleHostelUpdate}
                    disabled={hostelLoading}
                  >
                    {hostelLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setHostelEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= RENT ================= */}
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

          {/* ================= NOTIFICATIONS ================= */}
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

          {/* ================= SUBSCRIPTION ================= */}
          {tab === 4 && (
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
