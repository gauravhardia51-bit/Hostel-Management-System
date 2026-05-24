import React, { useState } from "react";

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

  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]: e.target.value
    });

    // remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {

    let tempErrors = {};

    // OTP validation
    if (!data.token.trim()) {

      tempErrors.token =
        "OTP is required";

    }
    else if (!/^\d{6}$/.test(data.token)) {

      tempErrors.token =
        "OTP must be 6 digits";

    }

    // new password
    if (!data.newPass.trim()) {

      tempErrors.newPass =
        "New Password is required";

    }

    // confirm password
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
    catch(error){

      toast.error(
        error?.response?.data?.message ||
        "Reset failed"
      );

      // clear OTP if wrong
      setData(prev => ({
        ...prev,
        token: ""
      }));
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex justify-center items-center">

      <Card className="w-full max-w-md rounded-3xl shadow-xl">

        <CardContent className="p-8">

          <h2 className="text-2xl font-bold text-center mb-6">

            Reset Password

          </h2>

          <TextField
            fullWidth
            label="OTP"
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
          >

            Reset Password

          </Button>

        </CardContent>

      </Card>

    </div>
  );
}