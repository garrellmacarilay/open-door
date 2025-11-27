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

export function useLogin() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    setLoading(true)
    setMessage('Login in progress')

    try {
      const res = await api.post('/login', { email, password })
      
      const { success, access_token, message, user } = res.data;

      if (success && access_token) {
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))

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
      const res = await api.post('/logout')

      if (res.data.success) {
        localStorage.removeItem('token')
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to log out')
    }
  }

  return { handleLogin, handleLogout, loading, message }
}


