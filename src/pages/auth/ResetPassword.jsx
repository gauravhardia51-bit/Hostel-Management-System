import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  TextField,
  Button
} from "@mui/material";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import api from "../../api/Api";
import { toast } from "react-toastify";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [data, setData] = useState({
    token: "",
    newPass: "",
    confPass: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(120);

  // redirect if page opened directly
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, []);

  // countdown timer
  useEffect(() => {

    if (seconds <= 0) return;

    const timer = setInterval(() => {

      setSeconds(prev => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [seconds]);

  // MM:SS
  const formatTime = () => {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e) => {

    let { name, value } = e.target;

    // OTP only digits + max 6
    if (name === "token") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {

    let tempErrors = {};

    if (!data.token.trim()) {

      tempErrors.token =
        "OTP is required";

    }
    else if (
      data.token.length !== 6
    ) {

      tempErrors.token =
        "OTP must be 6 digits";

    }

    if (!data.newPass.trim()) {

      tempErrors.newPass =
        "New Password is required";
    }

    if (!data.confPass.trim()) {

      tempErrors.confPass =
        "Confirm Password is required";

    }
    else if (
      data.newPass !==
      data.confPass
    ) {

      tempErrors.confPass =
        "Passwords do not match";
    }

    setErrors(tempErrors);

    return Object.keys(
      tempErrors
    ).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      await api.post(
        "/reset/password",
        {
          validatedFlag: true,
          email,
          token: data.token,
          newPass: data.newPass,
          confPass: data.confPass
        }
      );

      toast.success(
        "Password reset successfully ✅"
      );

      navigate("/login");

    }
    catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Reset failed"
      );

      setData(prev => ({
        ...prev,
        token: ""
      }));

    }
    finally {

      setLoading(false);
    }
  };

  // resend OTP
  const handleResendOtp = async () => {

    try {

      await api.post(
        `/send/otp?email=${email}&type=forgot`
      );

      toast.success(
        "OTP resent successfully ✅"
      );

      setData(prev => ({
        ...prev,
        token: ""
      }));

      setErrors(prev => ({
        ...prev,
        token: ""
      }));

      // restart timer
      setSeconds(120);

    }
    catch(error){

      toast.error(
        error?.response?.data?.message ||
        "Unable to resend OTP"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex justify-center items-center p-4">

      <Card className="w-full max-w-md rounded-3xl shadow-xl">

        <CardContent className="p-8">

          <div className="text-center mb-6">

            <h2 className="text-2xl font-bold text-indigo-600">

              Reset Password

            </h2>

            <p className="text-sm text-gray-500 mt-2">

              OTP sent to
              <br />

              <span className="font-medium">
                {email}
              </span>

            </p>

          </div>

          <TextField
            fullWidth
            label="Enter OTP"
            name="token"
            value={data.token}
            onChange={handleChange}
            error={!!errors.token}
            helperText={errors.token}
            inputProps={{
              maxLength: 6
            }}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="New Password"
            name="newPass"
            type="password"
            value={data.newPass}
            onChange={handleChange}
            error={!!errors.newPass}
            helperText={errors.newPass}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confPass"
            type="password"
            value={data.confPass}
            onChange={handleChange}
            error={!!errors.confPass}
            helperText={errors.confPass}
            size="small"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt:3,
              borderRadius:"12px",
              textTransform:"none"
            }}
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

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
                  textTransform:"none"
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