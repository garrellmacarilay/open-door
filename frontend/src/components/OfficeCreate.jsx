import React from "react";
import { useState } from "react";
import api from "../utils/api";

export default function OfficeCreate({ isOpen, onClose, onCreate }) {
    const [officeName, setOfficeName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [status, setStatus] = useState('active')

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await api.post('/admin/office/create', {
                office_name: officeName,
                contact_email: contactEmail,
                status
            })

            if (res.data.success) {
                onCreate()
                onClose()
            }
        } catch (err) {
            setError('Failed to create office.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Add New Office</h2>

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
                            className="border p-2 rounded 2-full"
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className='border p-2 rounded w-full'
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
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >   
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}