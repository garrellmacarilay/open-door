import React, { useState } from "react";
import api from "../utils/api";

export default function OfficeEdit({ isOpen, onClose, office, onUpdate }) {
    if (!isOpen || !office) return null;

    const [officeName, setOfficeName] = useState(office.office_name);
    const [contactEmail, setContactEmail] = useState(office.contact_email);
    const [status, setStatus] = useState(office.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.patch(`/admin/office/update/${office.id}`, {
                office_name: officeName,
                contact_email: contactEmail,
                status
            });

            if (res.data.success) {
                onUpdate(); 
                onClose();
            }
        } catch (err) {
            setError("Failed to update office.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Edit Office</h2>

                {error && <p className="text-red-600 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Office Name</label>
                        <input 
                            type="text"
                            value={officeName}
                            onChange={(e) => setOfficeName(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact Email</label>
                        <input 
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
