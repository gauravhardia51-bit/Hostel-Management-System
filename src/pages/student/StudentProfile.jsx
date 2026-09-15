import { useEffect, useState } from "react";
import { Card, Avatar, Button } from "@mui/material";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { formatDateForDisplay } from "../../utils/formatDate";
import { getAuthData } from "../../utils/auth";
import StEditProfileDrawer from "../../feature/profile/StEditprofiledrawer";
import StudentDocumentsSection from "../../feature/documents/StudentDocumentsSection";
import { useApp } from "../../context/AppContext";

export default function StudentProfile() {
  const { t, lang } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuthData();
  const [open, setOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/room-data/user-id", {
        params: {
          userId: auth?.user?.id,
        },
      });
      setProfile(response.data.payLoad?.profile || response.data.payLoad);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xs text-gray-400">{t("loading")}</div>;
  }

  const handleSave = async (data) => {
    try {
      await api.put("/student/profile/update", {
        id: data.id,
        name: data.name,
        phone: data.phone,
      });

      if (data.image) {
        const formData = new FormData();

        formData.append("studentId", data.id);
        formData.append("file", data.image);

        await api.post("/student/profile/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Profile Updated");
      setOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!profile) {
    return <div className="text-center py-10 text-xs text-gray-400">{t("noDataFound")}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {lang === "hi" ? "मेरी प्रोफाइल" : "My Profile"}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === "hi"
              ? "व्यक्तिगत जानकारी, कमरा विवरण और दस्तावेज"
              : "Personal details, room assignment, and uploaded KYC documents"}
          </p>
        </div>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={() => setOpen(true)}
        >
          {lang === "hi" ? "प्रोफाइल बदलें" : "Edit Profile"}
        </Button>

        <StEditProfileDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          editData={profile}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Card */}
        <Card className="p-5 rounded-xl shadow-sm border border-gray-100 bg-white text-center flex flex-col justify-center items-center">
          <Avatar
            src={profile.profileImage}
            sx={{
              width: 84,
              height: 84,
              margin: "auto",
              bgcolor: "#4f46e5",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {profile.studentName?.charAt(0)}
          </Avatar>

          <h3 className="mt-3 text-base font-bold text-gray-800">{profile.studentName}</h3>

          <p className="text-xs text-gray-500 mt-1">{lang === "hi" ? "हॉस्टल छात्र" : "Hostel Student"}</p>

          <span
            className={`inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-bold ${
              profile.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {profile.status}
          </span>
        </Card>

        {/* Right Card */}
        <Card className="p-5 rounded-xl shadow-sm border border-gray-100 bg-white md:col-span-2">
          <h3 className="font-bold text-sm text-gray-800 mb-4 pb-2 border-b">
            {lang === "hi" ? "व्यक्तिगत जानकारी" : "Personal Information"}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 text-[11px] font-medium">{t("studentName")}</p>
              <p className="font-semibold text-gray-800 mt-0.5">{profile.studentName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] font-medium">{t("phone")}</p>
              <p className="font-semibold text-gray-800 mt-0.5">{profile.studentPhone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] font-medium">{t("roomNo")}</p>
              <p className="font-semibold text-gray-800 mt-0.5">
                {profile.roomNumber ? `Room ${profile.roomNumber}` : (lang === "hi" ? "आवंटित नहीं" : "Not Assigned")}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] font-medium">{lang === "hi" ? "हॉस्टल" : "Hostel"}</p>
              <p className="font-semibold text-gray-800 mt-0.5">{profile.hostelName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] font-medium">{t("joinedDate")}</p>
              <p className="font-semibold text-gray-800 mt-0.5">
                {formatDateForDisplay(profile.joinedAt)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Student Documents Section */}
      <StudentDocumentsSection
        studentId={profile?.id || profile?.studentId}
        userId={auth?.user?.id}
      />
    </div>
  );
}
