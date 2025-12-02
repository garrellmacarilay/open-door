import React, { useEffect, useState } from "react";

export default function RescheduleModal({ isOpen, onClose, booking, onSubmit }) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newFile, setNewFile] = useState(null);

  // Populate existing schedule when modal opens
  useEffect(() => {
    if (booking) {
      const dateObj = new Date(booking.consultation_date);

      setNewDate(dateObj.toISOString().split("T")[0]);
      setNewTime(dateObj.toTimeString().slice(0, 5));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const combinedDateTime = `${newDate}T${newTime}`;

    onSubmit({
      consultation_date: combinedDateTime,
      file: newFile,
    });
  };

  return (
    <div className="fixed bg-[#00000080] inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px]! w-full max-w-200 max-h-165 overflow-y-auto relative flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#122141] rounded-t-[10px] px-12 py-5 shrink-0">
          <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
            Appointment Rescheduling
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto ">
            <form onSubmit={handleSubmit} className="space-y-2 px-6 ">

                {/* OFFICE */}
                <div className="space-y-1 -pt-3">
                    <label className="block text-black  text-base font-semibold" style={{ fontFamily: 'Inter' }}>Office <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={booking.office}
                        disabled
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                        style={{ fontFamily: 'Inter' }}
                    />
                </div>

                {/* SERVICE TYPE */}
                <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>Type of Service <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={booking.service_type}
                        disabled
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                        style={{ fontFamily: 'Inter' }}
                    />
                </div>

                {/* DATE + TIME ROW */}
                <div className="flex gap-3 flex-row">
                    {/* DATE */}
                    <div className="space-y-1 flex-4">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                        Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm"
                            style={{ fontFamily: 'Inter' }}
                        />
                    </div>
                    
                    </div>

                    {/* TIME */}
                    <div className="space-y-1 flex-2">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                        Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-full">
                        <input
                            type="time"
                            required
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white "
                            style={{ fontFamily: 'Inter' }}
                        />
                    </div>
                    
                    </div>
                </div>

                {/* CONCERN / TOPIC */}
                <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>Topic</label>
                    <textarea
                        disabled
                        value={booking.concern_description}
                        className="w-full h-12 px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                        style={{ fontFamily: 'Inter' }}
                    />
                </div>
                
                {/* GROUP MEMBERS */}
                <div className="space-y-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Group Members (Optional)
                    </label>

                    <textarea 
                        value={booking.group_members}
                        disabled
                        className="w-full h-[45px] px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                        style={{ fontFamily: 'Inter' }}
                    >

                    </textarea>
                </div>

                {/* FILE INPUT */}
                <div className="space-y-1">
                    <label className="block text-black text-base font-semibold">Attachment</label>
                    <input
                        type="text"
                        readOnly
                        value={newFile ? newFile.name : booking.uploaded_file_url?.split('/').pop()}
                        className="w-full border border-[#9B9999] rounded-[7px] text-sm"
                    />
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-4 sticky pb-2 rounded-b-[10px]! ">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-black rounded-[10px] w-24 h-9 text-black bg-white hover:bg-gray-100"
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
  );
}
