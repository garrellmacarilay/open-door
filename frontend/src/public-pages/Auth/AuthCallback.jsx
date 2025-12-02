import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthCallback() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth()

    useEffect(() => {
        const token = params.get("token");

        if (token) {
            login(token).then(() => {
                navigate('/dashboard')
            })
        } else {
            navigate("/login");
        }
    }, [params, navigate]);

    return (
        <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
        Redirecting, please wait...
        </div>
    );

}