import React from "react";
import AppRoutes from "../routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "../context/AppContext";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
    </AppProvider>
  );
}

export default App;
