import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import Pagination from "../../components/common/Pagination.jsx";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    // ✅ DUMMY DATA
    setNotifications([
      {
        message: "Your payment for April 2024 has been received.",
        date: "28 Apr 2024, 10:30 AM",
      },
      {
        message: "Your complaint #CMP1011 is in progress.",
        date: "25 Apr 2024, 04:15 PM",
      },
      {
        message: "Rent for May 2024 is due on 05 May 2024.",
        date: "24 Apr 2024, 09:00 AM",
      },
      {
        message: "Water maintenance scheduled on 30 Apr at 5 PM.",
        date: "23 Apr 2024, 06:45 PM",
      },
      {
        message: "Your complaint #CMP1010 has been resolved.",
        date: "20 Apr 2024, 11:30 AM",
      },
    ]);
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <button className="text-indigo-600 text-sm">Mark all as read</button>
      </div>

      <Card className="p-4 rounded-xl">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-500">{n.date}</p>
            </div>

            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
          </div>
        ))}
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
