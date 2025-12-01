import React, { useEffect, useState } from 'react';

export default function Preloader({ loading }) {
  const [visible, setVisible] = useState(loading);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFadeOut(true); // start fade-out
      const timeout = setTimeout(() => setVisible(false), 500); // remove after animation
      return () => clearTimeout(timeout);
    } else {
      setVisible(true);
      setFadeOut(false);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
        {/* Optional loading text */}
        <p className="mt-4 text-blue-800 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
}
