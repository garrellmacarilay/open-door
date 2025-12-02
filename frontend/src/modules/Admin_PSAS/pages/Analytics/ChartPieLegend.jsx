import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useServiceDistribution } from '../../../../hooks/adminHooks';

const OFFICE_COLORS = [
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
  '#0A3A8A',
];

export default function OfficeDistribution() {
  const { distribution, loading, error } = useServiceDistribution();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">
        Loading distribution...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-red-600">
        Error loading distribution
      </div>
    );
  }

  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  const chartData = distribution.map((item) => ({
    name: item.office,
    // ensure `value` is numeric — `toFixed` returns a string which can
    // prevent recharts from rendering correctly
    value: total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0,
  }));

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-lg min-h-[300px]">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Office Distribution
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Distribution across all offices
        </p>
      </div>

      {/* Chart Section */}
      <div className="flex-1 p-4 sm:p-6 flex flex-row items-center justify-center gap-6 h-[300px]">
        {/* Legend */}
        <div className="shrink-0 w-1/3">
          <div className="grid grid-cols-1 gap-2">
            {chartData.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className="w-3 h-3 shrink-0 rounded-full"
                  style={{ backgroundColor: OFFICE_COLORS[index % OFFICE_COLORS.length] }}
                />
                <span className="text-gray-700 truncate">{entry.name}</span>
                <span className="text-gray-500 font-medium ml-auto">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="shrink-0 w-2/3 flex justify-center items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // disable slice labels that render around the pie
                label={false}
                outerRadius="70%"
                innerRadius="0%"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={OFFICE_COLORS[index % OFFICE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: '#f3f4f6ff',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
