import React from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-full max-w-sm">
      <SearchIcon className="text-gray-400 mr-2" fontSize="small" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-700"
      />
    </div>
  );
}
