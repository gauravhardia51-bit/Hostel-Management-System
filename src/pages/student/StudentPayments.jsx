// import { useEffect, useState } from "react";
// import { Card } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Pagination from "../../components/common/Pagination.jsx";

// export default function StudentPayments() {
//   const navigate = useNavigate();

//   const [payments, setPayments] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);

//   // ================= DUMMY DATA =================
//   useEffect(() => {
//     const dummyData = [
//       {
//         id: 1,
//         month: "April 2024",
//         amount: 5000,
//         dueDate: "2024-04-05",
//         paidDate: "2024-04-05",
//         status: "PAID",
//       },
//       {
//         id: 2,
//         month: "May 2024",
//         amount: 5000,
//         dueDate: "2024-05-05",
//         paidDate: null,
//         status: "PENDING",
//       },
//       {
//         id: 3,
//         month: "June 2024",
//         amount: 5000,
//         dueDate: "2024-06-05",
//         paidDate: null,
//         status: "PENDING",
//       },
//       {
//         id: 4,
//         month: "July 2024",
//         amount: 5000,
//         dueDate: "2024-07-05",
//         paidDate: null,
//         status: "UPCOMING",
//       },
//     ];

//     setPayments(dummyData);
//   }, []);

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-4">Payments</h2>

//       <Card className="p-4 rounded-xl">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-gray-500 text-left">
//               <th>#</th>
//               <th>Month</th>
//               <th>Amount</th>
//               <th>Due Date</th>
//               <th>Paid Date</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {payments.map((p, index) => (
//               <tr key={p.id} className="border-t h-12">
//                 <td>{index + 1}</td>

//                 <td>{p.month}</td>

//                 <td>₹{p.amount}</td>

//                 <td>{new Date(p.dueDate).toLocaleDateString("en-IN")}</td>

//                 <td>
//                   {p.paidDate
//                     ? new Date(p.paidDate).toLocaleDateString("en-IN")
//                     : "-"}
//                 </td>

//                 <td>
//                   <span
//                     className={`px-2 py-1 rounded text-xs
//                       ${
//                         p.status === "PAID"
//                           ? "bg-green-100 text-green-600"
//                           : p.status === "PENDING"
//                             ? "bg-red-100 text-red-600"
//                             : "bg-gray-100 text-gray-500"
//                       }
//                     `}
//                   >
//                     {p.status}
//                   </span>
//                 </td>

//                 <td>
//                   {p.status === "PENDING" && (
//                     <button className="bg-indigo-500 text-white px-3 py-1 rounded text-xs">
//                       Pay Now
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Footer */}
//         <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
//           {/* <span>
//                     Showing {students.length === 0 ? 0 : page * 10 + 1} to{" "}
//                     {page * 10 + students.length} of {totalElements} students
//                   </span> */}

//           {/* Pagination */}
//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             totalElements={totalElements}
//             pageSize={10}
//             onPageChange={setPage}
//             maxVisible={5}
//             label="students"
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }

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

        <td>{payment.month}</td>

        <td>₹ {payment.amount}</td>

        <td>{formatDateForDisplay(payment.dueDate) || "-"}</td>

        <td>{formatDateForDisplay(payment.paidAt) || "-"}</td>

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
              <th>Month</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
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
