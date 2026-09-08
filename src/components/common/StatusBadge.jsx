import React from "react";

const statusConfig = {
  PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  CLOSED: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  ACTIVE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  SENT: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  APPROVED: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  
  PENDING: { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  FAILED: { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  REJECTED: { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  INACTIVE: { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  
  OPEN: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500 animate-pulse" },
  UPCOMING: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500 animate-pulse" },
  
  IN_PROGRESS: { bg: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-500" },
  "IN PROGRESS": { bg: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-500" },
  
  DEFAULT: { bg: "bg-slate-50 text-slate-700 border-slate-100", dot: "bg-slate-500" }
};

export default function StatusBadge({ status }) {
  const normStatus = (status || "").toUpperCase().trim();
  const config = statusConfig[normStatus] || statusConfig.DEFAULT;
  
  const displayLabel = normStatus === "IN_PROGRESS" ? "IN PROGRESS" : normStatus;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {displayLabel}
    </span>
  );
}
