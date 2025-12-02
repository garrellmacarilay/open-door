import React, { useState } from 'react';
import { useHistory, useFeedback } from '../../../../hooks/studentHooks';
import LoadingBlock from '../../../../loading/LoadingBlock';
function BookingHistory() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const { bookings: historyBookings, fetchHistoryBookings, loading } = useHistory();
  const [bookings, setBookings ] = useState([])

  React.useEffect(() => {
    if (historyBookings.length === 0) {
      fetchHistoryBookings();
    }
  }, []);
  
  React.useEffect(() => {
    setBookings(historyBookings);
  }, [historyBookings]);

  // Find selected booking
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Pass the selected booking to the hook (unconditional call)
  const feedback = useFeedback(selectedBooking);

  const openFeedbackModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowFeedbackModal(true);

    // reset rating/comment whenever modal opens
    feedback.setRating('');
    feedback.setComment('');
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedBookingId(null);

    feedback.setRating('');
    feedback.setComment('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    try {
      const res = await feedback.handleSubmit();

      if (res.success) {
        // Update local bookings
        const updatedBookings = bookings.map(b =>
          b.id === selectedBookingId
            ? { ...b, hasFeedback: true, comment: feedback.comment, rating: feedback.rating }
            : b
        );
        setBookings(updatedBookings);

        closeFeedbackModal();
      } else {
        // Feedback already exists — still mark it locally
        const updatedBookings = bookings.map(b =>
          b.id === selectedBookingId
            ? { ...b, hasFeedback: true, comment: feedback.comment, rating: feedback.rating }
            : b
        );
        setBookings(updatedBookings);

        alert(res.message);
        closeFeedbackModal();
      }

    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback');
    }
  };

  // renderStars and renderInteractiveStars remain unchanged
  // For displaying existing feedback stars
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

  // For interactive star rating in the modal
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

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
        <div className="h-full p-4 md:p-8 overflow-y-auto">
          <LoadingBlock />
          <LoadingBlock />
          <LoadingBlock />
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-[#E9E9E9] font-inter">
        <p className="text-gray-600 text-lg font-semibold">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        {/* Main Container with Shadow */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
          {/* Booking History Cards */}
          <div className="space-y-4 md:space-y-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="w-full max-w-full overflow-auto">
                <div className={`flex flex-col bg-white rounded-[10px] border border-[#E7E7E7] w-full transition-all duration-300 overflow-hidden ${booking.hasFeedback ? 'min-h-[220px]' : 'h-[154px]'}`}>
                  {/* Main Content Row */}
                  <div className="flex justify-between items-start pt-[25px] px-8 pb-4">
                    <div className="flex flex-col items-start flex-1">
                      <div className="text-black text-[14px] font-medium leading-[17px] font-inter mb-3">
                        {booking.student_name}
                      </div>
                      <div className="text-black text-[14px] font-medium leading-[17px] font-inter mb-2.5">
                        {booking.office_name}
                      </div>
                      <div className="text-black text-[14px] font-medium leading-[17px] font-inter mb-3">
                        {booking.concern_description}
                      </div>
                      <div className="text-black text-[14px] font-medium leading-[17px] font-inter">
                        {booking.consultation_date}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {!booking.hasFeedback && (
                        <div 
                          className="w-[134px] h-[29px] bg-[#1156E8] hover:bg-[#0d47d1] rounded-[5px] flex items-center justify-center gap-2.5 cursor-pointer transition-colors px-[5px]"
                          onClick={() => openFeedbackModal(booking.id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3V12M3 7.5H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-white text-[12px] font-semibold leading-[14.52px] tracking-[-0.02em] font-inter">
                            Add Feedback
                          </span>
                        </div>
                      )}
                      <div className="w-[98px] h-[29px] bg-[#87B7FF] rounded-[5px] flex items-center justify-center">
                        <span className="text-[#002374] text-[14px] font-medium font-poppins leading-[21px]">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {booking.hasFeedback && (
                    <div className="flex flex-col px-8 pb-6">
                      <div className="border-t border-[#BFBFBF] mb-4" />
                      <div className="text-black text-[14px] font-normal leading-[17px] text-left italic font-inter mb-4">
                        {booking.comment}
                      </div>
                      <div className="flex justify-start">
                        {renderStars(booking.rating)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Feedback Modal */}
        {showFeedbackModal && feedback && (
          <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div className="bg-white rounded-[10px] shadow-lg" style={{width:'582px', height:'408px'}}>
              <div className="bg-[#122141] rounded-t-[10px] flex items-center px-11" style={{ height:'84px' }}>
                <h2 className="text-white text-[20px] font-bold font-inter" style={{lineHeight:'24px'}}>
                  Consultation Feedback
                </h2>
              </div>
              <form onSubmit={handleSubmitFeedback}>
                <div className="p-11 ">
                  <div className="mb-4 -mt-2.5">
                    <h3 className="text-black text-[14px] font-medium font-inter mb-4">Rating</h3>
                    {renderInteractiveStars(feedback.rating, feedback.setRating)}
                  </div>
                  <div className="mb-2">
                    <label className="block text-black text-[14px] font-medium font-inter mb-3">Your Feedback</label>
                    <textarea
                      value={feedback.comment}
                      onChange={(e) => feedback.setComment(e.target.value)}
                      className="w-full h-[101px] p-5 border border-[#B2B2B2] rounded-[10px] text-4 text-black font-inter resize-none focus:outline-none focus:border-[#155DFC]"
                      style={{lineHeight:'16px'}}
                    />
                  </div>
                  <div className="flex justify-end gap-3 item-center">
                    <button type="button" onClick={closeFeedbackModal} className="px-5 border bg-white! justify-center item-center rounded-lg text-[#0F172B] text-3 font-medium font-inter hover:bg-gray-50 transition-colors shadow-sm" style={{height:'40px'}}>Cancel</button>
                    <button type="submit" className="px-5 bg-[#155DFC]! justify-center item-center rounded-lg text-[#F8FAFC] text-[14px] font-medium font-inter hover:bg-[#0d47c4] transition-colors" style={{height:'40px'}}>Submit Feedback</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
