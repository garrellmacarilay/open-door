import React from "react";
import Legend from "./Legend";

export default function CalendarSection() {
  return (
    <section className="flex-1 bg-white shadow-lg m-4 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Today
        </button>
        <h3 className="font-semibold text-lg">October 2025</h3>
        <div className="space-x-2">
          <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &lt;
          </button>
          <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &gt;
          </button>
        </div>
      </div>

      <div className="h-[550px] bg-gray-50 border rounded-lg flex items-center justify-center text-gray-400">
        Calendar Goes Here
      </div>

      <Legend />
    </section>
  );
}
