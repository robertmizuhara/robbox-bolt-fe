import React from 'react';

export function Header() {
  const handleHomeClick = () => {
    // For now this just refreshes, we'll add proper routing later
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleHomeClick}
      className="fixed top-0 left-0 w-full bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 hover:bg-black/30 transition-colors z-50"
    >
      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
        robbox.tv
      </span>
    </button>
  );
}
