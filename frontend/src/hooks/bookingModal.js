// bookingModal.js
import { useState } from "react";

export function useBookingModal() {
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return {
        showReminderModal,
        showBookingModal,
        showSuccessModal,
        openReminder: () => setShowReminderModal(true),
        closeReminder: () => setShowReminderModal(false),
        openBooking: () => setShowBookingModal(true),
        closeBooking: () => setShowBookingModal(false),
        openSuccess: () => setShowSuccessModal(true),
        closeSuccess: () => setShowSuccessModal(false),
    };
}

export function useRescheduleModal() {
    
}
