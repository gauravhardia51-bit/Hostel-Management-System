import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApartmentIcon from "@mui/icons-material/Apartment";
import api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userCode: "",
    password: "",
    hostelId: "",
  });

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await api.post(
        "http://localhost:9001/rentrova/api/auth/login",
        {
          userCode: form.userCode,
          password: form.password,
        },
      );

      // ===== JWT TOKEN =====
      const token = response.data.payLoad.accessToken;
      //   console.log(response.data);
      //   console.log(localStorage.getItem("token"));
      // ===== SAVE TOKEN =====
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      const hostelRes = await api.get("/hostel/all", {
        params: {
          userId: decoded.userId,
        },
      });

      // // ===== SAVE HOSTEL =====
      // const hostels = response.data.payLoad;
      // localStorage.setItem("hostels", JSON.stringify(hostels));
      // ===== SAVE USER =====

      const userRes = await api.get("/users/id", {
        params: {
          id: decoded.userId,
        },
      });

      localStorage.setItem("user", JSON.stringify(userRes.data.payLoad));
      localStorage.setItem("hostels", JSON.stringify(hostelRes.data.payLoad));

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <ApartmentIcon className="text-white" fontSize="large" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">RentRova</h1>

            <p className="text-sm text-gray-500 mt-1">
              Hostel Management System
            </p>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>

            <p className="text-sm text-gray-500">Welcome back 👋</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="User Code"
              name="userCode"
              value={form.userCode}
              onChange={handleChange}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Hostel Select */}
          {/* <div className="mb-4">
            <Select
              fullWidth
              displayEmpty
              size="small"
              name="hostelId"
              value={form.hostelId}
              onChange={handleChange}
            >
              <MenuItem value="">Select Hostel</MenuItem>

              {hostels.map((hostel) => (
                <MenuItem key={hostel.id} value={hostel.id}>
                  {hostel.id} - {hostel.hostelName}
                </MenuItem>
              ))}
            </Select>
          </div> */}

          {/* Remember */}
          <div className="flex justify-between items-center mb-5">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<span className="text-sm">Remember me</span>}
            />

            <button className="text-sm text-indigo-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              paddingY: "10px",
              fontWeight: 600,
            }}
          >
            {loading ? "Please wait..." : "Login"}
          </Button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2026 RentRova. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
