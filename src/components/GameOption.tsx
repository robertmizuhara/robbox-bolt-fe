import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GameOptionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
  players: string;
}

export function GameOption({ title, description, icon: Icon, isSelected, onClick, players }: GameOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-500/30 border-indigo-500'
          : 'bg-black/20 border-white/10 hover:bg-black/30'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-500/20' : 'bg-white/10'}`}>
          <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{players}</p>
        </div>
      </div>
    </button>
  );
}