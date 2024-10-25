import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export function GameCard({ title, description, icon: Icon, variant, onClick }: GameCardProps) {
  const bgColor = variant === 'primary' ? 'indigo-500' : 'pink-500';
  
  return (
    <button
      onClick={onClick}
      className="group w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center space-x-6">
        <div className={`p-4 rounded-full bg-${bgColor}/20 group-hover:bg-${bgColor}/30 transition-colors shrink-0`}>
          <Icon className={`w-8 h-8 text-${bgColor}/80`} />
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 text-sm mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}