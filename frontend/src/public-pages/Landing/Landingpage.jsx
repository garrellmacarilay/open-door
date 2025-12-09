import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import landingBg from "../../assets/img/bg-image.png";
import student1 from "../../assets/img/student-1.png";
import student2 from "../../assets/img/student-2.png";
import student3 from "../../assets/img/student-3.png";
import school1 from "../../assets/img/school-1.png";
import school2 from "../../assets/img/school-2.png";
import psasLogo from "../../assets/img/PSAS-Logo.png";
import Footer from "./Footer.jsx";



export const FrameLandingPage = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 1000, right: 0 });
  const [loginButtonVisible, setLoginButtonVisible] = useState(true);
  const [psasLogoVisible, setpsasLogoVisible] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const contactButtonRef = useRef(null);
  const aboutUsRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/")
      navigate("/dashboard");
    }
  }, [navigate])
  
  const contactInfo = [
    {
      id: 1,
      title: "Prefect and Assistant Prefect",
      email: "prefect@laverdad.edu.ph",
      icon: "👨‍💼"
    },
    {
      id: 2,
      title: "Guidance",
      email: "prefect.guidance@laverdad.edu.ph",
      icon: "🧭"
    },
    {
      id: 3,
      title: "Medical Clinic",
      email: "prefect.clinic@laverdad.edu.ph",
      icon: "🏥"
    },
    {
      id: 4,
      title: "Sports Development and Management",
      email: "prefect.sports@laverdad.edu.ph",
      icon: "⚽"
    },
    {
      id: 5,
      title: "Student Assistance and Experiential Learning",
      email: "prefect.assistance@laverdad.edu.ph",
      icon: "🎓"
    },
    {
      id: 6,
      title: "Student Discipline",
      email: "prefect.discipline.highered@laverdad.edu.ph",
      icon: "📋"
    },
    {
      id: 7,
      title: "Student Internship",
      email: "studentinternship@laverdad.edu.ph",
      icon: "💼"
    },
    {
      id: 8,
      title: "IT Support Services",
      email: "prefect.its@laverdad.edu.ph",
      icon: "💻"
    },
    {
      id: 9,
      title: "Student Organizations",
      email: "prefect.sorg@laverdad.edu.ph",
      icon: "👥"
    },
    {
      id: 10,
      title: "Student Publications",
      email: "prefect.publications@laverdad.edu.ph",
      icon: "📰"
    }
  ];

  const handleLoginPage = () => {
    navigate('/login')
  }

  const handleEmailClick = (email) => {
    // Copy email to clipboard
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(email);
      console.log('Email copied to clipboard:', email);
      // Clear the copied state after 2 seconds
      setTimeout(() => {
        setCopiedEmail(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy email:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // Also show copied effect for fallback
      setCopiedEmail(email);
      setTimeout(() => {
        setCopiedEmail(null);
      }, 2000);
    });
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
      setpsasLogoVisible(scrollY < viewportHeight * 0.95);
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
      {/* PSAS Logo - Fixed at upper left of viewport */}
     
      <div className={`fixed -top-5 -left-5 z-50 ${
        psasLogoVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-full pointer-events-none'
       }`}>
        <img
          src={psasLogo}
          alt="PSAS Logo"
          className="w-20 h-20 md:w-32 md:h-32 object-contain"
        />
        
       </div>

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
          <div className={`fixed left-6 md:left-16 top-[70%] z-10 ${
            loginButtonVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-full pointer-events-none'
          }`}>
            <a
              onClick={handleLoginPage}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#122141] hover:bg-[#1e40af] text-white! font-semibold transition duration-200 shadow-md hover:shadow-lg"
            >Log In</a>
          </div>
          
      </section>
      {/* Landing Page Body */}
      <div className="flex flex-col bg-[#122141] relative z-20">

      {/* About Us */}
      <section ref={aboutUsRef} className="aboutus bg-[#122141] text-white flex flex-col-reverse md:flex-row items-center justify-between gap-10 p-8 md:p-16">
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
      <section className="bg-[#122141] text-white flex flex-col md:flex-row items-center justify-between gap-10 p-8 md:p-16">
        <div className="flex-1">
          <img
            src={school2}
            alt="School"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-4 pl-10">
          <h2 className="text-4xl font-semibold">What Makes Us Unique</h2>
          <p className="text-lg leading-relaxed">
            <span className="font-bold text-[#d7cd06]">
              Full Scholarship Grant  <span className="font-bold text-white">(“Study Now, Pay Never”)</span>
            </span>{" "}
           <br />
            LVCC is the first private school in the Philippines 
            to grant a full scholarship program that covers tuition, 
            miscellaneous fees, uniforms, instructional materials,  
            meals for deserving students. 
            <br />
            <br /> 
            This removes financial barriers so many face 
            in pursuing education.
          </p>
        </div>
      </section>

      {/* Holistic Education */}
      <section className="bg-[#1122141]! mb-20 flex flex-col items-center text-center gap-8 p-8 md:p-16">
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
              className="rounded-lg shadow-md w-80 md:w-100 object-cover"
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
          <div className="absolute top-364 right-171 flex items-center justify-center z-50 p-4">
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
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border-transparent! group ${
                    copiedEmail === contact.email 
                      ? 'bg-green-100 border-green-300 shadow-md' 
                      : 'hover:bg-blue-50 hover:border-blue-200'
                  }`}
                  title={copiedEmail === contact.email ? 'Email copied to clipboard!' : `Click to copy ${contact.email} to clipboard`}
                >
                  {/* Avatar/Icon */}
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-300 ${
                    copiedEmail === contact.email
                      ? 'bg-green-200 border-green-400'
                      : 'bg-gray-100 border-gray-200 group-hover:bg-blue-100'
                  }`}>
                    {contact.icon}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold leading-tight transition-colors ${
                      copiedEmail === contact.email
                        ? 'text-green-700'
                        : 'text-black group-hover:text-blue-700'
                    }`} style={{ fontFamily: 'Roboto' }}>
                      {contact.title}
                    </h3>
                    <p className={`text-sm font-light transition-colors hover:underline ${
                      copiedEmail === contact.email
                        ? 'text-green-600'
                        : 'text-blue-600 group-hover:text-blue-800'
                    }`} style={{ fontFamily: 'Roboto' }}>
                      {copiedEmail === contact.email ? '✓ Copied to clipboard!' : contact.email}
                    </p>
                  </div>

                  {/* Copy Icon Indicator */}
                  <div className={`transition-colors ${
                    copiedEmail === contact.email
                      ? 'text-green-600'
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`}>
                    {copiedEmail === contact.email ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t text-center bg-gray-50">
              <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Poppins' }}>
                 Click on any contact to copy email address
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
