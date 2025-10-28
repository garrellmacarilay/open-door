import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Make sure this points to your axios utility

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Login in progress...');

    try {
      const res = await api.post('/login', { email, password });
      console.log('Login Response:', res.data);

      const { success, access_token, message, user } = res.data;
      const finalToken = access_token;

      if (success && finalToken) {
        localStorage.setItem('token', finalToken);

        if (user?.role) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        setMessage('Login successful! Redirecting...');

        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }     
      } else {
         setMessage(message || 'Login failed. Please try again.');
      }

    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`;
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-8 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>

      <div className="my-6 border-t border-gray-200" />

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
}
