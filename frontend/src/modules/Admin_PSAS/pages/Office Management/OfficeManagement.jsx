import React, { useState } from 'react';
import { useAdminOffices, useCreateOffice, useUpdateOffice, useDeleteOffice } from '../../../../hooks/adminHooks';

function OfficeManagement() {
  const [showAddOfficeModal, setShowAddOfficeModal] = useState(false);
  const [showEditOfficeModal, setShowEditOfficeModal] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: '',
    email: '',
    status: 'available'
  });
  const [editOffice, setEditOffice] = useState({
    id: null,
    name: '',
    email: '',
    status: 'available'
  });
  
  const { offices, loading, error, refetch } = useAdminOffices();
  const { createOffice } = useCreateOffice();
  const { updateOffice } = useUpdateOffice();
  const { deleteOffice } = useDeleteOffice();

  const handleAddOffice = async () => {
    setShowAddOfficeModal(true);
  };

  const handleSaveOffice = async () => {
    const created = await createOffice({
      office_name: newOffice.name,
      contact_email: newOffice.email,   
      status: newOffice.status 
    });

    if (created) {
      refetch();
      setShowAddOfficeModal(false);
      setNewOffice({ name: "", email: "", status: "active" });
    }
  };

  const handleCancelAdd = () => {
    setNewOffice({ name: '', email: '', status: 'active' });
    setShowAddOfficeModal(false);
  };

  const handleEditOffice = (id) => {
    const office = offices.find(o => o.id === id);
    
    if (!office) return
    
    setEditOffice({
      id: office.id,
      name: office.office_name,
      email: office.contact_email,
      status: office.status
    })

    setShowEditOfficeModal(true)
  };

  const handleSaveEditOffice = async () => {
    const updated = await updateOffice(editOffice.id, {
      office_name: editOffice.name,        
      contact_email: editOffice.email,     
      status: editOffice.status 
    });

    if (updated) {
      refetch();
      setShowEditOfficeModal(false);
    }
  };
  const handleCancelEdit = () => {
    setEditOffice({ id: null, name: '', email: '', status: 'available' });
    setShowEditOfficeModal(false);
  };

  const handleDeleteOffice = async (id) => {
    const res = await deleteOffice(id)
    if (res) refetch()
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
            <div className="flex w-full items-center">
              <div className="w-12 flex items-center justify-center shrink-0">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  #
                </span>
              </div>
              <div className="flex-1 px-4 min-w-0">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Office
                </span>
              </div>
              <div className="flex-1 px-4 min-w-0">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Contact Info
                </span>
              </div>
              <div className="w-24 px-2 shrink-0">
                <span className="text-white text-[16px] font-bold" style={{ fontFamily: 'Inter' }}>
                  Status
                </span>
              </div>
              <div className="w-20 px-2 text-center shrink-0">
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
                } border-l border-r border-b border-[#BDBDBD] min-h-[60px] flex items-center ${
                  index === offices.length - 1 ? 'rounded-b-[5px]' : ''
                } py-2`}
              >
                <div className="flex w-full items-center">
                  <div className="w-12 flex items-center justify-center shrink-0">
                    <span className="text-black text-[16px] font-semibold" style={{ fontFamily: 'Inter' }}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <span className="text-black text-[16px] font-semibold wrap-break-word" style={{ fontFamily: 'Inter' }}>
                      {office.office_name}
                    </span>
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <span className="text-black text-[16px] font-semibold break-all" style={{ fontFamily: 'Inter' }}>
                      {office.contact_email}
                    </span>
                  </div>
                 <div className="w-24 px-2 shrink-0">
                    <div className={`rounded-[5px] px-2 py-1 flex items-center justify-center gap-1 ${
                      office.status === 'inactive' ? 'bg-[#FF6B6B]' : 'bg-[#ABFFAC]'
                    }`}>

                      {loading && office.id === editOffice.id && (
                        <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"></div>
                      )}

                      <span className={`text-[12px] font-medium whitespace-nowrap ${
                        office.status === 'inactive' ? 'text-[#a81818]' : 'text-[#006928]'
                      }`} style={{ fontFamily: 'Poppins' }}>
                        {office.status}
                      </span>

                    </div>
                  </div>

                  <div className="w-20 px-2 flex items-center justify-center gap-2 shrink-0">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditOffice(office.id)}
                      className="w-6 h-6 hover:opacity-75 transition-opacity bg-transparent! shrink-0"
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 16H4L13.5 6.5C13.8978 6.10217 14.1213 5.56261 14.1213 5C14.1213 4.43739 13.8978 3.89783 13.5 3.5C13.1022 3.10217 12.5626 2.87868 12 2.87868C11.4374 2.87868 10.8978 3.10217 10.5 3.5L1 13V16Z" stroke="#008CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.5 3.5L13.5 6.5" stroke="#008CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteOffice(office.id)}
                      className="w-6 h-6 hover:opacity-75 transition-opacity bg-transparent! shrink-0"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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

        {/* Edit Office Modal - Exact Figma Design */}
        {showEditOfficeModal && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-[10px] shadow-[0px_4px_50px_10px_rgba(125,125,125,0.25)] relative"
              style={{ width: '534px', height: '500px' }}
            >
              
              {/* Modal Header - Exact Figma Positioning */}
              <div 
                className="bg-[#122141] rounded-t-[10px] flex items-center"
                style={{ width: '534px', height: '81px' }}
              >
                <h3 
                  className="text-white text-[20px] font-bold"
                  style={{ 
                    fontFamily: 'Inter', 
                    lineHeight: '1.21em',
                    marginLeft: '46px',
                    marginTop: '30px'
                  }}
                >
                  Edit Office
                </h3>
              </div>

              {/* Modal Content - Exact Figma Layout */}
              <div className="relative">
                
                {/* Office Input - Positioned according to Figma */}
                <div 
                  className="absolute"
                  style={{ 
                    left: '46px', 
                    top: '47px',
                    width: '443px', 
                    height: '67px' 
                  }}
                >
                  <label 
                    className="block text-black text-[16px] font-semibold mb-2" 
                    style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                  >
                    Office *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editOffice.name}
                      onChange={(e) => setEditOffice({ ...editOffice, name: e.target.value })}
                      className="w-full h-10 px-4 border border-[#BCBABA] rounded-[10px] text-[14px] text-[#BCBABA] focus:outline-none focus:border-blue-500"
                      style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                    />
                  </div>
                </div>

                {/* Email Address Input - Positioned according to Figma */}
                <div 
                  className="absolute"
                  style={{ 
                    left: '46px', 
                    top: '147px',
                    width: '443px', 
                    height: '67px' 
                  }}
                >
                  <label 
                    className="block text-black text-[16px] font-semibold mb-2" 
                    style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={editOffice.email}
                      onChange={(e) => setEditOffice({ ...editOffice, email: e.target.value })}
                      className="w-full h-10 px-4 border border-[#BCBABA] rounded-[10px] text-[14px] text-[#BCBABA] focus:outline-none focus:border-blue-500"
                      style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                    />
                  </div>
                </div>

                {/* Status Dropdown - Positioned according to Figma */}
                <div 
                  className="absolute"
                  style={{ 
                    left: '46px', 
                    top: '246px',
                    width: '443px', 
                    height: '67px' 
                  }}
                >
                  <label 
                    className="block text-black text-[16px] font-semibold mb-2" 
                    style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                  >
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      value={editOffice.status}
                      onChange={(e) => setEditOffice({ ...editOffice, status: e.target.value })}
                      className="w-full h-10 px-4 border border-[#BCBABA] rounded-[10px] text-[14px] text-[#BCBABA] focus:outline-none focus:border-blue-500 appearance-none"
                      style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                    
                    {/* Chevron Icon - Positioned according to Figma */}
                    <div 
                      className="absolute pointer-events-none"
                      style={{ right: '19px', top: '8px' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="#BCBABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions - Positioned according to Figma */}
              <div 
                className="absolute flex gap-2.5"
                style={{ 
                  right: '45px', 
                  bottom: ' 35px'
                }}
              >
                <button
                  onClick={handleCancelEdit}
                  className="bg-white border-2 border-[#EDEDED] rounded-[5px] text-black font-bold text-[12px] hover:bg-gray-50 transition-colors flex items-center justify-center"
                  style={{ 
                    fontFamily: 'Poppins', 
                    lineHeight: '1.5em',
                    width: '127px',
                    height: '35.23px',
                    padding: '10px 10px 10px 8px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditOffice}
                  className="bg-[#155DFC] hover:bg-blue-700 rounded-[5px] text-white font-bold text-[12px] transition-colors flex items-center justify-center"
                  style={{ 
                    fontFamily: 'Poppins', 
                    lineHeight: '1.5em',
                    width: '127px',
                    height: '35.23px',
                    padding: '10px 10px 10px 8px'
                  }}
                >
                  Save
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