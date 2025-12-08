import React, { useState } from 'react';
import FAQsBG from "../../../../components/global-img/LVCC-Gate.jpg";


function FAQsContent() {
  const [openFaqId, setOpenFaqId] = useState(null);

  const faqs = [
    {
      id: 6,
      question: "What counseling and guidance services are available?",
      answer: "Our counseling and guidance services include individual counseling, group sessions, career guidance, academic advising, mental health support, and crisis intervention. Students can schedule appointments through the consultation booking system."
    },
    {
      id: 5,
      question: "How can I join a student organization?",
      answer: "To join a student organization, attend the orientation sessions at the beginning of each semester, visit the Student Affairs office to get a list of active organizations, or contact organization leaders directly through the campus portal."
    },
    {
      id: 4,
      question: "How early should I book an appointment?",
      answer: "Appointments must be scheduled at least 2 days before the scheduled date. This allows the office to properly prepare and ensure availability of staff members for your consultation."
    },
    {
      id: 3,
      question: "How can I set an appointment?",
      answer: "You can set an appointment by clicking on the 'Book Consultation' button in your dashboard, selecting your preferred office, choosing an available date and time, and providing the purpose of your consultation."
    },
    {
      id: 2,
      question: "What services does the office offer?",
      answer: "The office provides various services including academic support, counseling services, health services, student organization management, library resources, IT support, and communication assistance for student activities and events."
    },
    {
      id: 1,
      question: "Where is the PSAS located?",
      answer: "The Prefect of Student Affairs and Services office is located on the second floor of the main administrative building, Room 201. Office hours are Monday to Friday, 8:00 AM to 5:00 PM."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="bg-[#E9E9E9] h-full w-full">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* FAQs Content Container */}
        <div className="flex flex-row relative bg-white rounded-2xl shadow-lg w-300 h-146 m-auto my-7 p-9">

          {/* Left Side - LV Photo */}
          <div 
            className="flex w-118 h-122 rounded-[13px] shadow-lg m-3 mb-4 bg-cover bg-center"
            style={{
              backgroundImage: `url(${FAQsBG})`,
              boxShadow: '0px 8px 10px 0px rgba(0, 0, 0, 0.25)',
              zIndex: 1
            }}
          />

          {/* Right Side - FAQs Section */}
          <div className="flex flex-col w-140 h-138 ml-12 justify-center items-center">
            {/* Large FAQs Title */}
            <span className="text-black mt-6 mx-auto justify-center items-center">
              <h1 className="font-bold text-6xl!" stlyle={{fontFamily:"Poppins"}} >FAQs</h1>
            </span>

            {/* FAQ Items */}
            <div className="space-y-[11px] flex-1 mt-3 mb-6">

              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className=" flex flex-col rounded-[20px] border-l-10 border-l-[#1F3463] items-center justify-between shadow-xl overflow-hidden ease-in-out"
                  style={{
                    height: openFaqId === faq.id ? 'auto' : '50px'
                  }}
                >
                  {/* Question Header - Clickable */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="bg-white! hover:bg-gray-200! w-full px-6 py-3 flex items-center justify-between"
                  >
                    <span 
                      className="text-left text-[16px] text-black leading-[23.4px] font-medium"
                      style={{ 
                        fontFamily: 'Poppins',
                      }}
                    >
                      {faq.question}
                    </span>
                    
                    {/* Chevron Icon */}
                    <div className="flex items-center ml-4 shrink-0 color">
                      <svg 
                        width="12" 
                        height="8" 
                        viewBox="0 0 12 8" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`}
                      >
                        <path 
                          d="M1 1L6 6L11 1" 
                          stroke="#292929" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Answer - Expandable with smooth animation */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p 
                        className="text-[14px] text-gray-700 leading-relaxed"
                        style={{ 
                          fontFamily: 'Inter',
                          lineHeight: '1.6em'
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQsContent;