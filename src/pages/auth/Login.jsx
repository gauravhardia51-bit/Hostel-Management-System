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
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApartmentIcon from "@mui/icons-material/Apartment";

import api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userCode: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // ✅ LOGIN API
      const response = await api.post("/auth/login", {
        userCode: form.userCode,
        password: form.password,
      });
      //console.log("Login Response:", response?.data?.payLoad);
      const token = response?.data?.payLoad?.accessToken;

      if (!token) {
        alert("Invalid login response");
        return;
      }

      // ✅ STORE AUTH DATA (Token + User + Hostels)
      const auth = {
        token,
        user: response.data.payLoad.user || null,
        hostels: response.data.payLoad.hostels || [],
        hostelId: Number(response.data.payLoad.hostels?.[0]?.id) || null,
      };

      setAuthData(auth);

      // ✅ REDIRECT
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
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

          {/* User Code */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="User Code"
              name="userCode"
              value={form.userCode}
              onChange={handleChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
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
            InputProps={{
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
            }}
          />

          {/* Remember */}
          <div className="flex justify-between items-center mb-5">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<span className="text-sm">Remember me</span>}
            />

            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
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

          {/* Signup */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>

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
