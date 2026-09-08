import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
        <div className="bg-indigo-600 text-white px-2 text-sm rounded rotate-12 inline-block absolute -translate-y-12">
          Page Not Found
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6">Oops! Looks like you're lost</h2>
        <p className="text-gray-500 mt-2 mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: "#4f46e5",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            padding: "10px 24px",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)"
          }}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
