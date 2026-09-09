import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/Api";

import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import BoltIcon from "@mui/icons-material/Bolt";
import Tooltip from "@mui/material/Tooltip";
import { getAuthData, setAuthData } from "../../utils/auth";
import { useApp } from "../../context/AppContext";

import {
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  FormControl,
} from "@mui/material";

export default function Settings() {
  const { themeMode, toggleTheme, lang, setLang, t } = useApp();
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

  // ================= BILLING & ELECTRICITY SETTINGS =================
  const [electricitySettings, setElectricitySettings] = useState({
    unitRate: 10,
    submeteringEnabled: true,
    splitMode: "EQUAL_SPLIT",
    billingCycleDay: 1,
    fixedMaintenanceCharge: 0,
  });
  const [billingEditMode, setBillingEditMode] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (hostelId) {
      const savedRate = localStorage.getItem(`hostel_${hostelId}_unit_rate`);
      const savedSettings = localStorage.getItem(`hostel_${hostelId}_billing_settings`);
      if (savedSettings) {
        try {
          setElectricitySettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error(e);
        }
      } else if (savedRate) {
        setElectricitySettings((prev) => ({
          ...prev,
          unitRate: parseFloat(savedRate) || 10,
        }));
      }
    }
  }, [hostelId]);

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setElectricitySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveBilling = async () => {
    try {
      setBillingLoading(true);
      const payload = {
        hostelId: Number(hostelId),
        unitRate: Number(electricitySettings.unitRate),
        submeteringEnabled: Boolean(electricitySettings.submeteringEnabled),
        splitMode: electricitySettings.splitMode,
        billingCycleDay: Number(electricitySettings.billingCycleDay),
        fixedMaintenanceCharge: Number(electricitySettings.fixedMaintenanceCharge || 0),
      };

      try {
        await api.post("/hostel/billing-settings", payload);
      } catch (err) {
        console.warn("Backend API /hostel/billing-settings fallback saving locally", err);
      }

      localStorage.setItem(`hostel_${hostelId}_unit_rate`, String(electricitySettings.unitRate));
      localStorage.setItem(`hostel_${hostelId}_billing_settings`, JSON.stringify(electricitySettings));
      window.dispatchEvent(new Event("billingSettingsUpdated"));

      toast.success(t("save") + " ✅");
      setBillingEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ❌");
    } finally {
      setBillingLoading(false);
    }
  };

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

      setNotificationSettings(response.data.payLoad?.[0] || {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tab === 4 || tab === 5) {
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

  useEffect(() => {
    const user = auth?.user;
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

  useEffect(() => {
    loadHostel();
  }, []);

  const loadHostel = async () => {
    try {
      if (!hostelId) return;
      const response = await api.get("/hostel/id", {
        params: { id: hostelId },
      });
      setHostelData(response.data.payLoad || {});
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHostelChange = (e) => {
    setHostelData({
      ...hostelData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setUserLoading(true);
      const payload = Object.fromEntries(
        Object.entries(userData).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        ),
      );

      await api.put("/users/update", payload);

      const existingUser = auth?.user;
      const updatedUser = {
        ...existingUser,
        ...payload,
      };

      const updatedHostelData = {
        ...hostelData,
        ownerName: payload.name || hostelData.ownerName,
      };

      await api.put("/hostel/update", updatedHostelData);
      setHostelData(updatedHostelData);

      const hostels = auth?.hostels || [];
      const updatedHostels = hostels.map((h) =>
        h.id === updatedHostelData.id
          ? { ...h, ownerName: updatedHostelData.ownerName }
          : h,
      );

      const updatedAuth = {
        ...auth,
        user: updatedUser,
        hostels: updatedHostels,
      };
      setAuthData(updatedAuth);

      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new Event("hostelUpdated"));

      setUserData({
        ...updatedUser,
        password: "",
      });

      toast.success(t("save") + " ✅");
      setEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setUserLoading(false);
    }
  };

  const handleHostelUpdate = async () => {
    try {
      setHostelLoading(true);
      await api.put("/hostel/update", hostelData);

      const hostels = auth?.hostels || [];
      const updatedHostels = hostels.map((h) =>
        h.id === hostelData.id ? { ...h, ...hostelData } : h,
      );

      const updatedAuth = {
        ...auth,
        hostels: updatedHostels,
      };
      setAuthData(updatedAuth);
      window.dispatchEvent(new Event("hostelUpdated"));
      toast.success(t("save") + " ✅");
      setHostelEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setHostelLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold">{t("settings")}</h2>
        <p className="text-xs text-gray-500">Manage account, hostel details, theme, language, and billing</p>
      </div>

      {/* MAIN CARD */}
      <Card className="rounded-xl shadow-sm">
        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          className="border-b"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t("profile")} />
          <Tab label={t("hostel")} />
          <Tab label={t("themeAndLanguage")} />
          <Tab label={t("tariffSettings")} />
          <Tab label={t("notifications")} />
          <Tab label="Subscription" />
        </Tabs>

        <CardContent>
          {/* ================= PROFILE ================= */}
          {tab === 0 && (
            <div className="max-w-2xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold text-base">User Profile</h3>
                  <p className="text-xs text-gray-500">Update account credentials</p>
                </div>

                {!editMode && (
                  <Button variant="contained" size="small" onClick={() => setEditMode(true)}>
                    {t("edit")}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  size="small"
                  label={t("name")}
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("email")}
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("role")}
                  value={userData.roleId === 1 ? "Owner" : "Student"}
                  disabled
                  fullWidth
                />

                <TextField
                  size="small"
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
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdate}
                    disabled={userLoading}
                  >
                    {userLoading ? "Saving..." : t("save")}
                  </Button>

                  <Button variant="outlined" size="small" onClick={() => setEditMode(false)}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= HOSTEL ================= */}
          {tab === 1 && (
            <div className="max-w-2xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-semibold">Hostel Information</h3>
                  <p className="text-xs text-gray-500">Manage hostel property details</p>
                </div>

                {!hostelEditMode && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setHostelEditMode(true)}
                  >
                    {t("edit")}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  size="small"
                  label="Hostel Name"
                  name="hostelName"
                  value={hostelData.hostelName}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label="Owner Name"
                  name="ownerName"
                  value={hostelData.ownerName}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("phone")}
                  name="phone"
                  value={hostelData.phone}
                  onChange={handleHostelChange}
                  disabled={!hostelEditMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("status")}
                  name="status"
                  value={hostelData.status}
                  disabled
                  fullWidth
                />
              </div>

              {hostelEditMode && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleHostelUpdate}
                    disabled={hostelLoading}
                  >
                    {hostelLoading ? "Saving..." : t("save")}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setHostelEditMode(false)}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= THEME & LANGUAGE (NEW) ================= */}
          {tab === 2 && (
            <div className="max-w-2xl space-y-6">
              {/* THEME TOGGLE */}
              <div className="p-4 rounded-xl border space-y-3 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                      {themeMode === "dark" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t("theme")}</h4>
                      <p className="text-xs text-gray-500">{t("themeDesc")}</p>
                    </div>
                  </div>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={themeMode === "dark"}
                        onChange={toggleTheme}
                        color="primary"
                      />
                    }
                    label={
                      <span className="text-xs font-bold">
                        {themeMode === "dark" ? t("darkMode") : t("lightMode")}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* LANGUAGE SELECTOR */}
              <div className="p-4 rounded-xl border space-y-3 bg-slate-50/60">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <LanguageIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t("language")}</h4>
                    <p className="text-xs text-gray-500">{t("languageDesc")}</p>
                  </div>
                </div>

                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={lang}
                    onChange={(e) => {
                      setLang(e.target.value);
                      toast.success(e.target.value === "hi" ? "भाषा बदलकर हिंदी कर दी गई है" : "Language changed to English");
                    }}
                  >
                    <FormControlLabel
                      value="en"
                      control={<Radio size="small" color="primary" />}
                      label={<span className="text-xs font-medium">English</span>}
                    />
                    <FormControlLabel
                      value="hi"
                      control={<Radio size="small" color="primary" />}
                      label={<span className="text-xs font-medium">हिंदी (Simple Hindi)</span>}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          )}

          {/* ================= ELECTRICITY TARIFF SETTINGS ================= */}
          {tab === 3 && (
            <div className="max-w-2xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-1.5">
                    <span className="text-amber-500"><BoltIcon fontSize="small" /></span>
                    {t("tariffSettings")}
                  </h3>
                  <p className="text-xs text-gray-500">{t("unitRateDesc")}</p>
                </div>

                {!billingEditMode && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setBillingEditMode(true)}
                  >
                    {t("edit")}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  size="small"
                  label={t("ratePerUnit") + " (₹/kWh)"}
                  name="unitRate"
                  type="number"
                  value={electricitySettings.unitRate}
                  onChange={handleBillingChange}
                  disabled={!billingEditMode}
                  fullWidth
                  helperText="e.g. 10 (10 ₹/unit)"
                />

                <TextField
                  size="small"
                  label={t("billingMonth") + " Day (1-31)"}
                  name="billingCycleDay"
                  type="number"
                  inputProps={{ min: 1, max: 31 }}
                  value={electricitySettings.billingCycleDay}
                  onChange={handleBillingChange}
                  disabled={!billingEditMode}
                  fullWidth
                  helperText="Day of month when readings are recorded"
                />
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <FormControlLabel
                  control={
                    <Switch
                      checked={electricitySettings.submeteringEnabled}
                      onChange={handleBillingChange}
                      name="submeteringEnabled"
                      disabled={!billingEditMode}
                      color="warning"
                      size="small"
                    />
                  }
                  label={
                    <span className="text-xs font-medium text-gray-800">
                      Enable Room Sub-Meter Tracking
                    </span>
                  }
                />
              </div>

              {billingEditMode && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveBilling}
                    disabled={billingLoading}
                  >
                    {billingLoading ? "Saving..." : t("save")}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setBillingEditMode(false)}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= NOTIFICATIONS ================= */}
          {tab === 4 && notificationSettings && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-base font-semibold">{t("notifications")}</h3>
                <p className="text-xs text-gray-500">Manage notification channels</p>
              </div>

              <div className="space-y-3">
                <div
                  className="flex items-center justify-between border rounded-lg p-3"
                  onClick={() => !notificationSettings.smsEnabled && upgradeMessage()}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.smsEnabled}
                        disabled={!notificationSettings.smsEnabled}
                        size="small"
                      />
                    }
                    label={<span className="text-xs">SMS Notification</span>}
                  />
                  {!notificationSettings.smsEnabled && <LockIcon color="disabled" fontSize="small" />}
                </div>

                <div
                  className="flex items-center justify-between border rounded-lg p-3"
                  onClick={() => !notificationSettings.whatsappEnabled && upgradeMessage()}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.whatsappEnabled}
                        disabled={!notificationSettings.whatsappEnabled}
                        size="small"
                      />
                    }
                    label={<span className="text-xs">WhatsApp Notification</span>}
                  />
                  {!notificationSettings.whatsappEnabled && <LockIcon color="disabled" fontSize="small" />}
                </div>

                <div
                  className="flex items-center justify-between border rounded-lg p-3"
                  onClick={() => !notificationSettings.paymentReminderEnabled && upgradeMessage()}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.paymentReminderEnabled}
                        disabled={!notificationSettings.paymentReminderEnabled}
                        size="small"
                      />
                    }
                    label={<span className="text-xs">Payment Reminders</span>}
                  />
                  {!notificationSettings.paymentReminderEnabled && <LockIcon color="disabled" fontSize="small" />}
                </div>
              </div>
            </div>
          )}

          {/* ================= SUBSCRIPTION ================= */}
          {tab === 5 && (
            <div className="space-y-4 max-w-2xl">
              <Card variant="outlined">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold">Active Subscription</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {currentSubscription ? "ACTIVE" : "FREE"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Plan: {currentSubscription?.subscriptionName || "Free Plan"}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
