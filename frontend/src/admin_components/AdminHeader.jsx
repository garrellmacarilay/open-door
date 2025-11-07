import React from "react";
import NotificationModal from "../testing/NotificationModal";

export default function AdminHeader({ admin, onSelectBooking }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">
        🧑‍💼 Welcome {admin?.full_name || "Admin"}!
      </h2>
      <NotificationModal onSelectBooking={onSelectBooking}/>
    </div>
  );
}
