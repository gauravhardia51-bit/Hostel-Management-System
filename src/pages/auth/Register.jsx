import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  FormHelperText,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useFormValidation from "../../hooks/FormValidation";
import { validateRegister } from "../../validations/ValidateRegister";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    values,
    errors,
    handleChange,
    validateAll,
  } = useFormValidation(
    {
      name: "",
      email: "",
      mobile: "",
      password: "",
      roleId: 1,
    },
    validateRegister
  );

  // custom handle change
  const handleChangeWrapper = (e) => {
    const { name, value } =
      e.target;

    handleChange({
      target: {
        name,
        value:
          name === "roleId"
            ? Number(value)
            : value,
      },
    });
  };

  const handleRegister =
    async (e) => {
      e.preventDefault();

      if (!validateAll()) {
        return;
      }

      try {
        setLoading(true);

        // register user
        await api.post(
          "/auth/register",
          values
        );

        // send otp
        await api.post(
          `/send/otp?email=${values.email}`
        );

        toast.success(
          "OTP sent successfully ✅"
        );

        navigate(
          "/verify-otp",
          {
            state: {
              email:
                values.email,
            },
          }
        );
      } catch (err) {
        console.log(err);

        toast.error(
          err?.response?.data
            ?.message ||
            "Registration failed ❌"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center p-4">

      <Card className="w-full max-w-md rounded-3xl shadow-xl">

        <CardContent className="p-8">

          {/* Logo */}

          <div className="text-center mb-8">

            <div className="flex justify-center mb-3">

              <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center">

                <ApartmentIcon
                  className="text-white"
                  fontSize="large"
                />

              </div>

            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              RentRova
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Create your account
            </p>

          </div>

          <form
            onSubmit={
              handleRegister
            }
            className="space-y-4"
          >

            {/* Name */}

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={values.name}
              onChange={
                handleChangeWrapper
              }
              error={
                !!errors.name
              }
              helperText={
                errors.name
              }
              size="small"
              slotProps={{
                input: {
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                },
              }}
            />

            {/* Email */}

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={values.email}
              onChange={
                handleChangeWrapper
              }
              error={
                !!errors.email
              }
              helperText={
                errors.email
              }
              size="small"
              slotProps={{
                input: {
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                },
              }}
            />

            {/* Mobile */}

            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={values.mobile}
              onChange={(e) => {

                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                handleChangeWrapper({
                  target: {
                    name:
                      "mobile",
                    value:
                      value.slice(
                        0,
                        10
                      ),
                  },
                });

              }}
              error={
                !!errors.mobile
              }
              helperText={
                errors.mobile
              }
              size="small"
              slotProps={{
                input: {
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                },
              }}
            />

            {/* Password */}

            <TextField
              fullWidth
              label="Password"
              name="password"
              value={
                values.password
              }
              onChange={
                handleChangeWrapper
              }
              error={
                !!errors.password
              }
              helperText={
                errors.password
              }
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              size="small"
              slotProps={{
                input: {
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),

                  endAdornment:
                    (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                },
              }}
            />

            {/* Role */}

            <FormControl
              fullWidth
              size="small"
              error={
                !!errors.roleId
              }
            >

              <InputLabel>
                Role
              </InputLabel>

              <Select
                name="roleId"
                value={
                  values.roleId
                }
                label="Role"
                onChange={
                  handleChangeWrapper
                }
              >

                <MenuItem value={1}>
                  Owner
                </MenuItem>

                <MenuItem value={2}>
                  Student
                </MenuItem>

              </Select>

              <FormHelperText>
                {
                  errors.roleId
                }
              </FormHelperText>

            </FormControl>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={
                loading
              }
              sx={{
                borderRadius:
                  "12px",
                textTransform:
                  "none",
                paddingY:
                  "10px",
                fontWeight:
                  600,
              }}
            >

              {loading
                ? "Please wait..."
                : "Register"}

            </Button>

          </form>

          {/* Login */}

          <div className="mt-5 text-center">

            <p className="text-sm text-gray-500">

              Already have an account?{" "}

              <span
                className="text-indigo-600 cursor-pointer font-medium hover:underline"
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
              >
                Login
              </span>

            </p>

          </div>

          <div className="mt-6 text-center">

            <p className="text-sm text-gray-500">

              © 2026 RentRova.
              All rights reserved.

            </p>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}