import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const [ params ] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [params, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
      Redirecting, please wait...
    </div>
  );
};

export default AuthCallback;