import React, { useState } from 'react';

function OfficeManagement() {
  const [showAddOfficeModal, setShowAddOfficeModal] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: '',
    email: '',
    status: 'available'
  });
  
  const [offices, setOffices] = useState([
    {
      id: 1,
      name: 'Student IT Support and Services',
      email: 'prefect.its@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 2,
      name: 'Guidance and Counseling',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 3,
      name: 'Medical and Dental Services',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 4,
      name: 'Sports Development and Management',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 5,
      name: 'Assistance and Experiential Education',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 6,
      name: 'Student Discipline',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 7,
      name: 'Student Organization',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 8,
      name: 'Student Internship',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    },
    {
      id: 9,
      name: 'Student Publication',
      email: 'student.organization.office@laverdad.edu.ph',
      status: 'available'
    }
  ]);

  const handleAddOffice = () => {
    setShowAddOfficeModal(true);
  };

  const handleSaveOffice = () => {
    if (newOffice.name && newOffice.email) {
      const newId = Math.max(...offices.map(o => o.id)) + 1;
      setOffices([...offices, { ...newOffice, id: newId }]);
      setNewOffice({ name: '', email: '', status: 'available' });
      setShowAddOfficeModal(false);
    }
  };

  const handleCancelAdd = () => {
    setNewOffice({ name: '', email: '', status: 'available' });
    setShowAddOfficeModal(false);
  };

  const handleEditOffice = (officeId) => {
    console.log('Edit office:', officeId);
  };

  const handleDeleteOffice = (officeId) => {
    setOffices(offices.filter(office => office.id !== officeId));
  };

  return (
    <div className="flex-1 bg-[#E9E9E9] p-8 overflow-auto">
      <div className="bg-white rounded-[20px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] w-full min-h-full flex flex-col relative">
        
        {/* Add Office Button */}
        <button
          onClick={handleAddOffice}
          className="absolute top-5 right-[35px] h-10 w-35 bg-[#0073FF] rounded-[5px] px-2 py-0 flex items-center gap-3 hover:bg-blue-700 transition-colors z-10"
        >
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 5.25V15.75M5.25 10.5H15.75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-[15px] font-bold" style={{ fontFamily: 'Inter' }}>
            Add Office
          </span>
        </button>

        {/* Table Container */}
        <div className="mt-20 mx-[35px] mb-[35px] flex-1">
          
          {/* Table Header */}
          <div className="bg-[#122141] border border-[#BDBDBD] rounded-t-[5px] h-[65px] flex items-center">
            <div className="flex w-full">
              <div className="w-[37px] flex items-center justify-center">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  #
                </span>
              </div>
              <div className="flex-1 px-4">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Office
                </span>
              </div>
              <div className="w-[376px] px-4">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Contact Info
                </span>
              </div>
              <div className="w-[200px] px-4">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Status
                </span>
              </div>
              <div className="w-[150px] px-4 text-center">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Actions
                </span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-100 overflow-y-auto">
            {offices.map((office, index) => (
              <div 
                key={office.id}
                className={`${
                  index % 2 === 0 ? 'bg-[#F0F0F0]' : 'bg-white'
                } border-l border-r border-b border-[#BDBDBD] h-[60px] flex items-center ${
                  index === offices.length - 1 ? 'rounded-b-[5px]' : ''
                }`}
              >
                <div className="flex w-full items-center">
                  <div className="w-[37px] flex items-center justify-center">
                    <span className="text-black text-[16px] font-semibold" style={{ fontFamily: 'Inter' }}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-black text-[16px] font-semibold" style={{ fontFamily: 'Inter' }}>
                      {office.name}
                    </span>
                  </div>
                  <div className="w-[376px] px-4">
                    <span className="text-black text-[16px] font-semibold" style={{ fontFamily: 'Inter' }}>
                      {office.email}
                    </span>
                  </div>
                  <div className="w-[200px] px-4">
                    <div className="bg-[#ABFFAC] rounded-[5px] px-2.5 py-2.5 w-[93px] h-[25px] flex items-center justify-center">
                      <span className="text-[#006928] text-[14px] font-medium" style={{ fontFamily: 'Poppins' }}>
                        {office.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-[150px] mb- px-5 flex items-center justify-center gap-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditOffice(office.id)}
                      className="w-6 h-6 hover:opacity-75 transition-opacity bg-transparent!"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="10" fill="black"/>
                        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteOffice(office.id)}
                      className="w-6 h-6 hover:opacity-75 transition-opacity bg-transparent!"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Office Modal */}
        {showAddOfficeModal && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[10px] shadow-lg w-full max-w-[500px]">
              
              {/* Modal Header */}
              <div className="bg-[#122141] rounded-t-[10px] h-[60px] flex items-center px-6">
                <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                  Add New Office
                </h3>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Office Name */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Office Name *
                  </label>
                  <input
                    type="text"
                    value={newOffice.name}
                    onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                    placeholder="Enter office name"
                    className="w-full h-10 px-4 border border-gray-300 rounded-[5px] text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={newOffice.email}
                    onChange={(e) => setNewOffice({ ...newOffice, email: e.target.value })}
                    placeholder="Enter contact email"
                    className="w-full h-10 px-4 border border-gray-300 rounded-[5px] text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-black text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                    Status
                  </label>
                  <select
                    value={newOffice.status}
                    onChange={(e) => setNewOffice({ ...newOffice, status: e.target.value })}
                    className="w-full h-10 px-4 border border-gray-300 rounded-[5px] text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{ fontFamily: 'Inter' }}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end px-6 pb-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-6 py-2 bg-white border-2 border-gray-300 rounded-[5px] text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOffice}
                  className="px-6 py-2 bg-[#0073FF] hover:bg-blue-700 rounded-[5px] text-white font-bold text-sm transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  Add Office
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OfficeManagement;