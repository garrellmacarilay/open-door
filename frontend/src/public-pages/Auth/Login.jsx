import React, { useState } from "react";
import { ArrowLeft } from "lucide-react"; // optional, for the back icon
import Login_img from "../../components/global-img/LVCC-Gate.jpg";
import PSAS_Logo from "../../components/global-img/PSAS-Logo.png";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", { email, password });
  };
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-linear-to-b bg-[#1F3463]! ">
      <div className="flex flex-col h-160 mx-60 justify-center content-center md:flex-row w-full rounded-2xl overflow-hidden shadow-[0px_8px_50px_20px_rgba(112,112,112,0.22)] bg-white">
        {/* Left - Login Form */}
        
        <div className="w-full md:w-1/2 p-10 pt-6 relative flex flex-col justify-center content-center">
          {/* Back Arrow */}
          <button className="absolute top-6 left-6 text-black bg-white! p-2 rounded-full  hover:bg-gray-100 transition">
            <ArrowLeft size={24} />
          </button>
          {/* Logo */}

         <div className="flex flex-col items-center">
          <img
            src={PSAS_Logo}
            alt="PSAS Logo"
            className="w-60 h-60 object-contain mx-auto -my-12"
          />
          {/* <h2 className="text-2xl font-bold text-center text-blue-800 mt-2" style={{fontFamily: 'Inter',lineHeight: '1.6em'}}>
            Welcome Back!
          </h2> */}
          
         </div>
      
          <form className="flex flex-col gap-4 mt-8">
            <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition"
                />
            </div>
            <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition"
                />
            </div>


            <button
              onClick={handleSubmit}
              className="w-full bg-[#1e3a8a]! hover:bg-[#1e40af] text-white font-semibold py-3 rounded-md transition duration-200 shadow-md hover:shadow-lg"
            >
              Log In
            </button>

            <div className="flex items-center my-4">
              <div className="grow border-t border-gray-300"></div>~
              <span className="mx-2 text-gray-500 text-sm">or</span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 rounded-md transition bg-white! hover:bg-blue-700 text-black border-gray-600!"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>

        {/* Right - Image */}
        <div className="w-full md:w-1/2 bg-white relative flex items-center justify-center">
          <img
            src={Login_img}
            alt="School"
            className="w-full h-full object-cover opacity-90!"
          />

        </div>

      </div>
    </div>
  );
}
