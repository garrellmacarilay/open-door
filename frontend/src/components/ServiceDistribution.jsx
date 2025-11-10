import { useEffect, useState} from 'react'
import api from '../utils/api'
import { PieChart, Pie, Tooltip, Cell} from 'recharts'

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

export default function ServiceDistribution() {
    const [distribution, setDistribution] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchServiceDistribution = async () => {
        try {
            const res = await api.get('/admin/analytics/distribution')
            if (res.data.success) setDistribution(res.data.distribution)
        }catch (err) {  
            console.error('Error fetching service distribution', err)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServiceDistribution()
    }, [])

    if (loading) return <div className="p-4 text-gray-500">Loading distribution...</div>

    if (!distribution.length) return <div className="p-4 text-red-500">No distribution data found.</div>

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Service Distribution</h2>

            <PieChart width={350} height={260}>
                <Pie
                    data={distribution}
                    dataKey='count'
                    nameKey='office'
                    outerRadius={100}
                    lavel
                >
                    {distribution.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    )
}