// import { useEffect, useState } from "react";
// import { Card, Avatar, Button } from "@mui/material";

// export default function StudentProfile() {
//   const [profile, setProfile] = useState(null);

//   // ================= DUMMY DATA =================
//   useEffect(() => {
//     const dummyProfile = {
//       name: "Rahul Kumar",
//       email: "rahul@gmail.com",
//       phone: "9876543210",
//       address: "123, MG Road, Indore, MP",
//       joinDate: 1711929600000,
//     };

//     setProfile(dummyProfile);
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-lg font-semibold">Profile</h2>

//         <Button variant="contained">Edit Profile</Button>
//       </div>

//       <div className="grid grid-cols-3 gap-6">
//         {/* LEFT CARD */}
//         <Card className="p-4 rounded-xl text-center">
//           <Avatar
//             sx={{
//               width: 80,
//               height: 80,
//               margin: "auto",
//               bgcolor: "#4f46e5",
//             }}
//           >
//             {profile?.name?.charAt(0)}
//           </Avatar>

//           <h3 className="mt-3 font-semibold">{profile?.name}</h3>
//           <p className="text-gray-500 text-sm">{profile?.email}</p>
//           <p className="text-gray-500 text-sm">{profile?.phone}</p>
//         </Card>

//         {/* RIGHT DETAILS */}
//         <Card className="p-4 rounded-xl col-span-2">
//           <h3 className="font-semibold mb-4">Personal Information</h3>

//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-gray-500">Full Name</p>
//               <p>{profile?.name}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Email</p>
//               <p>{profile?.email}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Phone</p>
//               <p>{profile?.phone}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Join Date</p>
//               <p>{new Date(profile?.joinDate).toLocaleDateString("en-IN")}</p>
//             </div>

//             <div className="col-span-2">
//               <p className="text-gray-500">Address</p>
//               <p>{profile?.address}</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Card, Avatar, Button } from "@mui/material";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { formatDateForDisplay } from "../../utils/formatDate";
import { getAuthData } from "../../utils/auth";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuthData();
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/id", {
        params: {
          id: auth?.user.id,
        },
      });
      console.log("Profile response:", response.data);
      setProfile(response.data.payLoad);
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

  if (!profile) {
    return <div className="text-center py-10">No profile found.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">My Profile</h2>

        <Button variant="contained">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Card */}
        <Card className="p-6 rounded-xl text-center">
          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              bgcolor: "#4f46e5",
              fontSize: 34,
            }}
          >
            {profile.name?.charAt(0)}
          </Avatar>

          <h3 className="mt-4 text-lg font-semibold">{profile.name}</h3>

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
              <p className="font-medium">{profile.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="font-medium">{profile.phone}</p>
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
                {formatDateForDisplay(profile.joinDate)}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-medium">{profile.status}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Room ID</p>
              <p className="font-medium">{profile.roomId}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Hostel ID</p>
              <p className="font-medium">{profile.hostelId}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
