import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Avatar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";
import BadgeIcon from "@mui/icons-material/Badge";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import api from "../../api/Api.jsx";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";
import { getAuthData } from "../../utils/auth";
import { formatDateForDisplay } from "../../utils/formatDate";

export default function StudentDocumentsModal({ open, onClose, student, hostelId }) {
  const { lang } = useApp();
  const auth = getAuthData();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Reject Reason Dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const documentSlots = [
    {
      type: "AADHAAR",
      title: lang === "hi" ? "आधार कार्ड" : "Aadhaar Card",
      subtitle: lang === "hi" ? "सरकारी पहचान प्रमाण पत्र" : "Government Identity Proof",
      icon: <BadgeIcon className="text-indigo-600 text-2xl" />,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      type: "PAN",
      title: lang === "hi" ? "पैन कार्ड" : "PAN Card",
      subtitle: lang === "hi" ? "स्थायी खाता संख्या कार्ड" : "Permanent Account Number Card",
      icon: <CreditCardIcon className="text-blue-600 text-2xl" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      type: "PHOTO",
      title: lang === "hi" ? "छात्र फोटो" : "Student Photo",
      subtitle: lang === "hi" ? "पासपोर्ट साइज फोटोग्राफ" : "Passport Size Photograph",
      icon: <AccountBoxIcon className="text-green-600 text-2xl" />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      type: "OTHER",
      title: lang === "hi" ? "अन्य दस्तावेज" : "Other Document",
      subtitle: lang === "hi" ? "कॉलेज आईडी, एग्रीमेंट या अन्य" : "College ID, Rental Agreement, or Other",
      icon: <InsertDriveFileIcon className="text-amber-600 text-2xl" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const fetchDocuments = async () => {
    if (!student?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/owner/students/${student.id}/documents`, {
        params: {
          hostelId: hostelId || undefined,
          ownerUserId: auth?.user?.id || undefined,
        },
      });

      if (res.data?.payLoad) {
        setDocuments(res.data.payLoad);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error("Failed to load student documents:", err);
      // Fallback try with generic owner all
      try {
        const fallbackRes = await api.get("/student/document/owner/all", {
          params: {
            studentId: student.id,
            hostelId: hostelId || undefined,
            ownerUserId: auth?.user?.id || undefined,
          },
        });
        if (fallbackRes.data?.payLoad) {
          setDocuments(fallbackRes.data.payLoad);
        }
      } catch (fallbackErr) {
        toast.error(
          fallbackErr.response?.data?.message ||
            (lang === "hi" ? "दस्तावेज लोड करने में असमर्थ" : "Failed to load student documents")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && student?.id) {
      fetchDocuments();
    }
  }, [open, student?.id]);

  const handleVerify = async (docId, status, reason = null) => {
    try {
      setActionLoadingId(docId);
      await api.put("/student/document/verify", {
        id: docId,
        status: status,
        rejectionReason: reason,
        verifiedById: auth?.user?.id,
      });

      toast.success(
        status === "VERIFIED"
          ? lang === "hi"
            ? "दस्तावेज सत्यापित किया गया ✅"
            : "Document marked as Verified ✅"
          : lang === "hi"
          ? "दस्तावेज अस्वीकृत किया गया ❌"
          : "Document marked as Rejected ❌"
      );

      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectDialog = (docId) => {
    setRejectingDocId(docId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingDocId) return;
    await handleVerify(rejectingDocId, "REJECTED", rejectionReason || "Document rejected by owner");
    setRejectDialogOpen(false);
    setRejectingDocId(null);
  };

  const handleDownload = (doc) => {
    const baseURL = api.defaults.baseURL || "http://localhost:9001/rentrova/api/v1";
    const downloadUrl = `${baseURL}/file/download?fileName=${encodeURIComponent(doc.filePath)}`;
    window.open(downloadUrl, "_blank");
  };

  const handlePreview = (doc) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getDocStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
            <CheckCircleIcon sx={{ fontSize: 12 }} /> {lang === "hi" ? "सत्यापित" : "Verified"}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
            <CancelIcon sx={{ fontSize: 12 }} /> {lang === "hi" ? "अस्वीकृत" : "Rejected"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">
            <HourglassEmptyIcon sx={{ fontSize: 12 }} /> {lang === "hi" ? "समीक्षाधीन" : "Pending Review"}
          </span>
        );
    }
  };

  const verifiedCount = documents.filter((d) => d.status === "VERIFIED").length;
  const pendingCount = documents.filter((d) => d.status === "PENDING" || !d.status).length;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", maxHeight: "90vh" },
        }}
      >
        {/* MODAL HEADER */}
        <DialogTitle className="flex justify-between items-center bg-white border-b border-gray-100 py-3.5 px-6">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                bgcolor: "#4f46e5",
                width: 42,
                height: 42,
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: "10px",
              }}
            >
              {student?.name?.charAt(0)}
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-800">
                  {student?.name}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    student?.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {student?.status || "ACTIVE"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {lang === "hi" ? "छात्र दस्तावेज एवं केवाईसी सत्यापन" : "Student Documents & KYC Verification"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDocuments}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                borderColor: "#e2e8f0",
                color: "#475569",
                "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
              }}
            >
              {lang === "hi" ? "रिफ्रेश" : "Refresh"}
            </Button>
            <IconButton size="small" onClick={onClose} sx={{ color: "#64748b" }}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        {/* MODAL BODY */}
        <DialogContent className="p-5 space-y-5 bg-slate-50/50">
          {/* STUDENT QUICK INFO & STATS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <MeetingRoomIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium truncate">{lang === "hi" ? "कमरा संख्या" : "Room Number"}</p>
                <p className="text-xs font-bold text-gray-800 truncate">
                  {student?.roomNumber ? `Room ${student.roomNumber}` : "Not Assigned"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <PhoneIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium truncate">{lang === "hi" ? "फ़ोन नंबर" : "Phone"}</p>
                <p className="text-xs font-bold text-gray-800 truncate">
                  {student?.phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-50 text-green-600 shrink-0">
                <CheckCircleIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium truncate">{lang === "hi" ? "सत्यापित दस्तावेज" : "Verified Docs"}</p>
                <p className="text-xs font-bold text-green-600 truncate">
                  {verifiedCount} / {documents.length}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-50 text-yellow-800 shrink-0">
                <HourglassEmptyIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium truncate">{lang === "hi" ? "समीक्षा हेतु लंबित" : "Pending Review"}</p>
                <p className="text-xs font-bold text-yellow-800 truncate">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          {/* DOCUMENTS GRID */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
              {lang === "hi" ? "अपलोड किए गए दस्तावेज" : "Uploaded KYC Documents"}
            </h4>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <CircularProgress size={28} sx={{ color: "#4f46e5" }} />
                <p className="text-xs text-gray-500 mt-2">
                  {lang === "hi" ? "दस्तावेज लोड हो रहे हैं..." : "Loading documents..."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {documentSlots.map((slot) => {
                  const uploadedDoc = documents.find((d) => d.documentType === slot.type);
                  const isActionBusy = actionLoadingId === uploadedDoc?.id;

                  return (
                    <div
                      key={slot.type}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-shadow ${
                        uploadedDoc
                          ? "bg-white border-gray-100 shadow-sm hover:shadow-md"
                          : "bg-slate-50/60 border-dashed border-gray-200"
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-2.5">
                          <div className={`p-2 rounded-lg ${slot.iconBg} ${slot.iconColor}`}>
                            {slot.icon}
                          </div>
                          {uploadedDoc ? (
                            getDocStatusBadge(uploadedDoc.status)
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                              {lang === "hi" ? "अपलोड नहीं" : "Not Uploaded"}
                            </span>
                          )}
                        </div>

                        {/* Title & info */}
                        <h5 className="font-bold text-gray-800 text-sm">
                          {uploadedDoc?.documentName || slot.title}
                        </h5>
                        <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">
                          {slot.subtitle}
                        </p>

                        {uploadedDoc ? (
                          <div className="bg-slate-50 rounded-lg p-2.5 text-xs space-y-1.5 border border-gray-100 mb-3">
                            {uploadedDoc.documentNumber && (
                              <div className="flex justify-between text-[11px]">
                                <span className="text-gray-500">{lang === "hi" ? "नंबर:" : "No:"}</span>
                                <span className="font-mono font-semibold text-gray-800">
                                  {uploadedDoc.documentNumber}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-500">{lang === "hi" ? "फ़ाइल:" : "File:"}</span>
                              <span
                                className="font-medium text-gray-800 truncate max-w-[130px]"
                                title={uploadedDoc.fileName}
                              >
                                {uploadedDoc.fileName}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-500">{lang === "hi" ? "आकार:" : "Size:"}</span>
                              <span className="text-gray-600">
                                {formatFileSize(uploadedDoc.fileSize)}
                              </span>
                            </div>
                            {uploadedDoc.uploadDate && (
                              <div className="flex justify-between text-[11px]">
                                <span className="text-gray-500">{lang === "hi" ? "दिनांक:" : "Date:"}</span>
                                <span className="text-gray-600">
                                  {formatDateForDisplay(uploadedDoc.uploadDate)}
                                </span>
                              </div>
                            )}

                            {uploadedDoc.rejectionReason && uploadedDoc.status === "REJECTED" && (
                              <div className="mt-2 p-2 bg-red-50 rounded text-[11px] text-red-600 border border-red-100">
                                <span className="font-bold">{lang === "hi" ? "कारण: " : "Reason: "}</span>
                                {uploadedDoc.rejectionReason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-gray-400 italic">
                            {lang === "hi" ? "छात्र ने अभी तक यह दस्तावेज अपलोड नहीं किया है।" : "Student has not uploaded this document yet."}
                          </div>
                        )}
                      </div>

                      {/* Document Actions */}
                      {uploadedDoc && (
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {/* Top Row: Preview & Download */}
                          <div className="flex gap-1.5">
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon fontSize="small" />}
                              onClick={() => handlePreview(uploadedDoc)}
                              sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                py: 0.4,
                                borderRadius: "8px",
                                fontWeight: 600,
                                borderColor: "#e2e8f0",
                                color: "#334155",
                                "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                              }}
                            >
                              {lang === "hi" ? "देखें" : "Preview"}
                            </Button>

                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              startIcon={<DownloadIcon fontSize="small" />}
                              onClick={() => handleDownload(uploadedDoc)}
                              sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                py: 0.4,
                                borderRadius: "8px",
                                fontWeight: 600,
                                borderColor: "#86efac",
                                color: "#16a34a",
                                "&:hover": { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
                              }}
                            >
                              {lang === "hi" ? "डाउनलोड" : "Download"}
                            </Button>
                          </div>

                          {/* Verification Actions: Approve / Reject */}
                          <div className="flex gap-1.5">
                            <Button
                              fullWidth
                              size="small"
                              variant="contained"
                              disabled={isActionBusy || uploadedDoc.status === "VERIFIED"}
                              startIcon={
                                isActionBusy ? (
                                  <CircularProgress size={12} color="inherit" />
                                ) : (
                                  <ThumbUpAltIcon sx={{ fontSize: 13 }} />
                                )
                              }
                              onClick={() => handleVerify(uploadedDoc.id, "VERIFIED")}
                              sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                py: 0.4,
                                borderRadius: "8px",
                                fontWeight: 600,
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#15803d" },
                                "&.Mui-disabled": { backgroundColor: "#dcfce7", color: "#86efac" },
                              }}
                            >
                              {lang === "hi" ? "सत्यापित करें" : "Approve"}
                            </Button>

                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              disabled={isActionBusy || uploadedDoc.status === "REJECTED"}
                              startIcon={<ThumbDownAltIcon sx={{ fontSize: 13 }} />}
                              onClick={() => openRejectDialog(uploadedDoc.id)}
                              sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                py: 0.4,
                                borderRadius: "8px",
                                fontWeight: 600,
                                borderColor: "#fca5a5",
                                color: "#dc2626",
                                "&:hover": { borderColor: "#dc2626", backgroundColor: "#fef2f2" },
                                "&.Mui-disabled": { borderColor: "#fee2e2", color: "#fca5a5" },
                              }}
                            >
                              {lang === "hi" ? "अस्वीकृत" : "Reject"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: "1px solid #f1f5f9", backgroundColor: "#fff" }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              textTransform: "none",
              borderRadius: "8px",
              px: 3.5,
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {lang === "hi" ? "बंद करें" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* INLINE PREVIEW MODAL */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", minHeight: "500px" },
        }}
      >
        <DialogTitle className="flex justify-between items-center bg-white border-b border-gray-100 py-3.5 px-5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm">
              {previewDoc?.documentName || "Document Preview"}
            </span>
            {previewDoc?.documentNumber && (
              <Chip
                label={previewDoc.documentNumber}
                size="small"
                variant="outlined"
                sx={{ borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            {previewDoc && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(previewDoc)}
                sx={{
                  textTransform: "none",
                  mr: 1,
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderColor: "#86efac",
                  color: "#16a34a",
                  "&:hover": { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
                }}
              >
                {lang === "hi" ? "डाउनलोड" : "Download"}
              </Button>
            )}
            <IconButton size="small" onClick={() => setPreviewOpen(false)} sx={{ color: "#64748b" }}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="p-4 flex items-center justify-center bg-slate-100 min-h-[450px]">
          {previewDoc ? (
            (() => {
              const baseURL = api.defaults.baseURL || "http://localhost:9001/rentrova/api/v1";
              const isPdf =
                previewDoc.filePath?.toLowerCase().endsWith(".pdf") ||
                previewDoc.fileType?.includes("pdf");
              const viewUrl = `${baseURL}/${
                isPdf ? "file/document" : "file/image"
              }?fileName=${encodeURIComponent(previewDoc.filePath)}`;

              if (isPdf) {
                return (
                  <iframe
                    src={viewUrl}
                    title="PDF Document"
                    className="w-full h-[600px] rounded-lg border-0 bg-white shadow-sm"
                  />
                );
              } else {
                return (
                  <img
                    src={viewUrl}
                    alt={previewDoc.documentName}
                    className="max-h-[600px] max-w-full object-contain rounded-lg shadow-md bg-white"
                  />
                );
              }
            })()
          ) : (
            <p className="text-gray-500 text-xs">No document to preview</p>
          )}
        </DialogContent>
      </Dialog>

      {/* REJECTION REASON DIALOG */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", p: 1 },
        }}
      >
        <DialogTitle className="font-bold text-sm text-gray-800">
          {lang === "hi" ? "दस्तावेज अस्वीकृत करने का कारण" : "Document Rejection Reason"}
        </DialogTitle>
        <DialogContent>
          <p className="text-xs text-gray-500 mb-3">
            {lang === "hi"
              ? "कृपया छात्र को बताएं कि दस्तावेज क्यों अस्वीकृत किया जा रहा है ताकि वे सही दस्तावेज पुनः अपलोड कर सकें।"
              : "Please specify why the document is being rejected so the student can re-upload a valid copy."}
          </p>
          <TextField
            fullWidth
            autoFocus
            multiline
            rows={3}
            size="small"
            placeholder={
              lang === "hi"
                ? "उदा. फ़ोटो स्पष्ट नहीं है / धुंधली प्रतिलिपि"
                : "e.g. Document image is blurry or expired"
            }
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setRejectDialogOpen(false)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              color: "#64748b",
              borderColor: "#cbd5e1",
            }}
          >
            {lang === "hi" ? "रद्द करें" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmReject}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            {lang === "hi" ? "अस्वीकृत करें" : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
