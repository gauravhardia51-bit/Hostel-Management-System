import "./Stats.css";
import { useState, useEffect } from "react";
import api from "../../api/Api";
import { getHostelsData } from "../../utils/auth";

// MUI
import { Card, CardContent } from "@mui/material";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RemoveIcon from "@mui/icons-material/Remove";
import WarningIcon from "@mui/icons-material/Warning";

export default function Stats() {

  const [dashboardData, setDashboardData] =
    useState({});

  // ================= API CALL =================

  const fetchDashboardData = async () => {

    try {

      const { hostelId } =
        getHostelsData();

      console.log(
        "Hostel ID = ",
        hostelId
      );

      if (!hostelId) {
        return;
      }

      // default dates
      const today = new Date();

      const firstDayOfMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

      const fromMillis =
        new Date(
          firstDayOfMonth.setHours(
            0,
            0,
            0,
            0
          )
        ).getTime();

      const toMillis =
        new Date(
          today.setHours(
            23,
            59,
            59,
            999
          )
        ).getTime();

      const res =
        await api.get(
          "/dashboard/data/all",
          {
            params: {
              hostelId,
              fromDate:
                fromMillis,
              toDate:
                toMillis,
            },
          }
        );

      console.log(
        "Dashboard Data = ",
        res.data.payLoad
      );

      setDashboardData(
        res.data.payLoad
      );

    } catch (error) {

      console.log(
        "Dashboard Error = ",
        error
      );

    }
  };

  // ================= FIRST LOAD =================

  useEffect(() => {

    fetchDashboardData();

  }, []);

  // ================= STATS =================

  const hostelStats = [

    {
      title:
        "Total Students",

      value:
        dashboardData?.totalStudents || 0,

      icon:
        <PeopleIcon fontSize="small" />,

      bg:
        "bg-purple-100",

      color:
        "text-purple-600",

      sub: `${Math.round(
        dashboardData?.increaseStudentPercentage || 0
      )}% this month`,

      subIcon:
        <ArrowUpwardIcon className="text-green-500 text-xs" />,

      subColor:
        "text-green-500",
    },

    {
      title:
        "Total Rooms",

      value:
        dashboardData?.totalRooms || 0,

      icon:
        <MeetingRoomIcon fontSize="small" />,

      bg:
        "bg-blue-100",

      color:
        "text-blue-600",

      sub: `${dashboardData?.totalRooms || 0} Rooms`,

      subIcon:
        <RemoveIcon className="text-gray-400 text-xs" />,

      subColor:
        "text-gray-400",
    },

    {
      title:
        "Occupied Rooms",

      value:
        dashboardData?.totalOccupied || 0,

      icon:
        <HomeWorkIcon fontSize="small" />,

      bg:
        "bg-green-100",

      color:
        "text-green-600",

      sub: `${Math.round(
        dashboardData?.occupiedPercentage || 0
      )}% Occupied`,

      subIcon:
        <ArrowUpwardIcon className="text-green-500 text-xs" />,

      subColor:
        "text-green-500",
    },

    {
      title:
        "Monthly Income",

      value: `₹${(
        dashboardData?.totalIncome || 0
      ).toLocaleString()}`,

      icon:
        <AccountBalanceWalletIcon fontSize="small" />,

      bg:
        "bg-yellow-100",

      color:
        "text-yellow-600",

      sub: `${Math.round(
        dashboardData?.increaseIncomePercentage || 0
      )}% this month`,

      subIcon:
        <ArrowUpwardIcon className="text-green-500 text-xs" />,

      subColor:
        "text-green-500",
    },

    {
      title:
        "Pending Payments",

      value:
        dashboardData?.pendingPaymentStudentCount || 0,

      icon:
        <WarningIcon fontSize="small" />,

      bg:
        "bg-red-100",

      color:
        "text-red-600",

      sub: `₹${(
        dashboardData?.pendingAmount || 0
      ).toLocaleString()}`,

      subColor:
        "text-red-500",
    }

  ];

  return (
<div>
  <div className="mb-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
    <div className="grid grid-cols-5 gap-4 mb-6">

      {hostelStats.map(
        (s, i) => (

        <Card
          key={i}
          className="rounded-xl shadow-sm"
        >

          <CardContent>

            <div className="flex items-center gap-3">

              <div
                className={`${s.bg} p-2 rounded-md ${s.color}`}
              >
                {s.icon}
              </div>

              <div>

                <p className="text-gray-500 text-xs">
                  {s.title}
                </p>

                <h3 className="text-base font-bold">
                  {s.value}
                </h3>

                <div className="flex items-center gap-1 text-[10px]">

                  {s.subIcon}

                  <span className={s.subColor}>
                    {s.sub}
                  </span>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      ))}

    </div>
</div>
  );
  
}