import { useEffect, useState} from 'react'
import api from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts'

export default function ConsultationTrends() {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(null);

    const fetchTrends = async () => {
        try {
            const res = await api.get('/admin/analytics/trends')
            if (res.data.success) setTrends(res.data.trends)
        } catch (err) {
            console.error('Error fetching trends', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() =>{
        fetchTrends()
    }, [])

    if (loading) return <div className="p-4 text-gray-500">Loading trends...</div>

    if(!trends) return <div className="p-4 text-red-500">No trend data found.</div>

    const chartData = trends.labels.map((label, index) => ({
        label,
        value: trends.values[index]
    }))

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Consultation Trends</h2>

            <BarChart width={350} height={260} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
        </div>
    )
}