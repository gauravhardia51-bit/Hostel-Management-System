import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button } from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api/Api";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(120);

  // countdown timer
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // redirect if page opened directly
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, []);

  // MM:SS
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(1, "0")}`;
  };

  // OTP input
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setOtp(value.slice(0, 6));

    if (value) {
      setOtpError("");
    }
  };

  // verify
  const handleVerify = async () => {
    // validation
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/verify/user", {
        params: {
          email,
          token: otp,
        },
      });

      toast.success("OTP verified successfully ✅");

      // optional token save
      if (response.data?.payLoad?.accessToken) {
        localStorage.setItem("token", response.data.payLoad.accessToken);
      }

      navigate("/");
    } catch (error) {
      console.log(error);

      // clear wrong OTP
      setOtp("");

      setOtpError("");

      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // resend otp
  const handleResendOtp = async () => {
    try {
      await api.post(`/send/otp?email=${email}`);

      toast.success("OTP resent successfully ✅");

      // clear old otp
      setOtp("");

      setOtpError("");

      // restart timer
      setSeconds(120);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Unable to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex justify-center items-center p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-600">Verify OTP</h1>

            <p className="text-sm text-gray-500 mt-2">
              OTP sent to
              <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            size="small"
            error={!!otpError}
            helperText={otpError}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: "12px",
              textTransform: "none",
            }}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center mt-4">
            {seconds > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-indigo-600">
                  {formatTime()}
                </span>
              </p>
            ) : (
              <Button
                onClick={handleResendOtp}
                sx={{
                  textTransform: "none",
                }}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
