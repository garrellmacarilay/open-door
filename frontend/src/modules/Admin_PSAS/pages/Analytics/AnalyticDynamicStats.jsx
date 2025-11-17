import React from 'react';

function AnalyticDynamicStats({ 
  totalConsultations = 1234,
  totalConsultationsChange = 12,
  approved = 987,
  approvedChange = 8,
  cancelled = 123,
  cancelledChange = -5
}) {
  const stats = [
    {
      title: "Total Consultations",
      value: totalConsultations.toLocaleString(),
      change: totalConsultationsChange,
      changeText: `${totalConsultationsChange > 0 ? '+' : ''}${totalConsultationsChange}% from last month`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      id: 'total'
    },
    {
      title: "Approved",
      value: approved.toLocaleString(),
      change: approvedChange,
      changeText: `${approvedChange > 0 ? '+' : ''}${approvedChange}% from last month`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      id: 'approved'
    },
    {
      title: "Cancelled",
      value: cancelled.toLocaleString(),
      change: cancelledChange,
      changeText: `${cancelledChange}% last month`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.79 14.21C16.18 14.6 16.18 15.24 15.79 15.63C15.6 15.82 15.35 15.92 15.1 15.92C14.85 15.92 14.6 15.82 14.41 15.63L12 13.22L9.59 15.63C9.4 15.82 9.15 15.92 8.9 15.92C8.65 15.92 8.4 15.82 8.21 15.63C7.82 15.24 7.82 14.6 8.21 14.21L10.62 11.8L8.21 9.39C7.82 9 7.82 8.36 8.21 7.97C8.6 7.58 9.24 7.58 9.63 7.97L12.04 10.38L14.45 7.97C14.84 7.58 15.48 7.58 15.87 7.97C16.26 8.36 16.26 9 15.87 9.39L13.46 11.8L15.79 14.21Z" fill="#FFFFFF"/>
        </svg>
      ),
      id: 'cancelled'
    }
  ];

  const getChangeColor = (change) => {
    return change >= 0 ? '#15A031' : '#DC2626';
  };

  return (
    <div className="flex gap-5 -mt-2 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-white rounded-[10px] w-[423.85px] h-22 flex items-center justify-between px-5 py-5 relative"
          style={{
            boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Left Content */}
          <div className="flex flex-col py-0">
            {/* Title */}
            <h4 
              className="text-black text-[14px] font-semibold mb-1" 
              style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
            >
              {stat.title}
            </h4>
            
            {/* Value */}
            <div 
              className="text-black text-[20px] font-bold mb-1" 
              style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
            >
              {stat.value}
            </div>

            {/* Change Indicator */}
            <p 
              className="text-[12px] font-bold" 
              style={{ 
                fontFamily: 'Inter', 
                lineHeight: '1.21em',
                color: getChangeColor(stat.change)
              }}
            >
              {stat.changeText}
            </p>
          </div>

          {/* Right Content - Icon */}
          <div className="bg-[#142240] rounded-[10px] w-[41.91px] h-[41.91px] flex items-center justify-center shrink-0">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticDynamicStats;


