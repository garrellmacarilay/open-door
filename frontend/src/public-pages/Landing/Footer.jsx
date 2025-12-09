import React from "react";
import { Info, Phone, MapPin } from "lucide-react";
import LVCCLogo from "../../assets/img/LV_Logo.png";

export default function Footer({ onContactUsClick, onAboutUsClick }) {
  return (
    <footer className="bg-black text-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-evenly items-center  md:items-start px-6 md:px-16 py-10 border-t border-white/30">
        {/* Left Section */}
        <div className="flex flex-col ml-30 pt-9 space-y-3 text-left md:mb-0">
          <div className="flex items-center space-x-3 cursor-pointer hover:text-yellow-400 transition-colors" onClick={onAboutUsClick}>
            <Info className="text-white" size={18} />
            <p className="font-semibold">About Us</p>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:text-yellow-400 transition-colors contact-us-button" onClick={onContactUsClick}>
            <Phone className="text-white" size={18} />
            <p className="font-semibold">Contact Us</p>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="text-white" size={18} />
            <p className="font-semibold">
              MacArthur Highway, Sampaloc, Apalit, Pampanga
            </p>
          </div>
        </div>

        {/* Middle Divider + Logo */}
        <div className="flex flex-col ml-20 md:flex-row items-center md:space-x-8">
          {/* Divider */}
          <div className="hidden md:block w-0.5 h-45 bg-white/50"></div>
        </div>
        
        <div className="flex flex-row ml-20 md:flex-row items-center md:space-x-8"> 
          {/* Right Section (Vision & Mission) */}
          <img
          src={LVCCLogo}
          alt="LVCC Logo"
          className="w-24 h-24 object-contain my-4 md:my-0"
          />

          <div className="text-left md:text-left space-y-4 max-w-sm">
            {/* Vision */}
            <div>
              <span className="bg-yellow-400 text-black font-bold px-2 py-1 text-sm">
                VISION
              </span>
              <p className="italic mt-2 text-sm">
                The institution that ensures quality learning and Biblical moral
                standards.
              </p>
            </div>

            {/* Mission */}
            <div>
              <span className="bg-yellow-400 text-black font-bold px-2 py-1 text-sm">
                MISSION
              </span>
              <p className="italic mt-2 text-sm">
                To be a frontrunner in providing academic excellence and morally
                upright principle.
              </p>
            </div>

          </div>
        </div>
        
      </div>

      {/* Bottom Section */}
      <div className="bg-black text-center py-3 border-t border-white/20">
        <p className="text-sm font-semibold">
          © 2025 OpenDoor. All rights reserved. |{" "}
        </p>
      </div>
    </footer>
  );
}
