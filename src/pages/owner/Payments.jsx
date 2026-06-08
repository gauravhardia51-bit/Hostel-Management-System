import React, { useState, useEffect } from "react";

import { Card, CardContent, MenuItem, Select } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import AddPaymentDrawer from "../../feature/payments/AddPaymentDrawer.jsx";

import api from "../../api/Api.jsx";

import Pagination from "../../components/common/Pagination.jsx";

import { toast } from "react-toastify";

import { formatDateForDisplay } from "../../utils/formatDate.js";

export default function Payments() {
  // ================= STATES =================

  const [loading, setLoading] = useState(false);

  const [payments, setPayments] = useState([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [mode, setMode] = useState("add");

  const [status, setStatus] = useState("ALL");

  // ✅ GLOBAL DATE REFRESH
  const [dateRefresh, setDateRefresh] = useState(0);

  // ================= DATE EVENT =================

  useEffect(() => {
    const handleDateChange = () => {
      setDateRefresh((prev) => prev + 1);
    };

    window.addEventListener("dateFilterUpdated", handleDateChange);

    return () => {
      window.removeEventListener("dateFilterUpdated", handleDateChange);
    };
  }, []);

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    if (status === "PAID") {
      return {
        bg: "#DCFCE7",
        color: "#16A34A",
      };
    }

    return {
      bg: "#FEE2E2",
      color: "#DC2626",
    };
  };

  // ================= FETCH PAYMENTS =================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/payment/all", {
        params: {
          pageNo: page,

          pageSize: 10,

          hostelId: localStorage.getItem("hostelId"),

          search: search || undefined,

          status: status !== "ALL" ? status : undefined,

          // ✅ GLOBAL TOPBAR DATE
          dueStartTime: localStorage.getItem("fromDate") || undefined,

          dueEndTime: localStorage.getItem("toDate") || undefined,
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

  // ================= AUTO FETCH =================

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPayments();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, search, status, dateRefresh]);

  // ================= UPDATE STATUS =================

  const handleStatusChange = async (payment, newStatus) => {
    if (payment.status === newStatus) return;

    const confirm = window.confirm(`Change payment status to "${newStatus}" ?`);

    if (!confirm) return;

    try {
      await api.put("/payment/update", {
        id: payment.id,

        status: newStatus,

        hostelId: Number(localStorage.getItem("hostelId")),
      });

      toast.success("Payment status updated ✅");

      fetchPayments();
    } catch (err) {
      console.error(err);

      toast.error("Payment update failed ❌");
    }
  };

  // ================= TABLE ROWS =================

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            Loading...
          </td>
        </tr>
      );
    }

    if (payments.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            No payments found
          </td>
        </tr>
      );
    }

    return payments.map((p, index) => {
      const style = getStatusStyle(p.status);

      return (
        <tr key={p.id} className="border-b hover:bg-gray-50">
          <td className="py-3">{page * 10 + index + 1}</td>

          <td>{p.studentName || p.name}</td>

          <td>₹{p.amount}</td>

          <td>{formatDateForDisplay(p.dueDate)}</td>

          <td>{p.paidAt ? formatDateForDisplay(p.paidAt) : "-"}</td>

          {/* STATUS CHANGE */}
          <td>
            <Select
              size="small"
              value={p.status}
              onChange={(e) => handleStatusChange(p, e.target.value)}
              renderValue={(selected) => (
                <span
                  style={{
                    background: style.bg,

                    color: style.color,

                    padding: "4px 10px",

                    borderRadius: "8px",

                    fontSize: "11px",

                    fontWeight: 600,
                  }}
                >
                  {selected}
                </span>
              )}
              sx={{
                minWidth: 110,

                height: "30px",

                backgroundColor: style.bg,

                color: style.color,

                borderRadius: "8px",

                "& fieldset": {
                  border: "none",
                },

                "& .MuiSelect-icon": {
                  display: "none",
                },

                "& .MuiSelect-select": {
                  padding: "4px 8px",

                  display: "flex",

                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="PAID">PAID</MenuItem>

              <MenuItem value="PENDING">PENDING</MenuItem>
            </Select>
          </td>
        </tr>
      );
    });
  };

  // ================= SAVE =================

  const handleSave = async (formData) => {
    try {
      if (mode === "edit") {
        await api.put(`/payment/update`, formData);

        toast.success("Payment updated successfully ✅");
      } else {
        await api.post("/payment/add", formData);

        toast.success("Payment added successfully ✅");
      }

      fetchPayments();

      setOpen(false);

      setSelectedPayment(null);
    } catch (err) {
      console.error("FULL ERROR:", err.response);

      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Payments</h2>
        </div>

        <AddPaymentDrawer
          key={selectedPayment?.id || mode}
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          rooms={[]}
          editData={selectedPayment}
        />
      </div>

      {/* FILTERS */}

      <div className="flex gap-3 mb-4 flex-wrap">
        {/* STATUS */}

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

        {/* SEARCH */}

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

      {/* TABLE */}

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
              </tr>
            </thead>

            <tbody>{renderRows()}</tbody>
          </table>

          {/* PAGINATION */}

          <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setPage}
              maxVisible={5}
              label="payments"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
