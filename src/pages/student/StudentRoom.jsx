import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import { getAuthData } from "../../utils/auth";
import api from "../../api/Api.jsx";
import { formatDateForDisplay } from "../../utils/formatDate.js";
import { useApp } from "../../context/AppContext";

export default function StudentRoom() {
  const { t, lang } = useApp();
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
    return <div className="text-center py-10 text-xs text-gray-500">{t("loading")}</div>;
  }

  if (!roomData) {
    return <div className="text-center py-10 text-xs text-gray-500">{t("noDataFound")}</div>;
  }

  const units = room.lastMonthUnits || Math.max(0, (room.currentMeterReading || 0) - (room.previousMeterReading || 0)) || 60;
  const unitRate = room.submeterRate || defaultRate || 10;
  const totalRoomBill = units * unitRate;
  const studentShare = Math.round((totalRoomBill / (room.occupied || 1)) * 100) / 100;

  return (
    <div className="space-y-4">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("myRoom") || (lang === "hi" ? "मेरा कमरा" : "My Room")}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === "hi" ? "कमरा विवरण, रूममेट्स और बिजली सब-मीटर स्थिति" : "Room details, roommates, and electricity sub-meter status"}
          </p>
        </div>
      </div>

      {/* ROOM INFO */}
      <Card className="p-5 rounded-xl shadow-sm border border-gray-100 bg-white">
        <h3 className="font-bold text-sm text-gray-800 mb-4 pb-2 border-b">
          {lang === "hi" ? "कमरा विवरण" : "Room Information"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div>
            <p className="text-gray-500 text-[11px] font-medium">{t("roomNo")}</p>
            <p className="font-bold text-gray-900 text-sm mt-0.5">{room.roomNumber}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[11px] font-medium">{t("floor") || "Floor"}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{room.floor || "1st Floor"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[11px] font-medium">{t("sharing") || "Sharing"}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{room.capacity} {lang === "hi" ? "शेयरिंग" : "Sharing"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[11px] font-medium">{t("occupied") || "Occupied"}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{room.occupied} {lang === "hi" ? "छात्र" : "Members"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[11px] font-medium">{t("joinedDate")}</p>
            <p className="font-semibold text-gray-800 mt-0.5">
              {formatDateForDisplay(room.joinedAt || Date.now())}
            </p>
          </div>
        </div>
      </Card>

      {/* ELECTRICITY SUB-METER CARD */}
      <Card className="p-5 rounded-xl shadow-sm border border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
              <BoltIcon fontSize="small" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800">
                {lang === "hi" ? "कमरा बिजली सब-मीटर बिलिंग" : "Room Electricity & Sub-Meter"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "hi" ? `यूनिट-आधारित बिजली बिल (₹${unitRate}/यूनिट)` : `Unit-based electricity billing (₹${unitRate}/unit)`}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">
            <ElectricMeterIcon sx={{ fontSize: 13 }} />
            <span>{lang === "hi" ? "सक्रिय मीटर ट्रैकिंग" : "Active Meter Tracking"}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] text-gray-500 font-medium">{lang === "hi" ? "वर्तमान मीटर रीडिंग" : "Current Meter Reading"}</p>
            <p className="text-base font-bold text-gray-900 mt-1">{room.currentMeterReading || 1560} <span className="text-xs font-normal text-gray-400">kWh</span></p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] text-gray-500 font-medium">{lang === "hi" ? "बिजली दर (प्रति यूनिट)" : "Electricity Tariff Rate"}</p>
            <p className="text-base font-bold text-yellow-700 mt-1">₹{unitRate} <span className="text-xs font-normal text-gray-400">/ unit</span></p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] text-gray-500 font-medium">{lang === "hi" ? "कमरे की कुल यूनिट खपत" : "Room Total Consumption"}</p>
            <p className="text-base font-bold text-indigo-700 mt-1">{units} <span className="text-xs font-normal text-gray-400">Units</span></p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] text-gray-500 font-medium">{lang === "hi" ? "आपका मासिक हिस्सा" : "Your Monthly Share"}</p>
            <p className="text-base font-bold text-green-700 mt-1">₹{studentShare}</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3">
          💡 <b>{lang === "hi" ? "गणना विधि:" : "Calculation Method:"}</b> {lang === "hi"
            ? `कमरे की कुल यूनिट खपत (${units} यूनिट) × ₹${unitRate}/यूनिट = ₹${totalRoomBill}, जो ${room.occupied} छात्रों में बराबर बांटी गई = ₹${studentShare} प्रति छात्र।`
            : `Room meter consumption (${units} units) × ₹${unitRate}/unit = ₹${totalRoomBill}, divided equally among ${room.occupied} room occupants = ₹${studentShare} / student.`}
        </p>
      </Card>

      {/* ROOMMATES */}
      <Card className="p-5 rounded-xl shadow-sm border border-gray-100 bg-white">
        <h3 className="font-bold text-sm text-gray-800 mb-3 pb-2 border-b">
          {lang === "hi" ? "कमरे के साथी (Roommates)" : "Roommates"}
        </h3>

        <div className="divide-y divide-gray-100">
          {sortedRoommates.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">{t("noDataFound")}</div>
          ) : (
            sortedRoommates.map((mate, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-xs">{mate.name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{mate.phone}</p>
                </div>

                {mate.isYou && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {lang === "hi" ? "आप (You)" : "You"}
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
