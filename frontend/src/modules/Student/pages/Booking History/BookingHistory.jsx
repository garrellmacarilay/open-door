import React, { useState } from 'react';

function BookingHistory() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const bookingHistory = [
    {
      id: 1,
      studentName: 'Garrell Macarilay',
      office: 'Guidance and Counseling',
      purpose: 'Academic Advising',
      date: 'October 10, 2025',
      status: 'Completed',
      feedback: 'The session was insightful and supportive. The counselor listened attentively and provided clear advice that helped in personal and academic decision-making.',
      rating: 5,
      hasFeedback: true
    },
    {
      id: 2,
      studentName: 'Garrell Macarilay',
      office: 'Guidance and Counseling',
      purpose: 'Academic Advising',
      date: 'October 10, 2025',
      status: 'Completed',
      feedback: 'The session was insightful and supportive. The counselor listened attentively and provided clear advice that helped in personal and academic decision-making.',
      rating: 5,
      hasFeedback: true
    },
    {
      id: 3,
      studentName: 'Garrell Macarilay',
      office: 'Guidance and Counseling',
      purpose: 'Academic Advising',
      date: 'October 10, 2025',
      status: 'Completed',
      hasFeedback: false
    },
    {
      id: 4,
      studentName: 'Garrell Macarilay',
      office: 'Guidance and Counseling',
      purpose: 'Academic Advising',
      date: 'October 10, 2025',
      status: 'Completed',
      hasFeedback: false
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="15"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-3 md:w-5 md:h-4"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={star <= rating ? "#FFAA00" : "#E5E5E5"}
              stroke={star <= rating ? "#FFAA00" : "#E5E5E5"}
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
    );
  };

  const renderInteractiveStars = (currentRating, onStarClick) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="20"
            height="18"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onStarClick(star)}
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={star <= currentRating ? "#FFCC00" : "#E5E5E5"}
              stroke={star <= currentRating ? "#FFCC00" : "#E5E5E5"}
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
    );
  };

  const handleAddFeedback = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowFeedbackModal(true);
    setRating(0);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission logic here
    console.log('Feedback submitted:', { bookingId: selectedBookingId, rating, feedback });
    setShowFeedbackModal(false);
    setSelectedBookingId(null);
    setRating(0);
    setFeedback('');
  };

  const handleCancelFeedback = () => {
    setShowFeedbackModal(false);
    setSelectedBookingId(null);
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        {/* Main Container with Shadow */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
          {/* Booking History Cards */}
          <div className="space-y-4 md:space-y-8">
            {bookingHistory.map((booking, index) => (
              <div key={booking.id} className="w-full max-w-full overflow-hidden">
                {/* Card Container */}
                <div className={`relative bg-white rounded-[10px] border-[0.5px] border-[#BDBDBD] w-full max-w-full transition-all duration-300 overflow-hidden`}
                     style={{
                       height: booking.hasFeedback ? '213px' : '123px'
                     }}>
                
                {/* Status Badge */}
                <div className="absolute top-5 right-7 w-[70px] h-[25px] bg-[#87B7FF] rounded-[5px] flex items-center justify-center">
                  <span className="text-black text-[10px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                    {booking.status}
                  </span>
                </div>

                {/* Student Name */}
                <div className="absolute left-8 top-5 text-black text-[14px] font-medium leading-[17px] font-inter">
                  {booking.studentName}
                </div>

                {/* Office */}
                <div className="absolute left-8 top-12 text-black text-[14px] font-medium leading-[17px] font-inter">
                  {booking.office}
                </div>

                {/* Purpose */}
                <div className="absolute left-8 top-19 text-black text-[14px] font-medium leading-[17px] font-inter">
                  {booking.purpose}
                </div>

                {/* Date */}
                <div className="absolute left-8 top-26 text-black text-[14px] font-medium leading-[17px] font-inter pb-5!">
                  {booking.date}
                </div>

                {/* Feedback Section - Only for cards with feedback */}
                {booking.hasFeedback && (
                  <>
                    {/* Separator Line */}
                    <div className="absolute left-8 right-8 top-34 border-t border-[#BFBFBF]" />

                    {/* Feedback Text */}
                    <div className="absolute left-8 right-8 top-36 text-black text-[14px] font-normal leading-[17px] text-center font-inter px-4">
                      {booking.feedback}
                    </div>

                    {/* Star Rating */}
                    <div className="absolute left-8 bottom-4">
                      {renderStars(booking.rating)}
                    </div>
                  </>
                )}

                {/* Add Feedback Button - Only for cards without feedback */}
                {!booking.hasFeedback && (
                  <div 
                    className="absolute right-7 bottom-5 w-[134px] h-[29px] bg-[#1156E8] hover:bg-[#0d47d1] rounded-[5px] flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                    onClick={() => handleAddFeedback(booking.id)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 3V12M3 7.5H12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white text-[12px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                      Add Feedback
                    </span>
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-[10px] shadow-lg"
              style={{
                width: '582px',
                height: '408px'
              }}
            >
              {/* Modal Header */}
              <div 
                className="bg-[#122141] rounded-t-[10px] flex items-center px-11"
                style={{ height: '84px' }}
              >
                <h2 
                  className="text-white text-[20px] font-bold font-inter"
                  style={{ lineHeight: '24px' }}
                >
                  Consultation Feedback
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-11">
                {/* Rating Section */}
                <div className="mb-4 -mt-2.5">
                  <h3 className="text-black text-[14px] font-medium font-inter mb-4">
                    Rating
                  </h3>
                  {renderInteractiveStars(rating, setRating)}
                </div>

                {/* Feedback Section */}
                <div className="mb-2">
                  <label className="block text-black text-[14px] font-medium font-inter mb-3">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full h-[101px] p-5 border border-[#B2B2B2] rounded-[10px] text-4 text-black font-inter resize-none focus:outline-none focus:border-[#155DFC]"
                    style={{ lineHeight: '16px' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 item-center">
                  <button
                    onClick={handleCancelFeedback}
                    className="px-3 pb-10! border bg-white! justify-center item-center rounded-lg text-[#0F172B] text-3 font-medium font-inter hover:bg-gray-50 transition-colors shadow-sm"
                    style={{ height: '20px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="px-3 pb-10! bg-[#155DFC]! justify-center item-center rounded-lg text-[#F8FAFC] text-[14px] font-medium font-inter hover:bg-[#0d47c4] transition-colors"
                    style={{ height: '20px' }}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
