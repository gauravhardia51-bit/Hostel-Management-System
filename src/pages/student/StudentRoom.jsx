import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { formatDateForDisplay } from "../../utils/formatDate";
import { getAuthData } from "../../utils/auth";
import { useMemo } from "react";

export default function StudentRoom() {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuthData();

  const fetchRoom = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room-data/user-id", {
        params: {
          userId: auth?.user.id,
        },
      });
      setRoomData(res.data.payLoad);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const { room = {}, roommates = [] } = roomData || {};

  const sortedRoommates = useMemo(() => {
    return [...roommates].sort((a, b) => Number(b.isYou) - Number(a.isYou));
  }, [roommates]);

  useEffect(() => {
    fetchRoom();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!roomData) {
    return <div className="text-center py-10">No room assigned.</div>;
  }

  return (
    <div>
      {/* PAGE TITLE */}
      <h2 className="text-lg font-semibold mb-4">My Room</h2>

      {/* ROOM INFO */}
      <Card className="p-5 rounded-xl mb-6">
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* LEFT */}
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
                  {formatDateForDisplay(room.joinedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          {/* <div>
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Room"
              className="rounded-lg w-full h-[220px] object-cover"
            />
          </div> */}
        </div>
      </Card>

      {/* ROOMMATES */}
      <Card className="p-5 rounded-xl">
        <h3 className="font-semibold mb-4">Roommates</h3>

        {sortedRoommates.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No roommates found.
          </div>
        ) : (
          sortedRoommates.map((mate, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{mate.name}</p>
                <p className="text-gray-500 text-sm">{mate.phone}</p>
              </div>

              {mate.isYou && (
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
          ))
        )}

        {/* <div className="mt-5">
          <button className="w-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition">
            View All Room Details
          </button>
        </div> */}
      </Card>
    </div>
  );
}
