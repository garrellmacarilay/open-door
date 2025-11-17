import React, { useState, useEffect, useRef } from "react";

import landingBg from "../../assets/img/bg-image.png";
import student1 from "../../assets/img/student-1.png";
import student2 from "../../assets/img/student-2.png";
import student3 from "../../assets/img/student-3.png";
import school1 from "../../assets/img/school-1.png";
import school2 from "../../assets/img/school-2.png";
import Footer from "./Footer.jsx";



export const FrameLandingPage = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 1000, right: 0 });
  const [loginButtonVisible, setLoginButtonVisible] = useState(true);
  const contactButtonRef = useRef(null);
  const aboutUsRef = useRef(null);

  const contactInfo = [
    {
      id: 1,
      title: "Medical and Dental Services",
      email: "prefect.clinic@laverdad.edu.ph",
      icon: "🏥"
    },
    {
      id: 2,
      title: "Communications",
      email: "communications@laverdad.edu.ph",
      icon: "📢"
    },
    {
      id: 3,
      title: "Student Internship",
      email: "studentinternship@laverdad.edu.ph",
      icon: "👨‍💼"
    },
    {
      id: 4,
      title: "Student IT Support and services",
      email: "prefect.its@laverdad.edu.ph",
      icon: "💻"
    },
    {
      id: 5,
      title: "Student Organization",
      email: "prefect.sorg@laverdad.edu.ph",
      icon: "👥"
    },
    {
      id: 6,
      title: "Student Publication",
      email: "prefect.publications@laverdad.edu.ph",
      icon: "📰"
    }
  ];

  const handleEmailClick = (email) => {
    // Create mailto link with subject line
    const subject = encodeURIComponent('Inquiry from OpenDoor Website');
    const mailtoLink = `mailto:${email}?subject=${subject}`;
    
    // Try to open email client
    try {
      window.location.href = mailtoLink;
    } catch (error) {
      // Fallback: copy email to clipboard
      navigator.clipboard.writeText(email).then(() => {
        alert(`Email address copied to clipboard: ${email}`);
      }).catch(() => {
        alert(`Please send your email to: ${email}`);
      });
    }
  };

  const handleContactUs = () => {
    setShowContactModal(true);
  };

  const handleAboutUsClick = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const closeModal = () => {
    setShowContactModal(false);
  };

  // Handle scroll effect for login button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      // Hide button when scrolled more than 50% of viewport height
      setLoginButtonVisible(scrollY < viewportHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showContactModal && !event.target.closest('.contact-modal') && !event.target.closest('.contact-us-button')) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactModal]);

  return (
    <>
       <section
      // Landing Page 1st Modal
      className="relative flex flex-col justify-center items-start text-white px-6 md:px-16 py-32 min-h-screen"
      style={{ 
          backgroundImage: `url(${landingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          height: '100vh'
        }}
      > 
          
          {/* Login button overlaid on the left - hides when scrolled */}
          <div className={`fixed left-6 md:left-16 top-[70%] z-10 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
            loginButtonVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-full pointer-events-none'
          }`}>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#1e3a8a] hover:bg-[#1e40af] text-white! font-semibold transition duration-200 shadow-md hover:shadow-lg"
            >Log In</a>
          </div>
          
      </section>
      {/* Landing Page Body */}
      <div className="flex flex-col bg-[#1f3463] relative z-20">

      {/* About Us */}
      <section ref={aboutUsRef} className="aboutus bg-[#1f3463] text-white flex flex-col-reverse md:flex-row items-center justify-between gap-10 p-8 md:p-16">
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold">About Us</h2>
          <p className="text-lg leading-relaxed">
            <span className="font-bold">La Verdad Christian College (LVCC)</span>, located in
            Apalit, Pampanga, is a private, non-stock, non-sectarian institution
            providing high-quality, values-based education accessible to
            deserving students.
            <br />
            <br />
            Founded in 1998 by Brother Eli Soriano and led by Dr. Daniel Razon,
            LVCC began with preschool to high school programs, later expanding
            to college in 2005.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={school1}
            alt=" "
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="bg-[#1f3463] text-white flex flex-col md:flex-row items-center justify-between gap-10 p-8 md:p-16">
        <div className="flex-1">
          <img
            src={school2}
            alt="School"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl font-semibold">What Makes Us Unique</h2>
          <p className="text-lg leading-relaxed">
            <span className="font-bold text-[#ff6a00]">
              Full Scholarship Grant (“Study Now, Pay Never”)
            </span>{" "}
            LVCC is the first private school in the Philippines to offer full
            scholarships covering tuition, uniforms, materials, and even meals
            or dormitory needs — removing financial barriers to education.
          </p>
        </div>
      </section>

      {/* Holistic Education */}
      <section className="bg-[#1f3463]! mb-20 flex flex-col items-center text-center gap-8 p-8 md:p-16">
        <h2 className="text-4xl text-white font-semibold">Holistic Education</h2>
        <p className="max-w-3xl text-lg text-white leading-relaxed">
          Beyond academics, LVCC emphasizes Christian values, character
          formation, moral discipline, and community service. Students are
          encouraged to grow intellectually, spiritually, and socially.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {[student1, student2, student3].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Student ${i + 1}`}
              className="rounded-lg shadow-md w-72 md:w-80 object-cover"
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer onContactUsClick={handleContactUs} onAboutUsClick={handleAboutUsClick} />

      {/* Contact Us Modal */}
      {showContactModal && (
        <>
          
          {/* Modal */}
          <div className="absolute top-350 right-192 flex items-center justify-center z-50 p-4">
            <div 
              className="contact-modal bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto"
              style={{ maxHeight: '80vh' }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-7 right-8 bg-transparent text-gray-600 hover:text-black1000 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-10 transition-colors"
              >
                ×
              </button>

            {/* Modal Header */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-black" p-0 style={{ fontFamily: 'Poppins' }}>
                Contact Information
              </h2>
            </div>

            {/* Contact List */}
            <div className="p-4 space-y-1 max-h-96 overflow-y-auto border-white!">
              {contactInfo.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleEmailClick(contact.email)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border-transparent! hover:border-blue-200 group"
                  title={`Click to send email to ${contact.email}`}
                >
                  {/* Avatar/Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
                    {contact.icon}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-black leading-tight group-hover:text-blue-700 transition-colors" style={{ fontFamily: 'Roboto' }}>
                      {contact.title}
                    </h3>
                    <p className="text-sm font-light text-blue-600 group-hover:text-blue-800 transition-colors hover:underline" style={{ fontFamily: 'Roboto' }}>
                      {contact.email}
                    </p>
                  </div>

                  {/* Email Icon Indicator */}
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t text-center bg-gray-50">
              <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Poppins' }}>
                 Click on any contact to send an email
              </p>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins' }}>
               
              </p>
            </div>
            </div>
          </div>
        </>
      )}
    </div>
    </>
    
  );
};

export default FrameLandingPage;
