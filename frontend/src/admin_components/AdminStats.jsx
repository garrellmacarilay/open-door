export default function AdminStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="flex flex-wrap justify-start gap-4 mb-6">
      <div className="w-[200px] bg-purple-500 text-white rounded-xl p-4 shadow text-center flex-shrink-0">
        <h2 className="text-md font-semibold">Today's Consultations</h2>
        <p className="text-2xl font-bold mt-1">{stats.today}</p>
      </div>

      <div className="w-[200px] bg-purple-500 text-white rounded-xl p-4 shadow text-center flex-shrink-0">
        <h2 className="text-md font-semibold">Pending</h2>
        <p className="text-2xl font-bold mt-1">{stats.pending}</p>
      </div>

      <div className="w-[200px] bg-purple-500 text-white rounded-xl p-4 shadow text-center flex-shrink-0">
        <h2 className="text-md font-semibold">This Month</h2>
        <p className="text-2xl font-bold mt-1">{stats.month}</p>
      </div>
    </div>
  );
}
