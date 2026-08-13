import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import Pagination from "../../components/common/Pagination.jsx";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { formatDateForDisplay } from "../../utils/formatDate.js";

export default function StudentPayments() {
  const auth = getAuthData();

  const studentId = auth?.user?.id;
  const hostelId = auth?.hostelsId;

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/payment/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId,
          studentId,
        },
      });

      const data = response.data;
      console.log("Payments data:", data);
      setPayments(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-600";

      case "PENDING":
        return "bg-red-100 text-red-600";

      case "UPCOMING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getBillingPeriod = (dueDate) => {
    if (!dueDate) return null;

    const due = new Date(dueDate);

    // Start = same day previous month
    const startDate = new Date(due);
    startDate.setMonth(startDate.getMonth() - 1);

    // End = one day before due date
    const endDate = new Date(due);
    endDate.setDate(endDate.getDate() - 1);

    return {
      startDate,
      endDate,
    };
  };

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
    return payments.map((payment, index) => (
      <tr key={payment.id} className="border-b hover:bg-gray-50 h-12">
        <td>{page * 10 + index + 1}</td>

        {/* <td>{payment.month}</td> */}

        <td>
          {getBillingPeriod(payment.dueDate)?.startDate &&
            formatDateForDisplay(
              getBillingPeriod(payment.dueDate).startDate,
            )}{" "}
          -
          {getBillingPeriod(payment.dueDate)?.endDate &&
            formatDateForDisplay(getBillingPeriod(payment.dueDate).endDate)}
        </td>

        <td>₹ {payment.amount}</td>

        <td>
          {formatDateForDisplay(payment.dueDate) || "-"}/
          {formatDateForDisplay(payment.paidAt) || "-"}
        </td>

        <td>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
              payment.status,
            )}`}
          >
            {payment.status}
          </span>
        </td>

        <td>
          {payment.status === "PENDING" ? (
            <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700">
              Pay Now
            </button>
          ) : (
            "-"
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Payments</h2>

      <Card className="p-4 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b h-12">
              <th>#</th>
              {/* <th>Month</th> */}
              <th>Billing cycle</th>
              <th>Amount</th>
              <th>Due Date/ Paid Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>{renderRows()}</tbody>
        </table>

        <div className="flex justify-end mt-4">
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
      </Card>
    </div>
  );
}
