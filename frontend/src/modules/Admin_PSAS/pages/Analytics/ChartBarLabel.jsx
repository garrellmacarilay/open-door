import { TrendingUp } from "lucide-react"
import { BarChart, Bar, CartesianGrid, XAxis, LabelList, Tooltip, ResponsiveContainer } from "recharts"
import { useConsultationTrends } from "../../../../hooks/adminHooks"



export default function ChartBarLabel() {
  const { trends, loading, error } = useConsultationTrends()
  
  const chartData = trends.labels.map((month, index) => ({
    month,
    consultations: trends.values[index]
  }))

  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">Loading chart...</div>;
  }

  if (error) {
    return <div className="bg-white p-6 rounded-lg shadow-sm text-red-600">Error loading trends</div>;
  }

  return (
    <div className=" flex flex-col w-full h-100 bg-white rounded-lg  border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex-1 p-6 pb-4">
          <h3 className="text-2xl font-semibold text-gray-900">Bar Chart - Label</h3>
          <p className="text-sm text-gray-500 mt-1">January - June 2024</p>
        </div>
        
        {/* Bar Graph */}
        <div className="flex-1 p-6 pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
              />
              <Bar 
                dataKey="consultations" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  style={{ fill: '#111827', fontSize: 12, fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Short Data */}
        <div className="flex-1 p-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium text-gray-900">
              Trending up by 5.2% this month 
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-gray-500">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
    </div>
  )
}