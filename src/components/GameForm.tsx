import React, { useState } from 'react';
import { Gamepad2, Users, PenTool, Brain, Sticker, Dices } from 'lucide-react';
import { GameOption } from './GameOption';
import { GAME_TYPES } from '../utils/gameTypes';

interface Game {
  id: keyof typeof GAME_TYPES;
  title: string;
  description: string;
  icon: any;
  players: string;
}

export const AVAILABLE_GAMES: { id: keyof typeof GAME_TYPES; title: string; description: string; icon: any; players: string; minPlayers: number; }[] = [
  {
    id: 'drawguess',
    title: GAME_TYPES.drawguess,
    description: 'Draw pictures and let others guess what it is!',
    icon: PenTool,
    players: '2-12 players',
    minPlayers: 2,
  },
  {
    id: 'trivia',
    title: GAME_TYPES.trivia,
    description: 'Test your knowledge across various categories',
    icon: Brain,
    players: '2-8 players',
    minPlayers: 2,
  },
  {
    id: 'wordplay',
    title: GAME_TYPES.wordplay,
    description: 'Create the funniest combinations of words',
    icon: Sticker,
    players: '4-10 players',
    minPlayers: 4,
  },
  {
    id: 'partypack',
    title: GAME_TYPES.partypack,
    description: 'A mix of mini-games for maximum fun',
    icon: Dices,
    players: '3-8 players',
    minPlayers: 3,
  },
];

interface GameFormProps {
  onBack: () => void;
  onHost?: (gameId: string, hostName: string) => void; // Optional for hosting
  onJoin?: (roomCode: string, playerName: string) => void; // Optional for joining
  mode: 'host' | 'join'; // New prop to determine mode
}

export function GameForm({ onBack, onHost, onJoin, mode }: GameFormProps) {
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [hostName, setHostName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const isHostValid = selectedGameId && hostName.trim().length >= 2;
  const isJoinValid = roomCode.length === 4 && playerName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'host' && onHost && isHostValid) {
      onHost(selectedGameId, hostName);
    } else if (mode === 'join' && onJoin && isJoinValid) {
      onJoin(roomCode, playerName);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-full bg-pink-500/20">
          {mode === 'host' ? <Gamepad2 className="w-12 h-12 text-pink-500/80" /> : <Users className="w-12 h-12 text-indigo-500/80" />}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{mode === 'host' ? 'Host a Game' : 'Join a Game'}</h2>
          <p className="text-gray-300">{mode === 'host' ? 'Choose a game and set your host name' : 'Enter the room code and your name to join'}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
          {mode === 'host' && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 text-left">Select a Game</label>
                <div className="grid gap-3">
                  {AVAILABLE_GAMES.map((game) => (
                    <GameOption
                      key={game.id}
                      title={game.title}
                      description={game.description}
                      icon={game.icon}
                      players={game.players}
                      isSelected={selectedGameId === game.id}
                      onClick={() => setSelectedGameId(game.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value.slice(0, 20))}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  maxLength={20}
                />
                {hostName && hostName.length < 2 && (
                  <p className="text-sm text-pink-400">Name must be at least 2 characters</p>
                )}
              </div>
            </>
          )}

          {mode === 'join' && (
            <>
              <div className="space-y-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder="Room Code (4 digits)"
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  pattern="[A-Z0-9]{4}"
                  maxLength={4}
                />
                {roomCode && roomCode.length !== 4 && (
                  <p className="text-sm text-pink-400">Room code must be 4 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  maxLength={20}
                />
                {playerName && playerName.length < 2 && (
                  <p className="text-sm text-pink-400">Name must be at least 2 characters</p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={mode === 'host' ? !isHostValid : !isJoinValid}
              className={`w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                mode === 'host'
                  ? isHostValid
                    ? 'bg-pink-500 hover:bg-pink-600 text-white'
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : isJoinValid
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {mode === 'host' ? 'Create Game' : 'Join Game'}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 rounded-lg font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}