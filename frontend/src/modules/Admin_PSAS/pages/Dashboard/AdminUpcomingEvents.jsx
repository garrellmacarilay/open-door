import React, { useState } from 'react';

function AdminUpcomingEvents({ events = [] }) {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Event data:', formData);
    setShowAddEventModal(false);
    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      description: ''
    });
  };

  const handleCancel = () => {
    setShowAddEventModal(false);
    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      description: ''
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[58px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Upcoming Events</h2>
      </div>

      {/* Content - Scrollable Events */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {events?.slice(0, 3).map((event, index) => (
          <div key={`${event?.title || 'event'}-${event?.time || 'time'}-${index}`} className="border border-gray-400 rounded-[5px] p-3 mb-4 bg-[rgba(207,226,255,0.25)]">
            {/* Event Title Row */}
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z" fill="white"/>
                <path d="M7 10C4.79086 10 3 11.7909 3 14H11C11 11.7909 9.20914 10 7 10Z" fill="white"/>
                <path d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z" stroke="#360055" strokeWidth="2"/>
                <path d="M7 10C4.79086 10 3 11.7909 3 14H11C11 11.7909 9.20914 10 7 10Z" stroke="#360055" strokeWidth="2"/>
              </svg>
              <span className="font-semibold text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.title || 'Unknown Event'}</span>
            </div>

            {/* Date Row */}
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white"/>
                <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                {event?.date ? event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
              </span>
            </div>

            {/* Time Row */}
            <div className="flex items-center gap-2">
              <svg width="14.5" height="14.5" viewBox="0 0 14.5 14.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.25" cy="7.25" r="6.25" stroke="#9D4400" strokeWidth="2"/>
                <path d="M7.25 3.625V7.25L9.625 9.625" stroke="#9D4400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.time || 'Unknown Time'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Add Event Button at Bottom */}
      <div className="px-4 pb-4 pt-3 bg-white rounded-b-lg border-t border-gray-100 shrink-0">
        <button
          onClick={() => setShowAddEventModal(true)}
          className="w-full bg-[#0073FF]! hover:bg-blue-700 transition-colors rounded-[5px] flex items-center justify-center gap-2 py-2.5 h-10"
        >
          {/* Plus Icon */}
          <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M10.5 5.25V15.75M5.25 10.5H15.75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter' }}>Add Event</span>
        </button>
      </div>

      {/* Add Event Modal - Responsive Design */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] shadow-[0px_4px_50px_10px_rgba(125,125,125,0.25)] w-full max-w-[534px] h-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#122141] rounded-t-[10px] h-[60px] flex items-center px-6 shrink-0">
              <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                Calendar Events
              </h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Mental Health Break"
                    className="w-full h-10 px-4 border border-[#BCBABA] rounded-[10px] text-sm text-gray-700 placeholder-[#BCBABA] focus:outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full h-10 px-4 border border-[#BCBABA] rounded-[10px] text-sm text-gray-700 focus:outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Event Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    placeholder="8:00 AM"
                    className="w-full h-10 color-black! px-4 border border-[#BCBABA] rounded-[10px] text-sm text-gray-700 placeholder-[#BCBABA] focus:outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Description *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter Event Description"
                    className="w-full px-4 py-2 border border-[#BCBABA] rounded-[10px] text-sm text-gray-700 placeholder-[#BCBABA] focus:outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC] resize-none"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-white! border-2 border-[#EDEDED] rounded-[5px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-black text-sm font-bold" style={{ fontFamily: 'Poppins' }}>
                    Cancel
                  </span>
                </button>

                {/* Add Event Button */}
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#155DFC]! hover:bg-blue-700 rounded-[5px] flex items-center justify-center transition-colors"
                >
                  <span className="text-white text-sm font-bold" style={{ fontFamily: 'Poppins' }}>
                    Add Event
                  </span>
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUpcomingEvents;