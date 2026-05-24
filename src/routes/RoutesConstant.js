// routes/routeConstants.js

import VerifyOtp from "../pages/auth/VerifyOtp";

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  VerifyOtp: "/verify-otp",
FORGOT_PASSWORD: "/forgot-password",
  // Dashboard
  DASHBOARD: "/dashboard",

  //Rentrova Logo
  HOME: "/",

  // Students
  STUDENTS: "/students",
  ADD_STUDENT: "/students/add",
  EDIT_STUDENT: (id) => `/students/edit/${id}`,
  STUDENT_DETAILS: (id) => `/students/${id}`,

  // Rooms
  ROOMS: "/rooms",
  ADD_ROOM: "/rooms/add",

  // Payments
  PAYMENTS: "/payments",
  ADD_PAYMENT: "/payments/add",

  // Notifications
  NOTIFICATIONS: "/notifications",

  // Reminders
  REMINDERS: "/reminders",

  // Complaints
  COMPLAINTS: "/complaints",

  // Reports
  REPORTS: "/reports",

  // Settings
  SETTINGS: "/settings",


  // Fallback
  NOT_FOUND: "*",
};
