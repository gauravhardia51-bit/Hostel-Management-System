import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { translations, translateDbValue } from "../utils/translations";

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. THEME STATE
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("rentrova_theme") || "light";
  });

  // 2. LANGUAGE STATE
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("rentrova_lang") || "en";
  });

  // Effect to synchronize Theme to DOM & localStorage
  useEffect(() => {
    localStorage.setItem("rentrova_theme", themeMode);
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [themeMode]);

  // Effect to synchronize Language to localStorage
  useEffect(() => {
    localStorage.setItem("rentrova_lang", lang);
    window.dispatchEvent(new Event("languageChanged"));
  }, [lang]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  // Translation Helper
  const t = (key, fallback = "") => {
    const currentDict = translations[lang] || translations.en;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  // Database Value / Status Translation Helper
  const tDb = (value) => {
    return translateDbValue(value, lang);
  };

  // MUI Dynamic Theme
  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#4f46e5",
      },
      secondary: {
        main: "#f59e0b",
      },
      background: {
        default: themeMode === "dark" ? "#0f172a" : "#f8fafc",
        paper: themeMode === "dark" ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: themeMode === "dark" ? "#f1f5f9" : "#1e293b",
        secondary: themeMode === "dark" ? "#94a3b8" : "#64748b",
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
    shape: {
      borderRadius: 10,
    },
  });

  return (
    <AppContext.Provider
      value={{
        theme: themeMode,
        themeMode,
        setTheme: setThemeMode,
        toggleTheme,
        lang,
        setLang: changeLanguage,
        t,
        tDb,
      }}
    >
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
