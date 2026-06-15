import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/Api";
<<<<<<< Updated upstream
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import Tooltip from "@mui/material/Tooltip";
import { getAuthData } from "../../utils/auth";
=======
import { getAuthData } from "../../utils/auth";

>>>>>>> Stashed changes
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

  const [currentSubscription, setCurrentSubscription] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState({
    smsEnabled: false,
    whatsappEnabled: false,
    paymentReminderEnabled: false,
    customNotificationEnabled: false,
    broadcastNotificationEnabled: false,
  });
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  
  const FeatureItem = ({ enabled, label }) => (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg border ${
        enabled
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-500"
      }`}
    >
      <span>{enabled ? "✔" : "✖"}</span>
      <span>{label}</span>
    </div>
  );

  const loadCurrentSubscription = async () => {
    try {

      const response = await api.get("/hostel/subscription/all", {
        params: {
          hostelId,
        },
      });

      const data = response.data.payLoad || [];

      if (data.length > 0) {
        setCurrentSubscription(data[0]);
      } else {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadNotificationSettings = async () => {
    try {

      const response = await api.get("/notification/setting/all", {
        params: {
          hostelId,
        },
      });

      console.log(response.data.payLoad);

      setNotificationSettings(response.data.payLoad?.[0] || {});
    } catch (error) {
      console.log(error);
    }
  };

  const NotificationFeature = ({ enabled, label }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        enabled ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2">
        {enabled ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (
          <CancelIcon color="error" fontSize="small" />
        )}

        <span>{label}</span>
      </div>

      {!enabled && <LockIcon color="disabled" />}
    </div>
  );

  useEffect(() => {
    if (tab === 2 || tab === 3) {
      loadCurrentSubscription();
      loadNotificationSettings();
    }
  }, [tab]);

  const upgradeMessage = () => {
    toast.info("Please upgrade your plan to use this feature.");
  };

  

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
<<<<<<< Updated upstream
=======
      const auth = getAuthData();
      const hostelId = auth?.hostelId;
>>>>>>> Stashed changes

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

          {/* ================= RENT =================
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
          )} */}

          {/* ================= NOTIFICATIONS ================= */}
          {tab === 2 && notificationSettings && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Notification Settings</h3>

                <p className="text-sm text-gray-500">
                  Manage notification preferences available in your plan.
                </p>
              </div>

              {/* SMS */}

              <div
                className="flex items-center justify-between border rounded-lg p-3"
                onClick={() =>
                  !notificationSettings.smsEnabled && upgradeMessage()
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsEnabled}
                      disabled={!notificationSettings.smsEnabled}
                    />
                  }
                  label="SMS Notification"
                />

                {!notificationSettings.smsEnabled && (
                  <Tooltip title="Upgrade your plan to unlock">
                    <LockIcon color="disabled" />
                  </Tooltip>
                )}
              </div>

              {/* WhatsApp */}

              <div
                className="flex items-center justify-between border rounded-lg p-3"
                onClick={() =>
                  !notificationSettings.whatsappEnabled && upgradeMessage()
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.whatsappEnabled}
                      disabled={!notificationSettings.whatsappEnabled}
                    />
                  }
                  label="WhatsApp Notification"
                />

                {!notificationSettings.whatsappEnabled && (
                  <Tooltip title="Upgrade your plan to unlock">
                    <LockIcon color="disabled" />
                  </Tooltip>
                )}
              </div>

              {/* Payment Reminder */}

              <div
                className="flex items-center justify-between border rounded-lg p-3"
                onClick={() =>
                  !notificationSettings.paymentReminderEnabled &&
                  upgradeMessage()
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.paymentReminderEnabled}
                      disabled={!notificationSettings.paymentReminderEnabled}
                    />
                  }
                  label="Payment Reminder"
                />

                {!notificationSettings.paymentReminderEnabled && (
                  <Tooltip title="Upgrade your plan to unlock">
                    <LockIcon color="disabled" />
                  </Tooltip>
                )}
              </div>

              {/* Custom Notification */}

              <div
                className="flex items-center justify-between border rounded-lg p-3"
                onClick={() =>
                  !notificationSettings.customNotificationEnabled &&
                  upgradeMessage()
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.customNotificationEnabled}
                      disabled={!notificationSettings.customNotificationEnabled}
                    />
                  }
                  label="Custom Notification"
                />

                {!notificationSettings.customNotificationEnabled && (
                  <Tooltip title="Upgrade your plan to unlock">
                    <LockIcon color="disabled" />
                  </Tooltip>
                )}
              </div>

              {/* Broadcast Notification */}

              <div
                className="flex items-center justify-between border rounded-lg p-3"
                onClick={() =>
                  !notificationSettings.broadcastNotificationEnabled &&
                  upgradeMessage()
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        notificationSettings.broadcastNotificationEnabled
                      }
                      disabled={
                        !notificationSettings.broadcastNotificationEnabled
                      }
                    />
                  }
                  label="Broadcast Notification"
                />

                {!notificationSettings.broadcastNotificationEnabled && (
                  <Tooltip title="Upgrade your plan to unlock">
                    <LockIcon color="disabled" />
                  </Tooltip>
                )}
              </div>

              <div className="pt-3">
                <Button variant="contained" onClick={() => setTab(4)}>
                  Upgrade Plan
                </Button>
              </div>
            </div>
          )}

          {/* ================= SUBSCRIPTION ================= */}
          {tab === 3 && (
            <div className="space-y-6">
              {/* Current Plan */}

              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Current Subscription
                      </h2>

                      <p className="text-sm text-gray-500">
                        Your active plan information
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        currentSubscription
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {currentSubscription ? "ACTIVE" : "FREE"}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Plan</p>
                      <h4 className="font-semibold">
                        {currentSubscription?.subscriptionName || "Free Plan"}
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <h4 className="font-semibold">
                        ₹{currentSubscription?.amount || 0}
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <h4 className="font-semibold">
                        {currentSubscription?.durationMonth || 0} Month
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Expiry Date</p>
                      <h4 className="font-semibold">
                        {currentSubscription
                          ? new Date(
                              currentSubscription.expiryDate,
                            ).toLocaleDateString("en-GB")
                          : "Unlimited"}
                      </h4>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Features */}

              <Card>
                <CardContent>
                  <h3 className="font-semibold mb-4">Enabled Features</h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    <FeatureItem
                      enabled={notificationSettings?.smsEnabled}
                      label="SMS Notification"
                    />

                    <FeatureItem
                      enabled={notificationSettings?.whatsappEnabled}
                      label="WhatsApp Notification"
                    />

                    <FeatureItem
                      enabled={notificationSettings?.paymentReminderEnabled}
                      label="Payment Reminder"
                    />

                    <FeatureItem
                      enabled={notificationSettings?.customNotificationEnabled}
                      label="Custom Notification"
                    />

                    <FeatureItem
                      enabled={
                        notificationSettings?.broadcastNotificationEnabled
                      }
                      label="Broadcast Notification"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Plans */}

              <Card>
                <CardContent>
                  <h3 className="font-semibold mb-5">Upgrade Plans</h3>

                  <div className="grid md:grid-cols-3 gap-5">
                    <Card variant="outlined">
                      <CardContent>
                        <h2 className="font-semibold text-lg">Starter</h2>

                        <h1 className="text-4xl font-bold mt-3">₹499</h1>

                        <p className="text-gray-500 mb-5">/month</p>

                        <ul className="space-y-2 text-sm">
                          <li>✔ Up To 50 Students</li>
                          <li>✔ Payment Reminder</li>
                          <li>✖ SMS Notification</li>
                          <li>✖ WhatsApp Notification</li>
                          <li>✖ Custom Notification</li>
                          <li>✖ Broadcast Notification</li>
                        </ul>

                        <Button fullWidth variant="contained" sx={{ mt: 3 }}>
                          Upgrade
                        </Button>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      className="border-2 border-indigo-500"
                    >
                      <CardContent>
                        <h2 className="font-semibold text-lg">Hostel Plus</h2>

                        <h1 className="text-4xl font-bold mt-3">₹999</h1>

                        <p className="text-gray-500 mb-5">/month</p>

                        <ul className="space-y-2 text-sm">
                          <li>✔ Up To 100 Students</li>
                          <li>✔ SMS Notification</li>
                          <li>✔ WhatsApp Notification</li>
                          <li>✔ Payment Reminder</li>
                          <li>✔ Custom Notification</li>
                          <li>✖ Broadcast Notification</li>
                        </ul>

                        <Button fullWidth variant="contained" sx={{ mt: 3 }}>
                          Upgrade
                        </Button>
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardContent>
                        <h2 className="font-semibold text-lg">Enterprise</h2>

                        <h1 className="text-4xl font-bold mt-3">₹1999</h1>

                        <p className="text-gray-500 mb-5">/month</p>

                        <ul className="space-y-2 text-sm">
                          <li>✔ Unlimited Students</li>
                          <li>✔ SMS Notification</li>
                          <li>✔ WhatsApp Notification</li>
                          <li>✔ Payment Reminder</li>
                          <li>✔ Custom Notification</li>
                          <li>✔ Broadcast Notification</li>
                        </ul>

                        <Button fullWidth variant="contained" sx={{ mt: 3 }}>
                          Upgrade
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
