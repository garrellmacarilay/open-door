// src/common/hooks/useAuth.js
import { useState } from "react";

export const useAuth = () => {
  // Normally you'd get this from Context or localStorage
  const [user] = useState({
    isAuthenticated: true,
    role: "student", // can be 'staff' or 'admin'
  });

  return user;
};
