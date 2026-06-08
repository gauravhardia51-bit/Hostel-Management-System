import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function Data() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);

  // ================= FETCH PAYMENTS =================

  const fetchPayments = async () => {
    try {
      const auth = getAuthData();
      const hostelId = auth?.hostelId;

      if (!hostelId) return;

      const res = await api.get("/payment/all", {
        params: {
          hostelId,
        },
      });

      setPayments(res.data.payLoad || []);
    } catch (error) {
      console.log("Payment Error:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ================= COUNTS =================

  const paidPayments = payments.filter((p) => p.status === "PAID");

  const pendingPayments = payments.filter((p) => p.status === "PENDING");

  const pieData = [
    {
      name: "PAID",
      value: paidPayments.length,
    },
    {
      name: "PENDING",
      value: pendingPayments.length,
    },
  ];

  // ================= PIE CLICK =================

  const handlePieClick = (data) => {
    navigate(`/payments?status=${data.name}`);
  };

  return (
    <>
      <Card className="p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-3">Payment Status</h3>

        {/* CHART */}
        <div
          className="
            flex
            justify-center
            items-center
            [&_*]:outline-none
          "
        >
          <PieChart width={260} height={220}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="value"
              onClick={handlePieClick}
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                  style={{
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </div>

        {/* LABELS */}
        <div className="flex justify-around text-xs mt-3">
          <span
            className="
              text-green-600
              font-medium
              cursor-pointer
            "
            onClick={() => navigate("/payments?status=PAID")}
          >
            Paid ({paidPayments.length})
          </span>

          <span
            className="
              text-red-500
              font-medium
              cursor-pointer
            "
            onClick={() => navigate("/payments?status=PENDING")}
          >
            Pending ({pendingPayments.length})
          </span>
        </div>
      </Card>
    </>
  );
}
