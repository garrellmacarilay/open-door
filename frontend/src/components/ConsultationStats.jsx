import { useEffect, useState} from 'react'
import api from '../utils/api'

export default function ConsultationStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/analytics/stats')
            if (res.data.success) setStats(res.data.stats)
        } catch (err){
            console.error("Error fetching stats:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
            fetchStats();
        }, [])

    if (loading) return <div className="p-4 text-gray-500">Loading statistics...</div>;

    if (!stats) return <div className="p-4 text-red-500">No statistics available.</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Consultation Summary (Last Month)</h2>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p>Total Consultations</p>
                </div>

                <div>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p>Completed</p>
                    <p className="text-sm text-gray-500">{stats.percentages.completed}%</p>
                </div>

                <div>
                    <p className="text-2xl font-bold">{stats.cancelled}</p>
                    <p>Cancelled</p>
                    <p className="text-sm text-gray-500">{stats.percentages.cancelled}%</p>
                </div>
            </div>
        
        </div>
    )
}