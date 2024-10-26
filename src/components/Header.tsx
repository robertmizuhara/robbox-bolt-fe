import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      // Clear any stored game session data
      localStorage.removeItem('gameCode');
      localStorage.removeItem('clientUuid');
      
      // Navigate to root
      navigate('/', { replace: true });
    }
  };

  return (
    <button
      onClick={handleHomeClick}
      className="sticky w-full bg-gray-800 border-b border-white/20 p-3 hover:bg-gray-700 transition-colors z-500 mb-0"
    >
      <span className="text-2xl font-bold italic text-white antialiased">
        robbox.tv
      </span>
    </button>
  );
}
