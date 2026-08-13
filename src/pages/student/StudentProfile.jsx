import { useEffect, useState } from "react";
import { Card, Avatar, Button } from "@mui/material";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { formatDateForDisplay } from "../../utils/formatDate";
import { getAuthData } from "../../utils/auth";
import StEditProfileDrawer from "../../feature/profile/StEditprofiledrawer";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuthData();
  const [open, setOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/room-data/user-id", {
        params: {
          userId: auth?.user.id,
        },
      });
      console.log("Profile response:", response.data);
      //setProfile(response.data.payLoad.profile);
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
    return <div className="text-center py-10">Loading...</div>;
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
      setOpen(false); // ✅ close drawer
      fetchProfile(); // ✅ refresh profile
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!profile) {
    return <div className="text-center py-10">No profile found.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">My Profile</h2>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => setOpen(true)}
        >
          Edit Profile
        </Button>

        <StEditProfileDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          editData={profile}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Card */}
        <Card className="p-6 rounded-xl text-center">
          <Avatar
            src={profile.profileImage}
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              bgcolor: "#4f46e5",
              fontSize: 34,
            }}
          >
            {profile.studentName?.charAt(0)}
          </Avatar>

          <h3 className="mt-4 text-lg font-semibold">{profile.studentName}</h3>

          <p className="text-gray-500 mt-2">Student</p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
              profile.status === "ACTIVE"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {profile.status}
          </span>
        </Card>

        {/* Right Card */}
        <Card className="p-6 rounded-xl col-span-2">
          <h3 className="font-semibold text-lg mb-5">Personal Information</h3>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-gray-500 text-sm">Student Name</p>
              <p className="font-medium">{profile.studentName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="font-medium">{profile.studentPhone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Room Number</p>
              <p className="font-medium">{profile.roomNumber}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Hostel</p>
              <p className="font-medium">{profile.hostelName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Joining Date</p>
              <p className="font-medium">
                {formatDateForDisplay(profile.joinedAt)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
