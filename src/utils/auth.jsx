export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const getHostelsData = () => {
  try {
    // ✅ Get raw values
    const hostelIdRaw = localStorage.getItem("hostelId");
    const hostelsRaw = localStorage.getItem("hostels");

    // ✅ Parse safely
    const hostelId = hostelIdRaw ? Number(hostelIdRaw) : null;

    const hostels = hostelsRaw ? JSON.parse(hostelsRaw) : [];

    // ✅ Get selected hostel object
    const selectedHostel = hostels.find((h) => h.id === hostelId);

    return {
      hostelId,
      hostels,
      selectedHostel, // 🔥 IMPORTANT (use in sidebar, header etc.)
    };
  } catch (err) {
    console.error("Auth parse error:", err);

    return {
      hostelId: null,
      hostels: [],
      selectedHostel: null,
    };
  }
};
