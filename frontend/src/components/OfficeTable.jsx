import { Pencil, Trash2 } from "lucide-react";

export default function OfficeTable({ offices = [], loading, onEdit, onDelete }) {
    if (loading) return <div className="text-center py-6">Loading offices...</div>;

    if (offices.length === 0)
        return <div className="text-center py-6 text-gray-500">No offices found.</div>;

    return (
        <div className="overflow-auto">
            <table className="w-full border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left border-b">Office Name</th>
                        <th className="p-3 text-left border-b">Contacts</th>
                        <th className="p-3 text-left border-b">Status</th>
                        <th className="p-3 text-left border-b">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {offices.map((office) => {
                        return (
                            <tr key={office.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{office.office_name}</td>
                                <td className="p-3 text-gray-600">{office.contact_email}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-3 py-1 rounded text-sm font-medium ${
                                            office.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {office.status}
                                    </span>
                                </td>

                                <td className="p-3 text-center flex justify-center gap-3">
                                    <button
                                        onClick={() => onEdit(office)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => onDelete(office)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
