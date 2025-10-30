import React from "react";

export default function Legend() {
  const items = [
    { color: "bg-green-500", label: "Approved" },
    { color: "bg-yellow-400", label: "Pending" },
    { color: "bg-red-500", label: "Declined" },
  ];

  return (
    <div className="flex justify-center gap-4 text-sm mt-3">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1">
          <span className={`w-3 h-3 rounded-full ${color}`}></span> {label}
        </div>
      ))}
    </div>
  );
}
