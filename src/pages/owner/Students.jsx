import React from "react";
import "./Students.css";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
} from "@mui/material";

import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import TopBar from "../../components/topbar/TopBar.jsx";
import api from "../../api/Api.jsx";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/RoutesConstant.js";
import { useEffect, useState } from "react";
import AddStudentDrawer from "../../feature/students/AddStudentDrawer.jsx";
import { formatDateForDisplay } from "../../utils/formatDate.js";
import Pagination from "../../components/common/Pagination.jsx";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Students() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit | view
  //const [hostelId, setHostelId] = useState("");
  const getStatusStyle = (status) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-500";
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/student/all", {
        params: {
          pageNo: page,
          pageSize: 10,
          hostelId: localStorage.getItem("hostelId"),
          search: search,
          //phone: search,
        },
      });

      const response = await api.get("/room/all", {
        params: {
          //pageNo: page,
          //pageSize: 10,
          hostelId: localStorage.getItem("hostelId"),
          //search: search,
        },
      });

      const data = res.data;
      const roomData = response.data;
      //console.log("Student Response: ", data);
      setRooms(roomData.payLoad || []);
      setStudents(data.payLoad || []);
      setTotalPages(data.totalPage || 0);
      setTotalElements(data.totalRow || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, search]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");

    if (!confirm) return;

    try {
      await api.delete("/student/delete", {
        params: { id },
      });

      toast.success("Deleted successfully ✅");
      fetchStudents(); // refresh
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌");
    }
  };

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

    if (students.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No students found
          </td>
        </tr>
      );
    }

    return students.map((s, index) => (
      <tr key={s.id} className="border-b hover:bg-gray-50">
        <td className="py-3">{page * 10 + index + 1}</td>
        <td>{s.name}</td>
        <td>{s.phone}</td>
        <td>{s.roomNumber}</td>

        <td>{formatDateForDisplay(s.joinDate)}</td>

        <td>
          <span
            className={`px-2 py-1 text-[10px] rounded-md font-semibold ${getStatusStyle(
              s.status,
            )}`}
          >
            {s.status || "N/A"}
          </span>
        </td>
        <td className="text-center space-x-1">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedStudent(s);
              setMode("edit");
              setOpen(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={() => handleDelete(s.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </td>
      </tr>
    ));
  };

  const handleSave = async (formData) => {
    console.log("Form Data in Students.jsx: ", formData);
    try {
      if (mode === "edit") {
        await api.put(`/student/update`, formData);
        toast.success("Student updated successfully ✅");
      } else {
        await api.post("/student/add", formData);
        toast.success("Student added successfully ✅");
      }
      fetchStudents(); // refresh table
      setOpen(false);
      setSelectedStudent(null);
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
          <h2 className="text-lg font-semibold">Students</h2>
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
            setSelectedStudent(null);
            setMode("add");
            setOpen(true);
          }}
        >
          Add Student
        </Button>
        <AddStudentDrawer
          key={selectedStudent?.id || mode}
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          rooms={rooms}
          editData={selectedStudent}
          mode={mode}
        />
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search student by name or phone..."
            className="w-full px-2 py-2 outline-none text-sm"
            value={search}
            onChange={(e) => {
              setPage(0); // reset page
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
                <th>Name</th>
                <th>Phone</th>
                <th>Room</th>
                <th>Join Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>{renderRows()}</tbody>
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
        </CardContent>
      </Card>
    </div>
  );
}
