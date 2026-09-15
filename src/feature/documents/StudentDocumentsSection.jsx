import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BadgeIcon from "@mui/icons-material/Badge";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

export default function StudentDocumentsSection({ studentId, userId }) {
  const { t, lang } = useApp();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);

  // Upload Dialog State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeUploadDocType, setActiveUploadDocType] = useState("AADHAAR");
  const [selectedFile, setSelectedFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");

  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fileInputRef = useRef(null);

  const documentSlots = [
    {
      type: "AADHAAR",
      title: lang === "hi" ? "आधार कार्ड" : "Aadhaar Card",
      subtitle: lang === "hi" ? "सरकारी पहचान पत्र (PDF / Image)" : "Government Identity Proof (PDF / Image)",
      icon: <BadgeIcon className="text-indigo-600 text-3xl" />,
      placeholderNumber: "XXXX-XXXX-1234",
    },
    {
      type: "PAN",
      title: lang === "hi" ? "पैन कार्ड" : "PAN Card",
      subtitle: lang === "hi" ? "वित्तीय / कर पहचान पत्र" : "Permanent Account Number Card",
      icon: <CreditCardIcon className="text-blue-600 text-3xl" />,
      placeholderNumber: "ABCDE1234F",
    },
    {
      type: "PHOTO",
      title: lang === "hi" ? "छात्र फोटो" : "Student Photo",
      subtitle: lang === "hi" ? "हाल की पासपोर्ट साइज फोटो" : "Recent Passport Size Photograph",
      icon: <AccountBoxIcon className="text-green-600 text-3xl" />,
      placeholderNumber: "Optional note",
    },
    {
      type: "OTHER",
      title: lang === "hi" ? "अन्य दस्तावेज" : "Other Document",
      subtitle: lang === "hi" ? "कॉलेज आईडी, एग्रीमेंट या अन्य" : "College ID, Rental Agreement, or Other",
      icon: <InsertDriveFileIcon className="text-yellow-600 text-3xl" />,
      placeholderNumber: "Document reference number",
    },
  ];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/document/all", {
        params: {
          studentId: studentId || undefined,
          userId: userId || undefined,
        },
      });
      if (res.data?.payLoad) {
        setDocuments(res.data.payLoad);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId || userId) {
      fetchDocuments();
    }
  }, [studentId, userId]);

  const openUploadModal = (type, defaultTitle) => {
    setActiveUploadDocType(type);
    setDocName(defaultTitle || "");
    setDocNumber("");
    setSelectedFile(null);
    setUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(lang === "hi" ? "फ़ाइल 10MB से कम होनी चाहिए" : "File size must be under 10MB");
      return;
    }

    const allowed = ["pdf", "jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error(lang === "hi" ? "केवल PDF, JPG, PNG, WEBP स्वीकार्य हैं" : "Only PDF, JPG, PNG, WEBP files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error(lang === "hi" ? "कृपया एक फ़ाइल चुनें" : "Please select a file to upload");
      return;
    }

    try {
      setUploadingType(activeUploadDocType);
      const formData = new FormData();
      if (studentId) formData.append("studentId", studentId);
      if (userId) formData.append("userId", userId);
      formData.append("documentType", activeUploadDocType);
      formData.append("documentName", docName || activeUploadDocType);
      if (docNumber) formData.append("documentNumber", docNumber);
      formData.append("file", selectedFile);

      await api.post("/student/document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(lang === "hi" ? "दस्तावेज सफलतापूर्वक अपलोड हुआ ✅" : "Document uploaded successfully ✅");
      setUploadModalOpen(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || (lang === "hi" ? "अपलोड विफल ❌" : "Upload failed ❌"));
    } finally {
      setUploadingType(null);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm(lang === "hi" ? "क्या आप इस दस्तावेज को हटाना चाहते हैं?" : "Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await api.delete("/student/document/delete", {
        params: {
          documentId: docId,
          studentId: studentId || undefined,
          userId: userId || undefined,
        },
      });
      toast.success(lang === "hi" ? "दस्तावेज हटा दिया गया ✅" : "Document removed ✅");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error(lang === "hi" ? "हटाने में त्रुटि ❌" : "Failed to delete ❌");
    }
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
            <CheckCircleIcon sx={{ fontSize: 13 }} /> {lang === "hi" ? "सत्यापित" : "Verified"}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
            <CancelIcon sx={{ fontSize: 13 }} /> {lang === "hi" ? "अस्वीकृत" : "Rejected"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">
            <HourglassEmptyIcon sx={{ fontSize: 13 }} /> {lang === "hi" ? "समीक्षाधीन" : "Pending Review"}
          </span>
        );
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {lang === "hi" ? "छात्र दस्तावेज एवं पहचान पत्र" : "Student Documents & ID Verification"}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === "hi"
              ? "हॉस्टल रिकॉर्ड के लिए आवश्यक पहचान प्रमाण पत्र और दस्तावेज सुरक्षित रूप से अपलोड व प्रबंधित करें"
              : "Securely upload and manage mandatory identification proofs and hostel agreement records"}
          </p>
        </div>

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
            fontWeight: 500,
            borderColor: "#e2e8f0",
            color: "#475569",
          }}
        >
          {lang === "hi" ? "रिफ्रेश" : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentSlots.map((slot) => {
          const uploadedDoc = documents.find((d) => d.documentType === slot.type);
          const isUploading = uploadingType === slot.type;

          return (
            <Card
              key={slot.type}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                uploadedDoc
                  ? "bg-white border-gray-100 shadow-sm"
                  : "bg-slate-50 border-dashed border-gray-200"
              }`}
            >
              <div>
                {/* Header with icon & badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    {slot.icon}
                  </div>
                  {uploadedDoc ? (
                    getDocStatusBadge(uploadedDoc.status)
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {lang === "hi" ? "अपलोड नहीं" : "Not Uploaded"}
                    </span>
                  )}
                </div>

                {/* Title & info */}
                <h4 className="font-bold text-gray-800 text-sm mb-0.5">
                  {uploadedDoc?.documentName || slot.title}
                </h4>
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">
                  {slot.subtitle}
                </p>

                {uploadedDoc && (
                  <div className="bg-slate-50 rounded-lg p-2.5 mb-3 text-xs space-y-1.5 border border-slate-100">
                    {uploadedDoc.documentNumber && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">{lang === "hi" ? "नंबर:" : "No:"}</span>
                        <span className="font-mono font-medium text-gray-700">
                          {uploadedDoc.documentNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">{lang === "hi" ? "फ़ाइल:" : "File:"}</span>
                      <span className="font-medium text-gray-700 truncate max-w-[130px]" title={uploadedDoc.fileName}>
                        {uploadedDoc.fileName || "document"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">{lang === "hi" ? "आकार:" : "Size:"}</span>
                      <span className="text-gray-600">
                        {formatFileSize(uploadedDoc.fileSize)}
                      </span>
                    </div>
                    {uploadedDoc.uploadDate && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">{lang === "hi" ? "दिनांक:" : "Date:"}</span>
                        <span className="text-gray-600">
                          {new Date(uploadedDoc.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-100">
                {uploadedDoc ? (
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <Tooltip title={lang === "hi" ? "देखें / पूर्वावलोकन" : "Preview Document"}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePreview(uploadedDoc)}
                          className="hover:bg-indigo-50"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={lang === "hi" ? "डाउनलोड करें" : "Download File"}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleDownload(uploadedDoc)}
                          className="hover:bg-emerald-50"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={lang === "hi" ? "हटाएं" : "Delete Document"}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDocument(uploadedDoc.id)}
                          className="hover:bg-red-50"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openUploadModal(slot.type, slot.title)}
                      sx={{ textTransform: "none", fontSize: "11px", py: 0.4, px: 1.5, borderRadius: "8px", fontWeight: 500, borderColor: "#e2e8f0", color: "#475569" }}
                    >
                      {lang === "hi" ? "बदलें" : "Replace"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={isUploading ? <CircularProgress size={14} color="inherit" /> : <CloudUploadIcon />}
                    onClick={() => openUploadModal(slot.type, slot.title)}
                    disabled={isUploading}
                    sx={{
                      backgroundColor: "#4f46e5",
                      "&:hover": { backgroundColor: "#4338ca" },
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      py: 0.8,
                    }}
                  >
                    {isUploading ? (lang === "hi" ? "अपलोड हो रहा है..." : "Uploading...") : (lang === "hi" ? "अपलोड करें" : "Upload File")}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upload Dialog Modal */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", p: 1 },
        }}
      >
        <DialogTitle className="flex justify-between items-center font-bold text-gray-800">
          <span>
            {lang === "hi" ? "दस्तावेज अपलोड करें" : "Upload Student Document"} (
            {activeUploadDocType}
            )
          </span>
          <IconButton size="small" onClick={() => setUploadModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="space-y-4">
          <TextField
            fullWidth
            size="small"
            label={lang === "hi" ? "दस्तावेज का नाम" : "Document Title / Name"}
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label={lang === "hi" ? "दस्तावेज नंबर (वैकल्पिक)" : "Document / ID Number (Optional)"}
            placeholder={
              activeUploadDocType === "AADHAAR"
                ? "XXXX-XXXX-1234"
                : activeUploadDocType === "PAN"
                ? "ABCDE1234F"
                : "e.g. Card Serial Number"
            }
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
          />

          {/* File Picker Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              selectedFile
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-slate-300 hover:border-indigo-400 bg-slate-50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />
            <CloudUploadIcon className="text-indigo-600 text-4xl mb-2" />
            {selectedFile ? (
              <div>
                <p className="font-semibold text-sm text-indigo-700">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || "file"}
                </p>
                <span className="inline-block mt-2 text-xs text-indigo-600 underline font-medium">
                  {lang === "hi" ? "दूसरी फ़ाइल चुनें" : "Click to select different file"}
                </span>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-sm text-gray-700">
                  {lang === "hi" ? "फ़ाइल चुनने के लिए यहाँ क्लिक करें" : "Click to browse or drag file here"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, JPG, PNG, WEBP (Max: 10MB)
                </p>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setUploadModalOpen(false)}
            sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#e2e8f0", color: "#475569" }}
          >
            {lang === "hi" ? "रद्द करें" : "Cancel"}
          </Button>

          <Button
            variant="contained"
            onClick={handleUploadSubmit}
            disabled={!selectedFile || uploadingType !== null}
            startIcon={uploadingType ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
            }}
          >
            {uploadingType ? (lang === "hi" ? "अपलोड हो रहा है..." : "Uploading...") : (lang === "hi" ? "अपलोड सुरक्षित करें" : "Save Document")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", minHeight: "500px" },
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">
              {previewDoc?.documentName || "Document Preview"}
            </span>
            {previewDoc?.documentNumber && (
              <Chip label={previewDoc.documentNumber} size="small" variant="outlined" />
            )}
          </div>
          <div className="flex items-center gap-1">
            {previewDoc && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(previewDoc)}
                sx={{ textTransform: "none", mr: 1, borderColor: "#e2e8f0", color: "#475569" }}
              >
                {lang === "hi" ? "डाउनलोड" : "Download"}
              </Button>
            )}
            <IconButton size="small" onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="p-4 flex items-center justify-center bg-slate-100 min-h-[450px]">
          {previewDoc ? (
            (() => {
              const baseURL = api.defaults.baseURL || "http://localhost:9001/rentrova/api/v1";
              const isPdf = previewDoc.filePath?.toLowerCase().endsWith(".pdf") || previewDoc.fileType?.includes("pdf");
              const viewUrl = `${baseURL}/${isPdf ? "file/document" : "file/image"}?fileName=${encodeURIComponent(previewDoc.filePath)}`;

              if (isPdf) {
                return (
                  <iframe
                    src={viewUrl}
                    title="PDF Document"
                    className="w-full h-[600px] rounded-lg border-0"
                  />
                );
              } else {
                return (
                  <img
                    src={viewUrl}
                    alt={previewDoc.documentName}
                    className="max-h-[600px] max-w-full object-contain rounded-lg shadow-sm"
                  />
                );
              }
            })()
          ) : (
            <p className="text-gray-400">No document to preview</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
