import { useEffect, useState } from "react";
import { Card, Avatar, Button } from "@mui/material";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);

  // ================= DUMMY DATA =================
  useEffect(() => {
    const dummyProfile = {
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "9876543210",
      address: "123, MG Road, Indore, MP",
      joinDate: 1711929600000,
    };

    setProfile(dummyProfile);
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Profile</h2>

        <Button variant="contained">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <Card className="p-4 rounded-xl text-center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "auto",
              bgcolor: "#4f46e5",
            }}
          >
            {profile?.name?.charAt(0)}
          </Avatar>

          <h3 className="mt-3 font-semibold">{profile?.name}</h3>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
          <p className="text-gray-500 text-sm">{profile?.phone}</p>
        </Card>

        {/* RIGHT DETAILS */}
        <Card className="p-4 rounded-xl col-span-2">
          <h3 className="font-semibold mb-4">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p>{profile?.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p>{profile?.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p>{profile?.phone}</p>
            </div>

            <div>
              <p className="text-gray-500">Join Date</p>
              <p>{new Date(profile?.joinDate).toLocaleDateString("en-IN")}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-500">Address</p>
              <p>{profile?.address}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
