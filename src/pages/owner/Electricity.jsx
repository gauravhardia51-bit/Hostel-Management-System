import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import { toast } from "react-toastify";
import api from "../../api/Api.jsx";
import { getAuthData } from "../../utils/auth";
import AddMeterReadingDrawer from "../../feature/electricity/AddMeterReadingDrawer.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { useApp } from "../../context/AppContext";

export default function Electricity() {
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  const [readings, setReadings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(
    new Date().toISOString().slice(0, 7) // "YYYY-MM"
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);

  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const [defaultRate, setDefaultRate] = useState(10);

  useEffect(() => {
    const savedRate = localStorage.getItem(`hostel_${hostelId}_unit_rate`);
    if (savedRate) {
      setDefaultRate(parseFloat(savedRate) || 10);
    }
  }, [hostelId]);

  // Initial Sample/Mock Data
  const getInitialMockData = () => [
    {
      id: 1,
      roomId: 101,
      roomNumber: "R-101",
      billingMonth: "2026-04",
      previousReading: 1200,
      currentReading: 1285,
      unitsConsumed: 85,
      ratePerUnit: defaultRate || 10,
      totalAmount: 85 * (defaultRate || 10),
      occupantCount: 2,
      perStudentAmount: (85 * (defaultRate || 10)) / 2,
      status: "BILLED",
      recordedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 2,
      roomId: 102,
      roomNumber: "R-102",
      billingMonth: "2026-04",
      previousReading: 950,
      currentReading: 1010,
      unitsConsumed: 60,
      ratePerUnit: defaultRate || 10,
      totalAmount: 60 * (defaultRate || 10),
      occupantCount: 3,
      perStudentAmount: Math.round(((60 * (defaultRate || 10)) / 3) * 100) / 100,
      status: "PAID",
      recordedAt: Date.now() - 86400000 * 5,
    },
    {
      id: 3,
      roomId: 204,
      roomNumber: "R-204",
      billingMonth: "2026-04",
      previousReading: 1450,
      currentReading: 1560,
      unitsConsumed: 110,
      ratePerUnit: defaultRate || 10,
      totalAmount: 110 * (defaultRate || 10),
      occupantCount: 2,
      perStudentAmount: (110 * (defaultRate || 10)) / 2,
      status: "BILLED",
      recordedAt: Date.now() - 86400000 * 1,
    },
  ];

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await api.get("/room/all", {
        params: { pageNo: 0, pageSize: 100, hostelId },
      });
      const roomList = res.data?.payLoad || [];
      if (roomList.length > 0) {
        setRooms(roomList);
      } else {
        setRooms([
          { id: 101, roomNo: "R-101", capacity: 2, occupied: 2, lastMeterReading: 1285 },
          { id: 102, roomNo: "R-102", capacity: 3, occupied: 3, lastMeterReading: 1010 },
          { id: 204, roomNo: "R-204", capacity: 2, occupied: 2, lastMeterReading: 1560 },
          { id: 205, roomNo: "R-205", capacity: 3, occupied: 1, lastMeterReading: 800 },
        ]);
      }
    } catch (err) {
      setRooms([
        { id: 101, roomNo: "R-101", capacity: 2, occupied: 2, lastMeterReading: 1285 },
        { id: 102, roomNo: "R-102", capacity: 3, occupied: 3, lastMeterReading: 1010 },
        { id: 204, roomNo: "R-204", capacity: 2, occupied: 2, lastMeterReading: 1560 },
        { id: 205, roomNo: "R-205", capacity: 3, occupied: 1, lastMeterReading: 800 },
      ]);
    }
  };

  // Fetch Readings
  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/electricity/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId,
          month: monthFilter || undefined,
          search: search || undefined,
        },
      });

      if (res.data?.payLoad) {
        setReadings(res.data.payLoad);
        setTotalPages(res.data.totalPage || 1);
        setTotalElements(res.data.totalRow || res.data.payLoad.length);
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      const localKey = `hostel_${hostelId}_electricity_readings`;
      const saved = localStorage.getItem(localKey);
      let list = saved ? JSON.parse(saved) : getInitialMockData();

      if (search) {
        list = list.filter((item) =>
          item.roomNumber.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (monthFilter) {
        list = list.filter((item) => item.billingMonth === monthFilter);
      }

      setReadings(list);
      setTotalPages(Math.ceil(list.length / 10) || 1);
      setTotalElements(list.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hostelId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReadings();
    }, 250);
    return () => clearTimeout(timer);
  }, [page, search, monthFilter, hostelId, defaultRate]);

  // Save Reading
  const handleSaveReading = async (formData) => {
    try {
      if (formData.id) {
        await api.put("/electricity/reading/update", formData);
      } else {
        await api.post("/electricity/reading/add", formData);
      }
      toast.success(t("save") + " ✅");
      fetchReadings();
    } catch (err) {
      const localKey = `hostel_${hostelId}_electricity_readings`;
      const saved = localStorage.getItem(localKey);
      let list = saved ? JSON.parse(saved) : getInitialMockData();

      if (formData.id) {
        list = list.map((item) => (item.id === formData.id ? formData : item));
      } else {
        const newItem = {
          ...formData,
          id: Date.now(),
        };
        list.unshift(newItem);
      }

      localStorage.setItem(localKey, JSON.stringify(list));
      toast.success(t("save") + " ✅");
      fetchReadings();
    }
  };

  // Delete Reading
  const handleDeleteReading = (id) => {
    if (!window.confirm("Delete this reading?")) return;
    const localKey = `hostel_${hostelId}_electricity_readings`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      const list = JSON.parse(saved).filter((item) => item.id !== id);
      localStorage.setItem(localKey, JSON.stringify(list));
    }
    setReadings((prev) => prev.filter((r) => r.id !== id));
    toast.info("Deleted");
  };

  const totalUnits = readings.reduce((acc, curr) => acc + (curr.unitsConsumed || 0), 0);
  const totalRevenue = readings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            <span className="text-amber-500"><BoltIcon fontSize="small" /></span>
            {t("electricityTitle")}
          </h2>
          <p className="text-xs text-gray-500">{t("electricitySubtitle")}</p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => {
            setSelectedReading(null);
            setOpenDrawer(true);
          }}
        >
          {t("recordReading")}
        </Button>
      </div>

      {/* SIMPLE STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-500">{t("totalUnitsConsumed")}</p>
          <p className="text-lg font-bold text-gray-800">{totalUnits} <span className="text-xs font-normal">kWh</span></p>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-500">{t("totalElectricityBilled")}</p>
          <p className="text-lg font-bold text-gray-800">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-500">{t("currentTariffRate")}</p>
          <p className="text-lg font-bold text-amber-600">₹{defaultRate} <span className="text-xs font-normal text-gray-500">/ unit</span></p>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-500">{t("rooms")}</p>
          <p className="text-lg font-bold text-gray-800">{readings.length} <span className="text-xs font-normal text-gray-500">{t("billed")}</span></p>
        </Card>
      </div>

      {/* SEARCH & MONTH FILTER */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center bg-white border rounded-md px-2.5 py-1.5 w-60 shadow-sm">
          <SearchIcon className="text-gray-400 mr-1 text-sm" />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full outline-none text-xs bg-transparent"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>

        <div className="flex items-center bg-white border rounded-md px-2 py-1 shadow-sm text-xs text-gray-600">
          <span className="mr-2 font-medium">{t("billingMonth")}:</span>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => {
              setPage(0);
              setMonthFilter(e.target.value);
            }}
            className="outline-none bg-transparent font-medium"
          />
        </div>
      </div>

      {/* TABLE */}
      <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400 border-b text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">{t("roomNo")}</th>
                  <th className="py-2.5 px-3">{t("billingMonth")}</th>
                  <th className="py-2.5 px-3">{t("previousReading")}</th>
                  <th className="py-2.5 px-3">{t("currentReading")}</th>
                  <th className="py-2.5 px-3">{t("unitsConsumed")}</th>
                  <th className="py-2.5 px-3">{t("ratePerUnit")}</th>
                  <th className="py-2.5 px-3">{t("roomTotalBill")}</th>
                  <th className="py-2.5 px-3">{t("occupants")}</th>
                  <th className="py-2.5 px-3">{t("perStudentShare")}</th>
                  <th className="py-2.5 px-3">{t("status")}</th>
                  <th className="py-2.5 px-3 text-center">{t("action")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : readings.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  readings.map((r, index) => {
                    const isPaid = r.status === "PAID";
                    return (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="py-2.5 px-3">{page * 10 + index + 1}</td>
                        <td className="py-2.5 px-3 font-semibold">{r.roomNumber}</td>
                        <td className="py-2.5 px-3 text-gray-500">{r.billingMonth}</td>
                        <td className="py-2.5 px-3 text-gray-500">{r.previousReading}</td>
                        <td className="py-2.5 px-3 font-medium">{r.currentReading}</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[11px]">
                            {r.unitsConsumed}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-500">₹{r.ratePerUnit}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900">₹{r.totalAmount}</td>
                        <td className="py-2.5 px-3 text-gray-500">{r.occupantCount}</td>
                        <td className="py-2.5 px-3 font-semibold text-indigo-600">₹{r.perStudentAmount}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 text-[10px] rounded font-semibold ${
                            isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {r.status || "BILLED"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedReading(r);
                                setOpenDrawer(true);
                              }}
                            >
                              <EditIcon fontSize="small" className="text-gray-400 hover:text-indigo-600" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteReading(r.id)}
                            >
                              <DeleteIcon fontSize="small" className="text-gray-400 hover:text-red-600" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t flex justify-end items-center text-xs text-gray-500">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label="readings"
            />
          </div>
        </CardContent>
      </Card>

      {/* DRAWER */}
      <AddMeterReadingDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSave={handleSaveReading}
        rooms={rooms}
        editData={selectedReading}
        defaultUnitRate={defaultRate}
      />
    </div>
  );
}
