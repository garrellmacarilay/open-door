import React, { useState } from 'react';
import CancelModal from './CancelModal';
import RescheduleModal from './RescheduleModal';
import { useReschedule, useCancel } from '../../../../hooks/studentHooks';
import LoadingBlock from '../../../../loading/LoadingBlock';
// Import dummy data for testing - DUMMY
import { getBookedConsultations } from '../../../../utils/dummyData';

export default function BookedConsultation({ recentBookings }) {
  const { rescheduleBooking, isRescheduling } = useReschedule();
  const { isCancelling, cancelBooking } = useCancel()
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Use dummy data for testing - comment out when using real API - DUMMY
  const dummyBookings = getBookedConsultations();
  const bookingsToUse = recentBookings || dummyBookings;

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    // Immediately update UI
    try {
      await cancelBooking(selectedBooking.id)

      selectedBooking.status = 'cancelled';

    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const handleRescheduleClick = (booking) => {
    setSelectedBooking(booking);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async ({ consultation_date, file }) => {
    try {
      await rescheduleBooking(selectedBooking.id, consultation_date, file);
      selectedBooking.consultation_date = consultation_date;
      selectedBooking.status = 'rescheduled';
    } catch (err) {
      console.error(err);
    } finally {
      setShowRescheduleModal(false);
      setSelectedBooking(null);
    }
  };

  const isLoading = !recentBookings && !dummyBookings;

  if (isLoading) {
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

  // ✔ Empty state
  if (recentBookings.length === 0) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-[#E9E9E9] font-inter">
        <p className="text-gray-600 text-lg font-semibold">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
          <div className="space-y-4 md:space-y-8">
            {(
              recentBookings.map((booking) => (
                <div key={booking.id} className="w-full max-w-full overflow-hidden relative bg-white rounded-[10px] border-[0.5px] border-[#BDBDBD] h-[167px] p-5">
                  <div className="absolute top-[117px] right-[27px] w-[70px] h-[25px] bg-gray-500 text-white rounded-[5px] flex items-center justify-center text-[10px] font-semibold">
                    {booking.status || 'Approved'}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <strong>{booking.student_name}</strong>
                    </div>
                    <div>{booking.office}</div>
                    <div>{booking.service_type}</div>
                    <div>{new Date(booking.consultation_date).toLocaleString()}</div>
                  </div>

                {(booking.status === 'pending' || booking.status === 'approved' ) && (
                    <>
                      {/* Reschedule Button */}
                      <div
                        className="absolute right-[135px] top-[115px] w-[105px] h-[29px] bg-[#1156E8] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#0d47d1] transition-colors"
                        onClick={() => handleRescheduleClick(booking)}
                      >
                        <span className="text-white text-[12px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                          Reschedule
                        </span>
                      </div>

                      {/* Cancel Request Button */}
                      <div
                        className="absolute right-2.5 top-[115px] w-[105px] h-[29px] bg-[#FF0707] rounded-[5px] border border-[#AFAFAF] flex items-center justify-center cursor-pointer hover:bg-[#e60606] transition-colors"
                        onClick={() => handleCancelClick(booking)}
                      >
                        <span className="text-white text-[12px] font-semibold leading-tight tracking-[-0.02em] font-inter">
                          Cancel Request
                        </span>
                      </div>
                    </>
                  )}

                </div>
              ))
            )}
          </div>
        </div>

        <CancelModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />

        <RescheduleModal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onSubmit={handleRescheduleSubmit}
          booking={selectedBooking}
        />
      </div>
    </div>
  );
}
