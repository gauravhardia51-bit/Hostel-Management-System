import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination.jsx";

export default function StudentPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // ================= DUMMY DATA =================
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        month: "April 2024",
        amount: 5000,
        dueDate: "2024-04-05",
        paidDate: "2024-04-05",
        status: "PAID",
      },
      {
        id: 2,
        month: "May 2024",
        amount: 5000,
        dueDate: "2024-05-05",
        paidDate: null,
        status: "PENDING",
      },
      {
        id: 3,
        month: "June 2024",
        amount: 5000,
        dueDate: "2024-06-05",
        paidDate: null,
        status: "PENDING",
      },
      {
        id: 4,
        month: "July 2024",
        amount: 5000,
        dueDate: "2024-07-05",
        paidDate: null,
        status: "UPCOMING",
      },
    ];

    setPayments(dummyData);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Payments</h2>

      <Card className="p-4 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left">
              <th>#</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, index) => (
              <tr key={p.id} className="border-t h-12">
                <td>{index + 1}</td>

                <td>{p.month}</td>

                <td>₹{p.amount}</td>

                <td>{new Date(p.dueDate).toLocaleDateString("en-IN")}</td>

                <td>
                  {p.paidDate
                    ? new Date(p.paidDate).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs
                      ${
                        p.status === "PAID"
                          ? "bg-green-100 text-green-600"
                          : p.status === "PENDING"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                      }
                    `}
                  >
                    {p.status}
                  </span>
                </td>

                <td>
                  {p.status === "PENDING" && (
                    <button className="bg-indigo-500 text-white px-3 py-1 rounded text-xs">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Footer */}
        <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
          {/* <span>
                    Showing {students.length === 0 ? 0 : page * 10 + 1} to{" "}
                    {page * 10 + students.length} of {totalElements} students
                  </span> */}

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
            maxVisible={5}
            label="students"
          />
        </div>
      </Card>
    </div>
  );
}
