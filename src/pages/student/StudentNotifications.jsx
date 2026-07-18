// import { useEffect, useState } from "react";
// import { Card } from "@mui/material";
// import Pagination from "../../components/common/Pagination.jsx";

// export default function StudentNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);

//   useEffect(() => {
//     // ✅ DUMMY DATA
//     setNotifications([
//       {
//         message: "Your payment for April 2024 has been received.",
//         date: "28 Apr 2024, 10:30 AM",
//       },
//       {
//         message: "Your complaint #CMP1011 is in progress.",
//         date: "25 Apr 2024, 04:15 PM",
//       },
//       {
//         message: "Rent for May 2024 is due on 05 May 2024.",
//         date: "24 Apr 2024, 09:00 AM",
//       },
//       {
//         message: "Water maintenance scheduled on 30 Apr at 5 PM.",
//         date: "23 Apr 2024, 06:45 PM",
//       },
//       {
//         message: "Your complaint #CMP1010 has been resolved.",
//         date: "20 Apr 2024, 11:30 AM",
//       },
//     ]);
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-lg font-semibold">Notifications</h2>

//         <button className="text-indigo-600 text-sm">Mark all as read</button>
//       </div>

//       <Card className="p-4 rounded-xl">
//         {notifications.map((n, i) => (
//           <div
//             key={i}
//             className="flex justify-between items-center border-b py-3"
//           >
//             <div>
//               <p className="text-sm">{n.message}</p>
//               <p className="text-xs text-gray-500">{n.date}</p>
//             </div>

//             <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
//           </div>
//         ))}
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
import { Card, Button } from "@mui/material";
import Pagination from "../../components/common/Pagination";
import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";
import { formatDateForDisplay } from "../../utils/formatDate";
import { toast } from "react-toastify";

export default function StudentNotifications() {
  const auth = getAuthData();
  const hostelId = auth?.hostelsId;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notification/student/all", {
        params: {
          hostelId,
          pageNo: page,
          pageSize: 10,
        },
      });

      const data = response.data;

      setNotifications(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hostelId) {
      fetchNotifications();
    }
  }, [page, hostelId]);

  const markAllAsRead = async () => {
    try {
      await api.put("/notification/student/read-all", {
        hostelId,
      });

      toast.success("All notifications marked as read.");

      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notifications.");
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <Button size="small" variant="text" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <Card className="p-4 rounded-xl shadow-sm">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications found.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>

                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {formatDateForDisplay(notification.createdAt)}
                </p>
              </div>

              {!notification.read && (
                <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              )}
            </div>
          ))
        )}

        <div className="flex justify-end mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
            maxVisible={5}
            label="notifications"
          />
        </div>
      </Card>
    </div>
  );
}
