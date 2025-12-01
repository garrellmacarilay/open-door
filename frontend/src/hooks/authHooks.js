import api from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext.jsx'

export function useGoogleLogin() {
  const navigate = useNavigate()
  
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`
  }
  
  return { handleGoogleLogin }
}

export function useLogin() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, logout: contextLogout } = useAuth();
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    setLoading(true)
    setMessage('Logging in...')

    try {
      const res = await api.post('/login', { email, password })
      
      const { success, access_token, message, user } = res.data;

      if (success && access_token) {
        await login(access_token);

        setMessage('Login successful! redirecting...')

        navigate('/dashboard', {success: true})
      } else {
        setMessage(message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      const res = await api.post('/logout')

      if (res.data.success) {
        contextLogout()
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to log out')
      setLoading(false)
    }
  }

  return { handleLogin, handleLogout, loading, message }
}


