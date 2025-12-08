import React from 'react';

function AdminDynamicStats({ 
  todayConsultations,  
  pendingApprovals, 
  thisMonth, 
}) {
  const stats = [
    {
      label: "Today's Consultations",
      value: todayConsultations,
      id: 'today'
    },
    {
      label: "Pending Approvals", 
      value: pendingApprovals,
      id: 'pending'
    },
    {
      label: "This Month",
      value: thisMonth,
      id: 'month'
    }
  ];

  return (
    <div className="flex gap-3 w-full mx-0 mt-2">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-white rounded-[10px] w-120 h-16 flex items-center relative"
          style={{
            boxShadow: '0px 3px 35px -4px rgba(52, 76, 106, 0.1), 0px 4px 15px 0px rgba(35, 64, 136, 0.05)'
          }}
        >
          {/* Number Display Box */}
          <div className="bg-[#142240] border border-black/50 rounded-[10px] w-10.5 h-10.5 flex flex-col justify-center items-center ml-[19px]">
            <span 
              className="text-white font-bold text-[19px] leading-[1.5em]" 
              style={{ fontFamily: 'Poppins' }}
            >
              {stat.value}
            </span>
          </div>
          
          {/* Label Text */}
          <div className="ml-[17px]">
            <span 
              className="text-black font-medium text-[15px] leading-[1.5em]" 
              style={{ fontFamily: 'Poppins' }}
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDynamicStats;