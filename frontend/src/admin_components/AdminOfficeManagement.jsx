import { useEffect, useState } from "react";
import api from "../utils/api";

import OfficeTable from "../components/OfficeTable";
import OfficeCreate from "../components/OfficeCreate";
import OfficeEdit from "../components/OfficeEdit";
import OfficeDelete from "../components/OfficeDelete";

export default function AdminOfficeManagement() {
    const [offices, setOffices] = useState()
    const [loading, setLoading] = useState()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [selectedOffice, setSelectedOffice] = useState(null)


    const fetchOffices = async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/offices')
                if (res.data.success) {
                    setOffices(res.data.offices)
                    console.log("Offices fetched successfully", res.data)
                }
        } catch (err) {
            console.log('Failed to catch offices:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOffices()
    }, [])

    const openEditModal = (office) => {
        setSelectedOffice(office);
        setIsEditOpen(true);
    };

    const openDeleteModal = (office) => {
        setSelectedOffice(office);
        setIsDeleteOpen(true);
    };

    if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

    return(
        <div className="p-6 bg-white rounded-md shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Office Management</h2>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Office
                </button>
            </div>

            <OfficeTable 
                offices={offices}
                loading={loading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            <OfficeCreate 
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={fetchOffices}
            />

            <OfficeEdit
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                office={selectedOffice}
                onUpdate={fetchOffices}
            />

            <OfficeDelete
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                office={selectedOffice}
                onDelete={fetchOffices}
            />
        </div>
    )
}