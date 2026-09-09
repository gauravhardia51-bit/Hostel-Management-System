import { useEffect, useState } from "react";
import { Card, CardContent, Button, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import api from "../../api/Api";
import Pagination from "../../components/common/Pagination";
import CustomSelect from "../../components/common/CustomSelect";
import { getAuthData } from "../../utils/auth";
import { formatDateForDisplay } from "../../utils/formatDate";
import RoomInspectionDrawer from "../../feature/RoomInspection/RoomInspectionDrawer";

export default function RoomInspectionList() {
  const auth = getAuthData();
  const hostelId = auth?.hostelId;
  const [loading, setLoading] = useState(false);
  const [inspectionList, setInspectionList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  const fetchInspectionList = async () => {
    try {
      setLoading(true);

      const res = await api.get("/inspection/all", {
        params: {
          hostelId,
          pageNo: page,
          pageSize: 10,
          search,
          status,
        },
      });

      setInspectionList(res.data.payLoad || []);
      setTotalPages(res.data.totalPage);
      setTotalRows(res.data.totalRow);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInspectionList();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, search, status]);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Room Inspection</h2>
      </div>

      {/* Filters */}

      <div className="flex gap-3 mb-5">
        <div className="flex items-center bg-white border rounded-md px-2 w-72">
          <SearchIcon className="text-gray-400" />

          <input
            className="flex-1 px-2 py-2 outline-none text-sm"
            placeholder="Search student..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <CustomSelect
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) return "All Status";

            return selected;
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="APPROVED">Approved</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </CustomSelect>
      </div>

      {/* Table */}

      <Card>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th>#</th>

                <th>Student</th>

                <th>Room</th>

                <th>Submitted</th>

                <th>Status</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : inspectionList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    No Inspection Found
                  </td>
                </tr>
              ) : (
                inspectionList.map((i, index) => (
                  <tr key={i.id} className="border-b h-14">
                    <td>{page * 10 + index + 1}</td>

                    <td>{i.studentName}</td>

                    <td>{i.roomNumber}</td>

                    <td>{formatDateForDisplay(i.createdAt)}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          i.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : i.status === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }
                        `}
                      >
                        {i.status}
                      </span>
                    </td>

                    <td className="text-center">
                      <IconButton
                        onClick={() => {
                          setSelectedInspection(i);
                          setOpen(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end mt-5">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalRows}
              pageSize={10}
              onPageChange={setPage}
              label="inspection"
            />
          </div>
        </CardContent>
      </Card>

      <RoomInspectionDrawer
        open={open}
        inspection={selectedInspection}
        onClose={() => {
          setOpen(false);
          fetchInspectionList();
        }}
      />
    </div>
  );
}
