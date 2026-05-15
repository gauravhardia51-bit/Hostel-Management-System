import React from "react";

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = 10,
  onPageChange,
  maxVisible = 5,
  label = "items",
}) {
  const getVisiblePages = () => {
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxVisible);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    onPageChange(newPage);
  };

  // ✅ No data case
  if (totalElements === 0) {
    return (
      <div className="mt-4 text-xs text-gray-500 text-center">
        No {label} found
      </div>
    );
  }

  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
      <span>
        Showing {startItem} to {endItem} of {totalElements} {label}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 rounded ${
              p === page ? "bg-indigo-600 text-white" : "border"
            }`}
          >
            {p + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages - 1}
          onClick={() => handlePageChange(page + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
