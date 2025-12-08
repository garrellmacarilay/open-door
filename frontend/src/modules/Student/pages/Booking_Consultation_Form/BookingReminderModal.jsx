export default function BookingReminderModal({ isOpen, onCancel, onContinue }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080]  flex items-center justify-center z-50">
      <div className="bg-white rounded-t-[15px] rounded-b-[10px] w-[488px] h-60 relative shadow-lg">
        {/* Header */}
        <div className="bg-[#122141] rounded-t-[10px] w-full h-[84px] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10.5" stroke="white" strokeWidth="2"/>
                <path d="M14 9V14L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Inter' }}>
              Booking Reminder
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col h-40 justify-between">
          <div className="text-center">
            <p className="text-black text-xl font-medium leading-6 mb-0" style={{ fontFamily: 'Inter' }}>
              Booking a schedule must be done 2 days before the scheduled date.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="border-gray-900! h-8 px-3 rounded-lg text-[#000000] text-sm font-medium  hover:bg-gray-50 "
              style={{ fontFamily: 'Inter' }}
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              className=" bg-[#155DFC]! h-8 px-3 rounded-lg text-white text-sm font-medium hover:bg-[#0d47c4]"
              style={{ fontFamily: 'Inter' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
