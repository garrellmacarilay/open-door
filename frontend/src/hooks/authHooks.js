import api from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useGoogleLogin() {
  const navigate = useNavigate()
  
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`
  }
  
  return { handleGoogleLogin }
}

