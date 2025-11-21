export default function SuccessModal({ isOpen, onContinue }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[523px] h-[307px] relative shadow-2xl flex flex-col items-center justify-center">
        <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#14AE5C"/>
            <path d="M20 30L26.6667 36.6667L40 23.3333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-[#2ECC71] text-2xl font-bold mb-4" style={{ fontFamily: 'Roboto' }}>SUCCESS</h2>
        <p className="text-[#4A4A4A] text-xl text-center leading-6 mb-8" style={{ fontFamily: 'Roboto' }}>
          Your consultation request has been received.
        </p>
        <button onClick={onContinue} className="w-50 h-12 bg-[#2ECC71]! rounded-lg text-white text-base font-bold hover:bg-[#27AE60] transition-colors" style={{ fontFamily: 'Roboto' }}>Continue</button>
      </div>
    </div>
  );
}
