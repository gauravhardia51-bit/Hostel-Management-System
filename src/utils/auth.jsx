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

export const getAuthData = () => {
  try {
    const hostelId = localStorage.getItem("hostelId");

    const hostelsRaw = localStorage.getItem("hostels");

    const hostels = hostelsRaw ? JSON.parse(hostelsRaw) : [];

    return {
      hostelId,
      hostels,
    };
  } catch (err) {
    console.error("Auth parse error:", err);

    return {
      hostelId: null,
      hostels: [],
    };
  }
};
