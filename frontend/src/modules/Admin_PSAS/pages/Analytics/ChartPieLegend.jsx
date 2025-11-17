import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const officeData = [
  {id: 1, name: 'Office A', value: 15 },
  {id: 2, name: 'Office B', value: 14 },
  {id: 3, name: 'Office C', value: 13 },
  {id: 4, name: 'Office D', value: 12 },
  {id: 5, name: 'Office E', value: 11 },
  {id: 6, name: 'Office F', value: 10 },
  {id: 7, name: 'Office G', value: 9 },
  {id: 8, name: 'Office H', value: 8 },
  {id: 9, name: 'Office I', value: 7 },
  {id: 10, name: 'Office J', value: 6 },
  {id: 11, name: 'Office K', value: 5 },
];

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
  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-lg min-h-[180px]">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Office Distribution</h2>
        <p className="text-gray-600 text-sm sm:text-base">Distribution across 11 offices</p>
      </div>
      
      {/* Chart Section */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="flex flex-row ml-16 items-center justify-center -gap-4! h-full">
          
          {/* Legend Container */}
          <div className="shrink-0 w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 -gap-6">
              {officeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 shrink-0" 
                    style={{ backgroundColor: OFFICE_COLORS[index] }}
                  />
                  <span className="text-gray-700 truncate">{entry.name}</span>
                  <span className="text-gray-500 font-medium ml-auto">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart Container */}
          <div className="shrink-0 w-full h-full ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={officeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius="70%"
                  innerRadius="0%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {officeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={OFFICE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}