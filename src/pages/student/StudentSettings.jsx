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
  RadioGroup,
  Radio,
  FormControl,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { getAuthData, setAuthData } from "../../utils/auth";
import { useApp } from "../../context/AppContext";

export default function StudentSettings() {
  const { themeMode, toggleTheme, lang, setLang, t } = useApp();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const auth = getAuthData();
  const user = auth?.user;

  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });

  const [roomInfo, setRoomInfo] = useState(null);

  const [notificationPrefs, setNotificationPrefs] = useState({
    rentAlerts: true,
    electricityAlerts: true,
    complaintUpdates: true,
    broadcastAnnouncements: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }

    const fetchRoom = async () => {
      try {
        const res = await api.get("/room-data/user-id", {
          params: { userId: user?.id },
        });
        if (res.data?.payLoad) {
          setRoomInfo(res.data.payLoad?.room || res.data.payLoad?.profile || res.data.payLoad);
        }
      } catch (err) {
        setRoomInfo({
          roomNumber: "R-204",
          hostelName: auth?.hostels?.[0]?.hostelName || "RentRova Hostel",
          capacity: 2,
          occupied: 2,
        });
      }
    };

    fetchRoom();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = Object.fromEntries(
        Object.entries(formData).filter(
          ([, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      await api.put("/users/update", payload);

      const existingUser = auth?.user;
      const updatedUser = {
        ...existingUser,
        ...payload,
      };

      const updatedAuth = {
        ...auth,
        user: updatedUser,
      };
      setAuthData(updatedAuth);

      window.dispatchEvent(new Event("userUpdated"));

      setFormData({
        ...updatedUser,
        password: "",
      });

      toast.success(t("save") + " ✅");
      setEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{t("settings")}</h2>
        <p className="text-xs text-gray-500">
          {lang === "hi"
            ? "खाता जानकारी, थीम, भाषा और सूचना प्राथमिकताएं प्रबंधित करें"
            : "Manage your profile, account preferences, theme, and notification settings"}
        </p>
      </div>

      {/* MAIN CARD */}
      <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          className="border-b"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label={t("profile")} />
          <Tab icon={<LanguageIcon />} iconPosition="start" label={t("themeAndLanguage")} />
          <Tab icon={<NotificationsIcon />} iconPosition="start" label={t("notifications")} />
          <Tab icon={<MeetingRoomIcon />} iconPosition="start" label={t("myRoom")} />
        </Tabs>

        <CardContent className="p-5">
          {/* ================= TAB 0: PROFILE ================= */}
          {tab === 0 && (
            <div className="max-w-2xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold text-base text-gray-800">
                    {lang === "hi" ? "छात्र खाता जानकारी" : "Student Profile Details"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === "hi" ? "व्यक्तिगत जानकारी और पासवर्ड बदलें" : "Update your profile credentials and password"}
                  </p>
                </div>

                {!editMode && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setEditMode(true)}
                    sx={{
                      backgroundColor: "#4f46e5",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {t("edit")}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  size="small"
                  label={t("studentName")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("email")}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={t("phone")}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />

                <TextField
                  size="small"
                  label={lang === "hi" ? "नया पासवर्ड" : "New Password"}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  placeholder={lang === "hi" ? "न बदलने के लिए खाली छोड़ें" : "Leave empty if unchanged"}
                />
              </div>

              {editMode && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdate}
                    disabled={loading}
                    sx={{
                      backgroundColor: "#4f46e5",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {loading ? t("saving") : t("save")}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditMode(false)}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 1: THEME & LANGUAGE ================= */}
          {tab === 1 && (
            <div className="max-w-2xl space-y-6">
              {/* THEME TOGGLE */}
              <div className="p-4 rounded-xl border border-gray-100 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                      {themeMode === "dark" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">{t("theme")}</h4>
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
                      <span className="text-xs font-bold text-gray-700">
                        {themeMode === "dark" ? t("darkMode") : t("lightMode")}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* LANGUAGE SELECTOR */}
              <div className="p-4 rounded-xl border border-gray-100 space-y-3 bg-slate-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <LanguageIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{t("language")}</h4>
                    <p className="text-xs text-gray-500">{t("languageDesc")}</p>
                  </div>
                </div>

                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={lang}
                    onChange={(e) => {
                      setLang(e.target.value);
                      toast.success(
                        e.target.value === "hi"
                          ? "भाषा बदलकर हिंदी कर दी गई है"
                          : "Language changed to English"
                      );
                    }}
                  >
                    <FormControlLabel
                      value="en"
                      control={<Radio size="small" color="primary" />}
                      label={<span className="text-xs font-medium text-gray-700">English</span>}
                    />
                    <FormControlLabel
                      value="hi"
                      control={<Radio size="small" color="primary" />}
                      label={<span className="text-xs font-medium text-gray-700">हिंदी (Simple Hindi)</span>}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          )}

          {/* ================= TAB 2: NOTIFICATION PREFERENCES ================= */}
          {tab === 2 && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {lang === "hi" ? "सूचना प्राथमिकताएं" : "Notification Preferences"}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === "hi" ? "प्राप्त होने वाली सूचनाओं को नियंत्रित करें" : "Configure what updates and alerts you receive"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {lang === "hi" ? "किराया व बिल अलर्ट" : "Rent & Fee Reminders"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {lang === "hi" ? "मासिक किराए की देय तिथि और रसीद अलर्ट" : "Monthly rent due date notifications and receipt alerts"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.rentAlerts}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, rentAlerts: e.target.checked })
                    }
                    size="small"
                    color="primary"
                  />
                </div>

                <div className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {lang === "hi" ? "बिजली सब-मीटर अलर्ट" : "Electricity Sub-Meter Alerts"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {lang === "hi" ? "मासिक मीटर रीडिंग और यूनिट बिल अपडेट" : "New sub-meter reading entries and unit splits"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.electricityAlerts}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, electricityAlerts: e.target.checked })
                    }
                    size="small"
                    color="primary"
                  />
                </div>

                <div className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {lang === "hi" ? "शिकायत स्थिति अपडेट" : "Complaint Ticket Updates"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {lang === "hi" ? "जब आपकी दर्ज शिकायत पर काम शुरू या समाप्त हो" : "Progress notifications when your tickets are updated"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.complaintUpdates}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, complaintUpdates: e.target.checked })
                    }
                    size="small"
                    color="primary"
                  />
                </div>

                <div className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {lang === "hi" ? "हॉस्टल सामान्य घोषणाएं" : "Hostel Broadcast Announcements"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {lang === "hi" ? "हॉस्टल प्रबंधन द्वारा भेजे गए महत्वपूर्ण नोटिस" : "Important notices and broadcast alerts from owner"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.broadcastAnnouncements}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        broadcastAnnouncements: e.target.checked,
                      })
                    }
                    size="small"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: HOSTEL & ROOM INFO ================= */}
          {tab === 3 && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {lang === "hi" ? "हॉस्टल व कमरा विवरण" : "Hostel & Room Assignment"}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === "hi" ? "वर्तमान आवंटित कमरे की जानकारी" : "Current room allocation and accommodation status"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50">
                  <p className="text-gray-500 text-[11px] font-medium">{lang === "hi" ? "हॉस्टल का नाम" : "Hostel Name"}</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {roomInfo?.hostelName || auth?.hostels?.[0]?.hostelName || "RentRova Hostel"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50">
                  <p className="text-gray-500 text-[11px] font-medium">{t("roomNo")}</p>
                  <p className="text-sm font-bold text-indigo-600 mt-1">
                    {roomInfo?.roomNumber || "R-204"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50">
                  <p className="text-gray-500 text-[11px] font-medium">{t("sharing")}</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {roomInfo?.capacity || 2} {lang === "hi" ? "छात्र शेयरिंग" : "Sharing Room"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50">
                  <p className="text-gray-500 text-[11px] font-medium">{t("status")}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
