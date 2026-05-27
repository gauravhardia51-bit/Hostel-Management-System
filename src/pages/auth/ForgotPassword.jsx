import React, { useState } from "react";
import { Card, CardContent, TextField, Button } from "@mui/material";

import ApartmentIcon from "@mui/icons-material/Apartment";

import api from "../../api/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      await api.post(`/send/otp?email=${email}&type=forgot`);

      toast.success("OTP sent successfully");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex justify-center items-center">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <ApartmentIcon className="text-white" fontSize="large" />
              </div>
            </div>

            <h2 className="text-2xl font-bold">Forgot Password</h2>

            <p className="text-gray-500 text-sm">
              Enter your email to receive OTP
            </p>
          </div>

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: "12px",
              textTransform: "none",
            }}
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
