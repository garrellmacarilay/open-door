export default function BookConsultationModal({ 
  isOpen, 
  onCancel, 
  form, 
  setForm, 
  handleSubmit, 
  offices = [] // offices from hook
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px]! w-full max-w-200 max-h-165 overflow-y-auto relative flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#122141] rounded-t-[10px] px-12 py-5 shrink-0">
          <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
            Book a Consultation
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-2 px-6">

            {/* Office */}
            <div className="space-y-1 -pt-3">
              <label className="block text-black  text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                Office *
              </label>
              <div className="relative">
                    <select
                        value={form.office_id}
                        onChange={(e) => setForm({ ...form, office_id: e.target.value })}
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC]"
                        style={{ fontFamily: 'Inter' }}
                        required
                    >
                    <option value="">Select Office</option>
                        {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                            {office.office_name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16L17.5 20.5L22 16" stroke="#8C8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                Type of Service *
              </label>
              <select
                value={form.service_type}
                onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                required
              >
                <option value="">Select Service Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Therapy">Therapy</option>
                <option value="Assessment">Assessment</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>

            <div className ="flex gap-4 flex-row">
                {/* Date */}
                <div className="space-y-1 flex-1">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm( {...form, date: e.target.value })}
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm [&::-webkit-calendar-picker-indicator]:filter-[invert(50)]"
                        style={{ fontFamily: 'Inter' }}
                        required
                      />
                    </div>
                </div>
                {/* Time */}
                <div className="space-y-1 flex-1">
                  <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Time *
                  </label>
                  <div className="relative w-full">
                    <input
                      type="time"
                      value={form.time}            
                      onChange={(e) => setForm( {...form, time: e.target.value })}
                      className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                      style={{ fontFamily: 'Inter' }}
                      required
                    />
                  </div>
                </div>
            </div>


            {/* Concern Description */}
            <div className="space-y-1">
              <label className="block text-black font-semibold" style={{ fontFamily: 'Inter' }}>
                Concern Description *
              </label>
              <textarea
                value={form.concern_description}
                onChange={(e) => setForm({ ...form, concern_description: e.target.value })}
                placeholder="Briefly describe your concern"
                className="w-full px-3 py-2 border border-[#9B9999] rounded-[7px] text-black text-sm bg-[#FFFCFC] resize-none"
                rows={4}
                required
              />
            </div>

            {/* Group Members */}
            <div className="space-y-1">
              <label className="block text-black font-semibold" style={{ fontFamily: 'Inter' }}>
                Group Members (Optional)
              </label>
              <textarea
                value={form.group_members}
                onChange={(e) => setForm({ ...form, group_members: e.target.value })}
                placeholder="Enter names of group members"
                className="w-full px-3 py-2 border border-[#9B9999] rounded-[7px] text-black text-sm bg-[#FFFCFC] resize-none"
                rows={2}
              />
            </div>

            {/* Attachment */}
            <div className="space-y-1">
              <label className="block text-black font-semibold" style={{ fontFamily: 'Inter' }}>
                Attachment (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setForm({ ...form, uploaded_file_url: e.target.files[0] })}
                className="w-full text-sm text-black border border-[#9B9999] rounded-[7px] bg-[#FFFCFC] file:px-3 file:py-1 file:border-0 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 sticky pb-2 rounded-b-[10px]! ">
              <button
                type="button"
                onClick={onCancel}
                className="border border-[#000000]! rounded-lg text-black! text-xs font-medium bg-white! hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Inter' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="justify-center items-center bg-[#155DFC]! rounded-lg text-white text-xs font-medium hover:bg-[#0d47c4] transition-colors"
                style={{ fontFamily: 'Inter' }}
              >
                Submit Request
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
