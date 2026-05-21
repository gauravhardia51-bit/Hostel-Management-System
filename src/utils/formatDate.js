// // For table display
// export const formatDate = (timestamp) => {
//   if (!timestamp) return "";

//   return new Date(timestamp).toLocaleDateString("en-IN");
// };

// Convert input date → timestamp (for backend)
export const convertToTimestamp = (date) => {
  if (!date) return null;

  return new Date(date).getTime();
};

// For input field (FIX)
export const formatDateForDisplay = (timestamp) => {
  if (!timestamp) return "";

  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "long" }); // June
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatDateForBackend = (timestamp) => {
  if (!timestamp) return "";

  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // ✅ REQUIRED
};
