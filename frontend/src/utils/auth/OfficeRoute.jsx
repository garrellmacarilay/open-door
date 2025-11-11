import { Navigate } from "react-router-dom";

export default function OfficeRoute({ children }) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "staff") {
        return <Navigate to="/login" replace />;
    }

    return children
}