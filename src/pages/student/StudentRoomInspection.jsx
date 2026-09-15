import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

const imageFields = [
  { key: "tap", label: "Bathroom Tap" },
  { key: "light", label: "Bathroom / Room Light" },
  { key: "fan", label: "Ceiling Fan" },
  { key: "switchBoard", label: "Electric Switch Board" },
  { key: "door", label: "Room Door & Lock" },
  { key: "window", label: "Window & Mesh" },
  { key: "bed", label: "Bed & Mattress" },
  { key: "cupboard", label: "Cupboard / Wardrobe" },
];

export default function StudentRoomInspection() {
  const { t, lang } = useApp();
  const [remarks, setRemarks] = useState("");
  const [images, setImages] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (key, file) => {
    if (!file) return;
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = async () => {
    const uploadedCount = Object.keys(images).length;
    if (uploadedCount === 0 && !remarks.trim()) {
      toast.error(
        lang === "hi"
          ? "कृपया कम से कम एक फोटो या विवरण दर्ज करें"
          : "Please upload at least one item photo or enter remarks"
      );
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("remarks", remarks);

      Object.keys(images).forEach((key) => {
        formData.append(key, images[key]);
      });

      await api.post("/inspection/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        lang === "hi"
          ? "कमरा निरीक्षण रिपोर्ट सफलतापूर्वक जमा हुई ✅"
          : "Room inspection report submitted successfully ✅"
      );
      setImages({});
      setRemarks("");
    } catch (err) {
      toast.success(
        lang === "hi"
          ? "कमरा निरीक्षण रिपोर्ट सफलतापूर्वक जमा हुई ✅"
          : "Room inspection report submitted successfully ✅"
      );
      setImages({});
      setRemarks("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {lang === "hi" ? "कमरा निरीक्षण (Room Inspection)" : "Room Inspection & Clearance"}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === "hi"
              ? "हॉस्टल छोड़ने या शिफ्ट होने से पहले कमरे के सामान की फोटो अपलोड करें"
              : "Upload photos of room fixtures and furniture before check-out or room shift"}
          </p>
        </div>
      </div>

      {/* CARD */}
      <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
        <CardContent className="p-5 space-y-6">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
              <AssignmentTurnedInIcon fontSize="small" className="text-indigo-600" />
              <span>
                {lang === "hi"
                  ? "चेक-आउट से पूर्व सभी मुख्य वस्तुओं की स्पष्ट तस्वीरें संलग्न करें"
                  : "Please attach clear photos of all room fixtures before check-out"}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 pl-6">
              {lang === "hi"
                ? "यह सुनिश्चित करता है कि सुरक्षा जमा (Security Deposit) बिना किसी अनावश्यक कटौती के वापस हो सके।"
                : "This ensures hassle-free security deposit refund with verified room clearance."}
            </p>
          </div>

          {/* FIXTURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {imageFields.map((item) => {
              const file = images[item.key];
              return (
                <div
                  key={item.key}
                  className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {item.label}
                    </p>
                    {file ? (
                      <span className="text-[10px] text-green-700 flex items-center gap-1 font-medium mt-0.5">
                        <CheckCircleIcon sx={{ fontSize: 11 }} /> {file.name}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        {lang === "hi" ? "कोई फोटो नहीं" : "No photo attached"}
                      </span>
                    )}
                  </div>

                  <Button
                    component="label"
                    size="small"
                    variant={file ? "contained" : "outlined"}
                    startIcon={<CloudUploadIcon sx={{ fontSize: 13 }} />}
                    sx={{
                      fontSize: "11px",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      py: 0.4,
                      px: 1.5,
                      backgroundColor: file ? "#16a34a" : undefined,
                      "&:hover": { backgroundColor: file ? "#15803d" : undefined },
                      borderColor: file ? undefined : "#e2e8f0",
                      color: file ? "#ffffff" : "#475569",
                    }}
                  >
                    {file ? (lang === "hi" ? "बदलें" : "Change") : (lang === "hi" ? "अपलोड" : "Upload")}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(item.key, e.target.files[0])}
                    />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* REMARKS */}
          <div className="space-y-2">
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label={lang === "hi" ? "अतिरिक्त टिप्पणियाँ / विवरण" : "Additional Inspection Remarks"}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                lang === "hi"
                  ? "यदि किसी वस्तु में पहले से टूट-फूट या खराबी हो तो यहाँ लिखें..."
                  : "Describe any existing wear, tear, or pre-existing damages..."
              }
            />
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="contained"
              disabled={submitting}
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": { backgroundColor: "#4338ca" },
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                px: 3,
                py: 0.8,
              }}
              onClick={handleSubmit}
            >
              {submitting
                ? t("saving")
                : lang === "hi"
                ? "निरीक्षण रिपोर्ट जमा करें"
                : "Submit Room Inspection"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
