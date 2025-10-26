import React, {useState} from 'react';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = React.useState('');
    // const [loading, setLoading] = React.useState(false);
    // const [error, setError] = React.useState('');
    // const [success, setSuccess] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [password, setPassword] = React.useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Login in progress...');

        try {
            const res = await axios.post(`${API_URL}/api/login`, {
                email,
                password
            });

            const data = res.data;

            if (data.success) {
                localStorage.setItem('token', data.token);
                setMessage('Login successful!');

                // Redirect to dashboard or another page
                window.location.href = '/dashboard';
            }
        } catch (error) {
            if (error.res) {
                setMessage(error.res.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    } 

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    }

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
    )
}