import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname !== '/') {
      // Clear any stored game session data
      localStorage.removeItem('gameCode');
      localStorage.removeItem('clientUuid');
    }
  };

  return (
    <a
      href="/"
      onClick={handleHomeClick}
      className="block w-full bg-gray-800 border-b border-white/20 p-4 hover:bg-gray-700 transition-colors z-50 text-center"
    >
      <span className="text-2xl font-bold italic text-white antialiased">
        robbox.tv
      </span>
    </a>
  );
}
