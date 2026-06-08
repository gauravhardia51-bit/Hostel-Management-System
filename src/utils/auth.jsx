// ✅ Save everything in one object
export const setAuthData = (auth) => {
  localStorage.setItem("auth", JSON.stringify(auth));
};

// ✅ Get full auth object
export const getAuthData = () => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Auth parse error:", err);
    return null;
  }
};

// const auth = JSON.parse(localStorage.getItem("auth"))

// auth.token
// auth.user
// auth.hostels
// auth.hostelId

//const { hostelId, selectedHostel } = getHostelsData();

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("auth"); // 🔥 remove full object
  window.location.href = "/login";
};

// ✅ Check login
export const isLoggedIn = () => {
  const auth = getAuthData();
  return !!auth?.token;
};

// ✅ Get hostel related data
export const getHostelsData = () => {
  try {
    const auth = getAuthData();

    if (!auth) {
      return {
        hostelId: null,
        hostels: [],
        selectedHostel: null,
      };
    }

    const hostelId = auth.hostelId || null;
    const hostels = auth.hostels || [];

    const selectedHostel = hostels.find((h) => h.id === hostelId);

    return {
      hostelId,
      hostels,
      selectedHostel,
    };
  } catch (err) {
    console.error("Hostel parse error:", err);

    return {
      hostelId: null,
      hostels: [],
      selectedHostel: null,
    };
  }
};

// ✅ Optional: update hostelId (very useful)
export const updateHostelId = (newHostelId) => {
  const auth = getAuthData();
  if (!auth) return;

  auth.hostelId = newHostelId;

  localStorage.setItem("auth", JSON.stringify(auth));
};
