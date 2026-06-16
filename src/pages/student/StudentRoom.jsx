// import { useEffect, useState } from "react";
// import { Card } from "@mui/material";
// import api from "../../api/Api";

// export default function StudentRoom() {
//   const [loading, setLoading] = useState(false);
//   const [rooms, setRooms] = useState([]);
//   const [page, setPage] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [mode, setMode] = useState("add"); // add | edit | view
//   const [search, setSearch] = useState("");

//   const auth = getAuthData();
//   const hostelId = auth?.hostelId;

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/student/room", {
//         params: {
//           pageNo: page,
//           pageSize: 10,
//           hostelId: hostelId,
//           search: search,
//         },
//       });

//       const data = res.data;

//       setRooms(data.payLoad || []);
//       setTotalPages(data.totalPage || 0);
//       setTotalElements(data.totalRow || 0);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchRooms();
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [page, search]);

//   if (!room) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">My Room</h2>

//       {/* ROOM INFO */}
//       <Card className="p-4 rounded-xl mb-6">
//         <h3 className="font-semibold mb-3">Room Information</h3>

//         <div className="grid grid-cols-2 gap-4">
//           {/* LEFT */}
//           <div className="space-y-2 text-sm">
//             <p>
//               <b>Room Number:</b> {room.roomNumber}
//             </p>
//             <p>
//               <b>Floor:</b> {room.floor}
//             </p>
//             <p>
//               <b>Sharing Type:</b> {room.capacity} Members
//             </p>
//             <p>
//               <b>Occupied:</b> {room.occupied} Members
//             </p>
//             <p>
//               <b>Joined On:</b>{" "}
//               {new Date(room.joinedAt).toLocaleDateString("en-IN")}
//             </p>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div>
//             <img
//               src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
//               alt="room"
//               className="rounded-lg w-full h-40 object-cover"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* ROOMMATES */}
//       <Card className="p-4 rounded-xl">
//         <h3 className="font-semibold mb-3">Roommates</h3>

//         {roommates.map((r, i) => (
//           <div
//             key={i}
//             className="flex justify-between items-center border-b py-3"
//           >
//             <div>
//               <p className="font-medium">{r.name}</p>
//               <p className="text-xs text-gray-500">{r.phone}</p>
//             </div>

//             {r.isYou && (
//               <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
//                 You
//               </span>
//             )}
//           </div>
//         ))}

//         <button className="mt-4 w-full border rounded p-2 text-indigo-600">
//           View All Room Details
//         </button>
//       </Card>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Card } from "@mui/material";

export default function StudentRoom() {
  const [roomData, setRoomData] = useState(null);

  // ================= DUMMY DATA =================
  useEffect(() => {
    const dummyResponse = {
      payLoad: {
        room: {
          roomNumber: "R-204",
          floor: "2nd Floor",
          capacity: 3,
          occupied: 2,
          joinedAt: 1711929600000,
        },
        roommates: [
          {
            name: "Rahul Sharma",
            phone: "9876543210",
            isYou: true,
          },
          {
            name: "Aman Verma",
            phone: "9123456780",
            isYou: false,
          },
        ],
      },
    };

    setRoomData(dummyResponse.payLoad);
  }, []);

  if (!roomData) return <p>Loading...</p>;

  const { room, roommates } = roomData;

  return (
    <div>
      {/* PAGE TITLE */}
      <h2 className="text-lg font-semibold mb-4">My Room</h2>

      {/* ================= ROOM INFO ================= */}
      <Card className="p-5 rounded-xl mb-6">
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* LEFT DETAILS */}
          <div>
            <h3 className="font-semibold mb-4">Room Information</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Room Number</p>
                <p className="font-medium">{room.roomNumber}</p>
              </div>

              <div>
                <p className="text-gray-500">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>

              <div>
                <p className="text-gray-500">Sharing Type</p>
                <p className="font-medium">{room.capacity} Sharing</p>
              </div>

              <div>
                <p className="text-gray-500">Occupied</p>
                <p className="font-medium">{room.occupied} Members</p>
              </div>

              <div>
                <p className="text-gray-500">Joined On</p>
                <p className="font-medium">
                  {new Date(room.joinedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Room"
              className="rounded-lg w-full h-[200px] object-cover"
            />
          </div>
        </div>
      </Card>

      {/* ================= ROOMMATES ================= */}
      <Card className="p-5 rounded-xl">
        <h3 className="font-semibold mb-4">Roommates</h3>

        {roommates.map((mate, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-medium">{mate.name}</p>
              <p className="text-gray-500 text-sm">{mate.phone}</p>
            </div>

            {mate.isYou && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                You
              </span>
            )}
          </div>
        ))}

        <div className="mt-4">
          <button className="w-full bg-indigo-100 text-indigo-600 py-2 rounded-lg">
            View All Room Details
          </button>
        </div>
      </Card>
    </div>
  );
}
