import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionExpiredModal() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpire = () => setShow(true);

    window.addEventListener("token-expired", handleExpire);

    return () => {
      window.removeEventListener("token-expired", handleExpire);
    };
  }, []);

  const handleLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpired");

    navigate("/login");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[380px] text-center">
        <h2 className="text-xl font-bold mb-2 text-red-600">Session Expired</h2>
        <p className="text-gray-600 mb-4">
          Your session has expired for security reasons. Please log in again.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Login Again
        </button>
      </div>
    </div>
  );
}
