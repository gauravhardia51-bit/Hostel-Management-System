import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import { getAuthData } from "../../utils/auth";
import api from "../../api/Api.jsx";
import { formatDateForDisplay } from "../../utils/formatDate.js";
import { toast } from "react-toastify";

export default function StudentRoom() {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const defaultRate = parseFloat(localStorage.getItem(`hostel_${hostelId}_unit_rate`)) || 10;

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await api.get("/room-data/user-id", {
        params: {
          userId: auth?.user?.id,
        },
      });
      if (res.data?.payLoad) {
        setRoomData(res.data.payLoad);
        return;
      }
    } catch (e) {
      const dummyResponse = {
        payLoad: {
          room: {
            roomNumber: "R-204",
            floor: "2nd Floor",
            capacity: 3,
            occupied: 2,
            joinedAt: Date.now() - 86400000 * 30,
            currentMeterReading: 1560,
            previousMeterReading: 1450,
            lastMonthUnits: 110,
            submeterRate: defaultRate,
            lastBillAmount: 110 * defaultRate,
          },
          roommates: [
            {
              name: auth?.user?.name || "You",
              phone: auth?.user?.phone || "9876543210",
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [defaultRate]);

  const { room = {}, roommates = [] } = roomData || {};

  const sortedRoommates = useMemo(() => {
    return [...roommates].sort((a, b) => Number(b.isYou) - Number(a.isYou));
  }, [roommates]);

  if (loading && !roomData) {
    return <div className="text-center py-10 text-gray-500">Loading room details...</div>;
  }

  if (!roomData) {
    return <div className="text-center py-10 text-gray-500">No room assigned.</div>;
  }

  const units = room.lastMonthUnits || Math.max(0, (room.currentMeterReading || 0) - (room.previousMeterReading || 0)) || 60;
  const unitRate = room.submeterRate || defaultRate || 10;
  const totalRoomBill = units * unitRate;
  const studentShare = Math.round((totalRoomBill / (room.occupied || 1)) * 100) / 100;

  return (
    <div className="space-y-5">
      {/* PAGE TITLE */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Room</h2>
        <p className="text-xs text-gray-500">Room details, roommates, and electricity sub-meter status</p>
      </div>

      {/* ROOM INFO */}
      <Card className="p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Room Information</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Room Number</p>
                <p className="font-bold text-gray-900 text-base">{room.roomNumber}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Floor</p>
                <p className="font-medium text-gray-800">{room.floor || "1st Floor"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Sharing Type</p>
                <p className="font-medium text-gray-800">{room.capacity} Sharing</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Occupied</p>
                <p className="font-medium text-gray-800">{room.occupied} Members</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Joined On</p>
                <p className="font-medium text-gray-800">
                  {formatDateForDisplay(room.joinedAt || Date.now())}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ELECTRICITY SUB-METER CARD */}
      <Card className="p-5 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-white shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
              <BoltIcon />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Room Electricity & Sub-Meter</h3>
              <p className="text-xs text-gray-500">Unit-based electricity billing (₹{unitRate}/unit)</p>
            </div>
          </div>

          <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
            <ElectricMeterIcon sx={{ fontSize: 14 }} />
            <span>Active Meter Tracking</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/90 rounded-xl border border-amber-100">
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Current Meter Reading</p>
            <p className="text-lg font-bold text-gray-800">{room.currentMeterReading || 1560} <span className="text-xs font-normal text-gray-500">kWh</span></p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500 font-medium">Electricity Tariff Rate</p>
            <p className="text-lg font-bold text-amber-700">₹{unitRate} <span className="text-xs font-normal text-gray-500">/ unit</span></p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500 font-medium">Room Total Consumption</p>
            <p className="text-lg font-bold text-indigo-700">{units} <span className="text-xs font-normal text-gray-500">Units</span></p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500 font-medium">Your Monthly Share</p>
            <p className="text-lg font-bold text-green-600">₹{studentShare}</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3">
          💡 <b>How it's calculated:</b> Room meter consumption ({units} units) × ₹{unitRate}/unit = ₹{totalRoomBill}, divided equally among {room.occupied} room occupants = <b>₹{studentShare} / student</b>.
        </p>
      </Card>

      {/* ROOMMATES */}
      <Card className="p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Roommates</h3>

        <div className="divide-y divide-gray-100">
          {sortedRoommates.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No roommates found.</div>
          ) : (
            sortedRoommates.map((mate, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{mate.name}</p>
                  <p className="text-gray-400 text-xs">{mate.phone}</p>
                </div>

                {mate.isYou && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
