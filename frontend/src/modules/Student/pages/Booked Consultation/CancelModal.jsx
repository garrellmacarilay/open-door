import React from 'react';

export default function CancelModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
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
          <div 
            className="absolute text-black text-[30px] font-bold text-center" 
            style={{ fontFamily:'Roboto', left: '162px', top: '58px', width: '285px', height: '16px' ,lineHeight: '0.53em' }}>
            Confirm Cancellation
          </div>

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

          <div
            className="absolute bg-[#2ECC71] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#27ae60] transition-colors"
            style={{ left: '115px', top: '240px', width: '174px', height: '48px' }}
            onClick={onConfirm}
          >
            <span className="text-white text-[20px] font-bold text-center" style={{ fontFamily: 'Roboto', lineHeight: '0.8em' }}>Yes</span>
          </div>       

          <div
            className="absolute bg-[#FF4A4A] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#e74c3c] transition-colors"
            style={{ left: '311px', top: '240px', width: '174px', height: '48px' }}
            onClick={onClose}
          >
            <span className="text-white text-[20px] font-bold text-center" style={{ fontFamily: 'Roboto', lineHeight: '0.8em' }}>No</span>
          </div>
        </div>
      </div>
    </div>
  );
}
