import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import api from "../../api/Api";

// Icons
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function StStats() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/student/dashboard");
      setData(res.data.payLoad);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="p-5">Loading...</p>;

  const stats = [
    {
      title: "My Room",
      value: data.room?.roomNumber,
      sub: data.room?.sharingType,
      icon: <MeetingRoomIcon />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Pending Amount",
      value: `₹ ${data.pendingAmount}`,
      sub: "Due soon",
      icon: <AccountBalanceWalletIcon />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Complaints",
      value: data.complaintsCount,
      sub: "Open complaints",
      icon: <ReportProblemIcon />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Notifications",
      value: data.notificationsCount,
      sub: "Unread alerts",
      icon: <NotificationsIcon />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="rounded-xl shadow-sm">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-md ${s.color}`}>
                  {s.icon}
                </div>

                <div>
                  <p className="text-gray-500 text-xs">{s.title}</p>
                  <h3 className="text-base font-bold">{s.value}</h3>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
