import React from "react";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import AddPaymentDrawer from "../../feature/payments/AddPaymentDrawer.jsx";
import { useState, useEffect } from "react";
import api from "../../api/Api.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { toast } from "react-toastify";

// const payments = [
//   {
//     id: 1,
//     name: "Rahul Kumar",
//     amount: "₹5,000",
//     dueDate: "05 Apr 2024",
//     paidDate: "05 Apr 2024",
//     status: "PAID",
//   },
//   {
//     id: 2,
//     name: "Aman Verma",
//     amount: "₹4,500",
//     dueDate: "05 Apr 2024",
//     paidDate: "-",
//     status: "PENDING",
//   },
//   {
//     id: 3,
//     name: "Vikas Singh",
//     amount: "₹5,000",
//     dueDate: "05 Apr 2024",
//     paidDate: "05 Apr 2024",
//     status: "PAID",
//   },
//   {
//     id: 4,
//     name: "Rohit Sharma",
//     amount: "₹5,000",
//     dueDate: "05 Apr 2024",
//     paidDate: "-",
//     status: "PENDING",
//   },
//   {
//     id: 5,
//     name: "Deepak Yadav",
//     amount: "₹4,500",
//     dueDate: "05 Apr 2024",
//     paidDate: "-",
//     status: "PENDING",
//   },
//   {
//     id: 6,
//     name: "Rajesh Kumar",
//     amount: "₹5,000",
//     dueDate: "05 Apr 2024",
//     paidDate: "05 Apr 2024",
//     status: "PAID",
//   },
// ];

export default function Payments() {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit | view

  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getStatusStyle = (status) => {
    return status === "PAID"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-500";
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/payments/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: localStorage.getItem("hostelId"),
          search: search,
          status: status !== "ALL" ? status : undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });

      const data = res.data;

      setPayments(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const [rooms] = useState(
  //   Array.from({ length: 30 }, (_, i) => ({
  //     id: i + 1,
  //     roomNumber: `R${i + 1}`,
  //   })),
  // );

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPayments();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, search, status, fromDate, toDate]);

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            Loading...
          </td>
        </tr>
      );
    }

    if (payments.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No payments found
          </td>
        </tr>
      );
    }

    return payments.map((p, index) => (
      <tr key={p.id} className="border-b hover:bg-gray-50">
        <td className="py-3">{page * 10 + index + 1}</td>

        <td>{p.studentName || p.name}</td>

        <td>₹{p.amount}</td>

        <td>{p.dueDate}</td>

        <td>{p.paidDate || "-"}</td>

        <td>
          <span
            className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(
              p.status,
            )}`}
          >
            {p.status}
          </span>
        </td>

        <td className="text-center">
          <IconButton size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </td>
      </tr>
    ));
  };

  const handleSave = async (formData) => {
    try {
      if (mode === "edit") {
        await api.put(`/payments/update`, formData);
        toast.success("Payment updated successfully ✅");
      } else {
        await api.post("/payments/add", formData);
        toast.success("Payment added successfully ✅");
      }
      fetchPayments(); // refresh table
      setOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error("FULL ERROR:", err.response);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Payments</h2>
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
            setSelectedPayment(null);
            setMode("add");
            setOpen(true);
          }}
        >
          Add Payment
        </Button>

        <AddPaymentDrawer
          key={selectedPayment?.id || mode}
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          rooms={[]}
          editData={selectedPayment}
          mode={mode}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {/* Status Filter */}
        <Select
          size="small"
          value={status}
          onChange={(e) => {
            setPage(0);
            setStatus(e.target.value);
          }}
          className="bg-white rounded-md"
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="PAID">Paid</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
        </Select>

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setPage(0);
            setFromDate(e.target.value);
          }}
          className="border px-3 py-1.5 rounded-md text-sm bg-white"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setPage(0);
            setToDate(e.target.value);
          }}
          className="border px-3 py-1.5 rounded-md text-sm bg-white"
        />

        {/* Search */}
        <div className="flex items-center bg-white border rounded-md px-2 w-64">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full px-2 py-1.5 outline-none text-sm"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left text-xs border-b">
                <th className="py-2">#</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>{renderRows()}</tbody>
          </table>

          {/* Footer */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
            maxVisible={5}
            label="payments"
          />
        </CardContent>
      </Card>
    </div>
  );
}
