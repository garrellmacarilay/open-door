function UpcomingEvents({ upcomingEvents = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[58px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Upcoming Events</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {upcomingEvents.length === 0 && <p className="text-sm text-gray-500">No upcoming events</p>}
        {upcomingEvents.map((event) => (
          <div key={event.id} className="border border-gray-400 rounded-[5px] p-3 mb-4 bg-[rgba(207,226,255,0.25)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-xs text-black" style={{ fontFamily: 'Inter' }}>{event.event_title}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                {new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true, 
                })}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingEvents;
