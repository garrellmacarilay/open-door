import React from "react";

export default function LoadingBlock({ height = "h-40" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-xl overflow-hidden relative ${height}`}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
    </div>
  );
}
