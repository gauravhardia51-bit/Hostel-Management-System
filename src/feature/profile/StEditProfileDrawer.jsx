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

export default function StEditProfileDrawer({
  open,
  onClose,
  onSave,
  editData,
}) {
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
        name: editData.studentName || "",
        phone: editData.studentPhone || "",
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
      <Box sx={{ width: 420 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <Typography variant="h6" fontWeight={700}>
            Edit Profile
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
                width: 100,
                height: 100,
                fontSize: 36,
                bgcolor: "#4f46e5",
              }}
            >
              {!selectedImage && !form.profileImage && form.name?.charAt(0)}
            </Avatar>

            <Button
              component="label"
              startIcon={<PhotoCameraIcon />}
              sx={{
                mt: 2,
                textTransform: "none",
              }}
            >
              Upload Photo
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
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{
              maxLength: 10,
            }}
          />

          <TextField fullWidth disabled label="Email" value={form.email} />
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-3">
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to right,#4f46e5,#7c3aed)",
            }}
          >
            Save Changes
          </Button>
        </div>
      </Box>
    </Drawer>
  );
}
