import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // optional, for the back icon
import Login_img from "../../components/global-img/LVCC-Gate.jpg";
import PSAS_Logo from "../../components/global-img/PSAS-Logo.png";
import api from "../../utils/api";
import { useGoogleLogin, useLogin } from '../../hooks/authHooks'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { handleGoogleLogin } = useGoogleLogin()
  const { handleLogin, loading, message } = useLogin()


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    
    await handleLogin(email, password)
  };

  // const handleGoogleLogin = () => {
  //   // Here you would implement Google OAuth
  //   console.log("Google login clicked");
  //   alert("Google login functionality would be implemented here");
  //   // For demo purposes, navigate to admin (replace with actual Google OAuth)
  //   // navigate("/admin");
  // };

  const handleBackClick = () => {
    navigate("/"); // Navigate back to landing page
  };
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-linear-to-b bg-[#1F3463]! ">
      <div className="flex flex-col h-160 mx-60 justify-center content-center md:flex-row w-full rounded-2xl overflow-hidden shadow-[0px_8px_50px_20px_rgba(112,112,112,0.22)] bg-white">
        {/* Left - Login Form */}
        
        <div className="w-full md:w-1/2 p-10 pt-6 relative flex flex-col justify-center content-center">
          {/* Back Arrow */}
          <button 
            onClick={handleBackClick}
            className="absolute top-6 left-6 text-black bg-white p-2 rounded-full hover:bg-gray-100 transition"
          >
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
      
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
            <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition"
                />
            </div>
            <div className="relative">
                <input
                  type={showPassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>


            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-md transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="flex items-center my-4">
              <div className="grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500 text-sm">or</span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 rounded-md transition bg-white hover:bg-gray-50 text-black border border-gray-300 hover:border-blue-500"
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
