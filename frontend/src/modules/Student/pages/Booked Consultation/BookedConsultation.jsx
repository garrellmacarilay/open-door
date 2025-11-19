import React, { useState } from 'react';

function BookedConsultation() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      studentName: 'Garrell Macarilay',
      office: 'Medical and Dental Services',
      service: 'Medical Checkup',
      date: 'October 17, 2025',
      status: 'New Appointment',
      showButtons: true
    },
    {
      id: 2,
      studentName: 'Garrell Macarilay',
      office: 'Medical and Dental Services',
      service: 'Medical Checkup',
      date: 'October 17, 2025',
      status: 'Cancelled',
      showButtons: false
    },
    {
      id: 3,
      studentName: 'Garrell Macarilay',
      office: 'Medical and Dental Services',
      service: 'Medical Checkup',
      date: 'October 17, 2025',
      status: 'Completed',
      showButtons: false
    },
    {
      id: 4,
      studentName: 'Garrell Macarilay',
      office: 'Medical and Dental Services',
      service: 'Medical Checkup',
      date: 'October 17, 2025',
      status: 'Completed',
      showButtons: false
    }
  ]);

  const [rescheduleFormData, setRescheduleFormData] = useState({
    office: '',
    serviceType: '',
    date: '',
    startTime: '',
    endTime: '',
    topic: '',
    groupMembers: '',
    attachment: null
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case 'New Appointment':
        return {
          bgColor: 'bg-[#1156E8]',
          textColor: 'text-white'
        };
      case 'Cancelled':
        return {
          bgColor: 'bg-[#FF0707]',
          textColor: 'text-white'
        };
      case 'Completed':
        return {
          bgColor: 'bg-[#15A031]',
          textColor: 'text-white'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-white'
        };
    }
  };

  const handleCancelRequest = (id) => {
    setSelectedConsultationId(id);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    setConsultations(consultations.map(consultation => 
      consultation.id === selectedConsultationId 
        ? { ...consultation, status: 'Cancelled', showButtons: false }
        : consultation
    ));
    setShowCancelModal(false);
    setSelectedConsultationId(null);
  };

  const cancelCancellation = () => {
    setShowCancelModal(false);
    setSelectedConsultationId(null);
  };

  const handleRescheduleInputChange = (field, value) => {
    setRescheduleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    console.log('Reschedule form submitted:', rescheduleFormData);
    setShowRescheduleModal(false);
    setSelectedConsultationId(null);
    // Reset form
    setRescheduleFormData({
      office: '',
      serviceType: '',
      date: '',
      startTime: '',
      endTime: '',
      topic: '',
      groupMembers: '',
      attachment: null
    });
  };

  const handleRescheduleCancel = () => {
    setShowRescheduleModal(false);
    setSelectedConsultationId(null);
    // Reset form
    setRescheduleFormData({
      office: '',
      serviceType: '',
      date: '',
      startTime: '',
      endTime: '',
      topic: '',
      groupMembers: '',
      attachment: null
    });
  };

  const handleReschedule = (id) => {
    const consultation = consultations.find(c => c.id === id);
    if (consultation) {
      setRescheduleFormData({
        office: consultation.office,
        serviceType: consultation.service,
        date: '',
        startTime: '',
        endTime: '',
        topic: '',
        groupMembers: '',
        attachment: null
      });
      setSelectedConsultationId(id);
      setShowRescheduleModal(true);
    }
  };

  const renderGraduationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 1.5L16.5 4.5L9 7.5L1.5 4.5L9 1.5Z"
        stroke="#0059FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4.5 6.75V11.25C4.5 12.4926 6.67893 13.5 9 13.5C11.3211 13.5 13.5 12.4926 13.5 11.25V6.75"
        stroke="#0059FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const renderOfficeIcon = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        stroke="#0059FF"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M5 1L8 3L11 1"
        stroke="#0059FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const renderServiceIcon = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="8"
        cy="7"
        r="6"
        stroke="#0059FF"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M6 7L7.5 8.5L10 6"
        stroke="#0059FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const renderDateIcon = () => (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1"
        y="3"
        width="12"
        height="12"
        stroke="#360055"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M4 1V5M10 1V5"
        stroke="#360055"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M1 7H13"
        stroke="#360055"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        {/* Main Container with Shadow */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
          {/* Consultation Cards */}
          <div className="space-y-4 md:space-y-8">
            {consultations.map((consultation) => {
              const statusStyles = getStatusStyles(consultation.status);
              
              return (
                <div key={consultation.id} className="w-full max-w-full overflow-hidden">
                  {/* Card Container */}
                  <div className="relative bg-white rounded-[10px] border-[0.5px] border-[#BDBDBD] w-full max-w-full h-[167px] overflow-hidden">
                    
                    {/* Status Badge */}
                    <div 
                      className={`absolute top-[117px] right-[27px] w-[70px] h-[25px] ${statusStyles.bgColor} rounded-[5px] flex items-center justify-center`}
                    >
                      <span className={`${statusStyles.textColor} text-[10px] font-semibold leading-tight tracking-[-0.02em] font-inter`}>
                        {consultation.status}
                      </span>
                    </div>

                    {/* Student Name with Icon */}
                    <div className="absolute left-5 top-[15px] flex items-center gap-2.5">
                      {renderGraduationIcon()}
                      <span className="text-black text-[15px] font-bold leading-[5px] text-center font-inter">
                        {consultation.studentName}
                      </span>
                    </div>

                    {/* Office with Icon */}
                    <div className="absolute left-5 top-12 flex items-center gap-2.5">
                      {renderOfficeIcon()}
                      <span className="text-black text-[15px] font-bold leading-[5px] text-center font-inter">
                        {consultation.office}
                      </span>
                    </div>

                    {/* Service with Icon */}
                    <div className="absolute left-5 top-20 flex items-center gap-2.5">
                      {renderServiceIcon()}
                      <span className="text-black text-[15px] font-bold leading-[5px] text-center font-inter">
                        {consultation.service}
                      </span>
                    </div>

                    {/* Date with Icon */}
                    <div className="absolute left-5 top-28 flex items-center gap-2.5">
                      {renderDateIcon()}
                      <span className="text-black text-[15px] font-bold leading-[5px] text-center font-inter">
                        {consultation.date}
                      </span>
                    </div>

                    {/* Action Buttons - Only for New Appointments */}
                    {consultation.showButtons && consultation.status === 'New Appointment' && (
                      <>
                        {/* Reschedule Button */}
                        <div 
                          className="absolute right-[135px] top-[115px] w-[105px] h-[29px] bg-[#1156E8] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#0d47d1] transition-colors"
                          onClick={() => handleReschedule(consultation.id)}
                        >
                          <span className="text-white text-[12px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                            Reschedule
                          </span>
                        </div>

                        {/* Cancel Request Button */}
                        <div 
                          className="absolute right-2.5 top-[115px] w-26 h-7 bg-[#FF0707] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#e60606] transition-colors"
                          onClick={() => handleCancelRequest(consultation.id)}
                        >
                          <span className="text-white text-[12px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                            Cancel Request
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-2xl shadow-lg"
              style={{
                width: '600px',
                height: '320px'
              }}
            >
              {/* Modal Content */}
              <div className="relative w-full h-full">
                {/* Title */}
                <div 
                  className="absolute text-black text-[30px] font-bold text-center"
                  style={{
                    fontFamily: 'Roboto',
                    left: '162px',
                    top: '58px',
                    width: '285px',
                    height: '16px',
                    lineHeight: '0.53em'
                  }}
                >
                  Confirm Cancellation
                </div>

                {/* Message */}
                <div 
                  className="absolute text-black text-[25px] font-normal text-center"
                  style={{
                    fontFamily: 'Roboto',
                    left: '50px',
                    top: '144px',
                    width: '509px',
                    height: '16px',
                    lineHeight: '0.64em'
                  }}
                >
                  Are you sure you want to cancel your request?
                </div>

                {/* Yes Button */}
                <div 
                  className="absolute bg-[#2ECC71] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#27ae60] transition-colors"
                  style={{
                    left: '115px',
                    top: '240px',
                    width: '174px',
                    height: '48px'
                  }}
                  onClick={confirmCancellation}
                >
                  <span 
                    className="text-white text-[20px] font-bold text-center"
                    style={{
                      fontFamily: 'Roboto',
                      lineHeight: '0.8em'
                    }}
                  >
                    Yes
                  </span>
                </div>

                {/* No Button */}
                <div 
                  className="absolute bg-[#FF4A4A] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#e74c3c] transition-colors"
                  style={{
                    left: '311px',
                    top: '240px',
                    width: '174px',
                    height: '48px'
                  }}
                  onClick={cancelCancellation}
                >
                  <span 
                    className="text-white text-[20px] font-bold text-center"
                    style={{
                      fontFamily: 'Roboto',
                      lineHeight: '0.8em'
                    }}
                  >
                    No
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="fixed bg-[#00000080] inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-[10px]! w-full max-w-200 max-h-165 overflow-y-auto relative flex flex-col shadow-2xl">
              {/* Modal Header */}
              <div className="bg-[#122141] rounded-t-[10px] px-12 py-5 shrink-0">
                <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                  Appointment Rescheduling
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6 flex-1 overflow-y-auto ">
                <form onSubmit={handleRescheduleSubmit} className="space-y-2 px-6 ">
                  {/* Office Selection */}
                  <div className="space-y-1 -pt-3">
                    <label className="block text-black  text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Office <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={rescheduleFormData.office}
                        onChange={(e) => handleRescheduleInputChange('office', e.target.value)}
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                        style={{ fontFamily: 'Inter' }}
                        required
                      >
                        <option value="">Select Office</option>
                        <option value="Prefect of Student and Services">Prefect of Student and Services</option>
                        <option value="Guidance and Counseling">Guidance and Counseling</option>
                        <option value="Medical and Dental Services">Medical and Dental Services</option>
                        <option value="Sports Development and Management">Sports Development and Management</option>
                        <option value="Student Assistance and Experiential Education">Student Assistance and Experiential Education</option>
                        <option value="Student Discipline">Student Discipline</option>
                        <option value="Student Internship">Student Internship</option>
                        <option value="Student IT Support and Services">Student IT Support and Services</option>
                        <option value="Student Organization A">Student Organization A</option>
                        <option value="Student Publication">Student Publication</option>
                      </select>
                      
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 16L17.5 20.5L22 16" stroke="#8C8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Type of Service */}
                  <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Type of Service <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={rescheduleFormData.serviceType}
                        onChange={(e) => handleRescheduleInputChange('serviceType', e.target.value)}
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                        style={{ fontFamily: 'Inter' }}
                        required
                      >
                        <option value="">Select Service Type</option>
                        <option value="Individual Consultation">Individual Consultation</option>
                        <option value="Group Consultation">Group Consultation</option>
                        <option value="Emergency Consultation">Emergency Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div className ="flex gap-3 flex-row">
                      {/* Date */}
                    <div className="space-y-1 flex-4">
                      <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={rescheduleFormData.date}
                          onChange={(e) => handleRescheduleInputChange('date', e.target.value)}
                          className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm"
                          style={{ fontFamily: 'Inter' }}
                          required
                        />
                      </div>
                    </div>
                      {/* Time */}
                    <div className="space-y-1 flex-2">
                        <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                          <input
                            type="time"
                            value={rescheduleFormData.startTime}
                            onChange={(e) => handleRescheduleInputChange('startTime', e.target.value)}
                            className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white "
                            style={{ fontFamily: 'Inter' }}
                            required
                          />
                        </div>
                    </div>
                    <div className="space-y-1 flex-2">
                        <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                          <input
                            type="time"
                            value={rescheduleFormData.endTime}
                            onChange={(e) => handleRescheduleInputChange('endTime', e.target.value)}
                            className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white "
                            style={{ fontFamily: 'Inter' }}
                            required
                          />
                        </div>
                    </div>

                  </div>

                  {/* Topic */}
                  <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rescheduleFormData.topic}
                      onChange={(e) => handleRescheduleInputChange('topic', e.target.value)}
                      placeholder="Provide a brief overview of your concern."
                      className="w-full h-12 px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                      style={{ fontFamily: 'Inter' }}
                      required
                    />
                  </div>

                  {/* Group Members (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Group Members (Optional)
                    </label>
                    <textarea
                      value={rescheduleFormData.groupMembers}
                      onChange={(e) => handleRescheduleInputChange('groupMembers', e.target.value)}
                      placeholder="Enter your group members' names."
                      className="w-full h-[45px] px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                      style={{ fontFamily: 'Inter' }}
                    />
                  </div>

                  {/* Attachment (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Attachment (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleRescheduleInputChange('attachment', e.target.files[0])}
                        className="w-full h-9 border border-[#9B9999] rounded-10 text-[#8C8B8B] text-sm bg-[#FFFCFC] file:mr-4 file:mt-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        style={{ fontFamily: 'Inter' }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4 sticky pb-2 rounded-b-[10px]! ">
                    <button
                      type="button"
                      onClick={handleRescheduleCancel}
                      className="border border-[#000000]! rounded-[10px] w-25 h-9 text-black! text-base font-medium bg-white! hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: 'Inter' }}
                    >
                     Cancel
                    </button>
                    <button
                      type="submit"
                      className="justify-center items-center bg-[#155DFC]! rounded-[10px] w-35 h-9 text-white text-base font-medium hover:bg-[#0d47c4] transition-colors"
                      style={{ fontFamily: 'Inter' }}
                    >
                      Reschedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookedConsultation;