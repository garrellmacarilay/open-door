import React, { useState } from 'react';
import LoadingBlock from '../../../../loading/LoadingBlock';

function BookedConsultation({ recentBookings }) {
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

  const getStatusStyles = (status) => {
    switch (status) {
      case 'New Appointment':
        return { bgColor: 'bg-[#1156E8]', textColor: 'text-white' };
      case 'Cancelled':
        return { bgColor: 'bg-[#FF0707]', textColor: 'text-white' };
      case 'Completed':
        return { bgColor: 'bg-[#15A031]', textColor: 'text-white' };
      default:
        return { bgColor: 'bg-gray-500', textColor: 'text-white' };
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
    // Handle reschedule logic here
    console.log('Reschedule consultation:', id);
  };

  const renderGraduationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5L16.5 4.5L9 7.5L1.5 4.5L9 1.5Z" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 6.75V11.25C4.5 12.4926 6.67893 13.5 9 13.5C11.3211 13.5 13.5 12.4926 13.5 11.25V6.75" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderOfficeIcon = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
      <rect x="1" y="3" width="14" height="10" stroke="#0059FF" strokeWidth="2" />
      <path d="M5 1L8 3L11 1" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderServiceIcon = () => (
    <svg width="16" height="14" viewBox="0  0 16 14" fill="none">
      <circle cx="8" cy="7" r="6" stroke="#0059FF" strokeWidth="2" />
      <path d="M6 7L7.5 8.5L10 6" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderDateIcon = () => (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
      <rect x="1" y="3" width="12" height="12" stroke="#360055" strokeWidth="2" />
      <path d="M4 1V5M10 1V5" stroke="#360055" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const isLoading = !recentBookings || recentBookings.length === 0;

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">

          <div className="space-y-4 md:space-y-8">

            {/* LOADING SKELETONS */}
            {isLoading ? (
              <>
                <LoadingBlock />
                <LoadingBlock />
                <LoadingBlock />
              </>
            ) : (
              consultations.map((consultation) => {
                const statusStyles = getStatusStyles(consultation.status);

                return (
                  <div key={consultation.id} className="w-full max-w-full overflow-hidden">
                    <div className="relative bg-white rounded-[10px] border-[0.5px] border-[#BDBDBD] w-full max-w-full h-[167px] overflow-hidden">

                      <div className={`absolute top-[117px] right-[27px] w-[70px] h-[25px] ${statusStyles.bgColor} rounded-[5px] flex items-center justify-center`}>
                        <span className={`${statusStyles.textColor} text-[10px] font-semibold`}>
                          {consultation.status}
                        </span>
                      </div>

                      <div className="absolute left-5 top-[15px] flex items-center gap-2.5">
                        {renderGraduationIcon()}
                        <span className="text-black text-[15px] font-bold">
                          {consultation.studentName}
                        </span>
                      </div>

                      <div className="absolute left-5 top-12 flex items-center gap-2.5">
                        {renderOfficeIcon()}
                        <span className="text-black text-[15px] font-bold">
                          {consultation.office}
                        </span>
                      </div>

                      <div className="absolute left-5 top-20 flex items-center gap-2.5">
                        {renderServiceIcon()}
                        <span className="text-black text-[15px] font-bold">
                          {consultation.service}
                        </span>
                      </div>

                      <div className="absolute left-5 top-28 flex items-center gap-2.5">
                        {renderDateIcon()}
                        <span className="text-black text-[15px] font-bold">
                          {consultation.date}
                        </span>
                      </div>

                      {consultation.showButtons && consultation.status === 'New Appointment' && (
                        <>
                          <div
                            className="absolute right-[135px] top-[115px] w-[105px] h-[29px] bg-[#1156E8] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#0d47d1]"
                            onClick={() => handleReschedule(consultation.id)}
                          >
                            <span className="text-white text-[12px] font-semibold">
                              Reschedule
                            </span>
                          </div>

                          <div
                            className="absolute right-2.5 top-[115px] w-26 h-7 bg-[#FF0707] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#e60606]"
                            onClick={() => handleCancelRequest(consultation.id)}
                          >
                            <span className="text-white text-[12px] font-semibold">
                              Cancel Request
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
      </div>
    </div>
  );
}

export default BookedConsultation;
