import React from "react";
import api from "../utils/api";

export default function OfficeDelete({ isOpen, onClose, office, onDelete }) {
    if (!isOpen || !office) return null;

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/admin/office/delete/${office.id}`);

            if (res.data.success) {
                onDelete();
                onClose();
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4 text-red-600">
                    Confirm Delete
                </h2>

                <p className="mb-4">
                    Are you sure you want to delete <strong>{office.office_name}</strong>?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
