import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import useFormValidation from "../../hooks/FormValidation";
import { ValidateStudentProfile } from "../../validations/ValidateStudentProfile";
import { useApp } from "../../context/AppContext";

export default function StEditProfileDrawer({
  open,
  onClose,
  onSave,
  editData,
}) {
  const { t, lang } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    values: form,
    errors,
    handleChange,
    validateAll,
    resetForm,
    setValues,
  } = useFormValidation(
    {
      id: "",
      name: "",
      phone: "",
      email: "",
      profileImage: "",
    },
    ValidateStudentProfile,
  );

  // Prefill data when drawer opens
  useEffect(() => {
    if (!open) return;

    if (editData) {
      setValues({
        id: editData.id || "",
        name: editData.studentName || editData.name || "",
        phone: editData.studentPhone || editData.phone || "",
        email: editData.email || "",
        profileImage: editData.profileImage || "",
      });
    } else {
      resetForm();
    }

    setSelectedImage(null);
  }, [open, editData]);

  const handleImage = (e) => {
    if (e.target.files?.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!validateAll()) return;

    onSave({
      id: form.id,
      name: form.name,
      phone: form.phone,
      image: selectedImage,
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 440 }} className="h-full flex flex-col bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
          <Typography variant="h6" fontWeight={700} className="text-gray-800 dark:text-gray-100 text-base">
            {lang === "hi" ? "प्रोफाइल अपडेट करें" : "Edit Student Profile"}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-col items-center">
            <Avatar
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : form.profileImage
              }
              sx={{
                width: 90,
                height: 90,
                fontSize: 32,
                bgcolor: "#4f46e5",
                fontWeight: 700,
              }}
            >
              {!selectedImage && !form.profileImage && form.name?.charAt(0)}
            </Avatar>

            <Button
              component="label"
              size="small"
              variant="outlined"
              startIcon={<PhotoCameraIcon sx={{ fontSize: 13 }} />}
              sx={{
                mt: 2,
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            >
              {lang === "hi" ? "फोटो बदलें" : "Change Photo"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </Button>
          </div>

          <TextField
            fullWidth
            size="small"
            label={t("studentName")}
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            size="small"
            label={t("phone")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{
              maxLength: 10,
            }}
          />

          <TextField
            fullWidth
            size="small"
            disabled
            label={t("email")}
            value={form.email}
          />
        </div>

        {/* Footer */}
        <div className="p-5 border-t dark:border-gray-800 flex gap-3 bg-white dark:bg-slate-900">
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {t("cancel")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {t("save")}
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
