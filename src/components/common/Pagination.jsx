import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  maxVisible = 3,
}) {
  // ✅ calculate visible pages
  const getVisiblePages = () => {
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxVisible);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  if (totalPages === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {/* LEFT */}
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        &lt;
      </button>

      {/* PAGES */}
      {getVisiblePages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-indigo-600 text-white" : "border"
          }`}
        >
          {p + 1}
        </button>
      ))}

      {/* RIGHT */}
      <button
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
