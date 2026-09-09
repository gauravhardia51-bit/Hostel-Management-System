import React from "react";

export default function EmptyState({ message = "No data found", description = "Try adjusting your search or filters to find what you're looking for." }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18m-18 0l-1.08 4.86a2.25 2.25 0 002.21 2.74h14.74a2.25 2.25 0 002.21-2.74l-1.08-4.86M12 3v3m0 0l3-3m-3 3L9 3"
        />
      </svg>
      <h3 className="text-base font-semibold text-gray-900">{message}</h3>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
