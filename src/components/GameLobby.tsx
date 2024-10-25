import React, { useState, useEffect } from 'react';
import { Users, Crown, Copy, Check, Loader, Share2 } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Player } from '../types/game';
import { getGameDisplayName } from '../utils/gameTypes';
import { AVAILABLE_GAMES } from './GameForm';
import '../styles/styles.css';

interface GameLobbyProps {
  gameCode: string;
  clientUuid: string;
}

export function GameLobby({ gameCode, clientUuid }: GameLobbyProps) {
  const { isConnected, players, gameType, error } = useWebSocket(clientUuid, gameCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log('Players state updated:', players);
  }, [players]);

  useEffect(() => {
    // Store gameCode and clientUuid in local storage
    localStorage.setItem('gameCode', gameCode);
    localStorage.setItem('clientUuid', clientUuid);
  }, [gameCode, clientUuid]);

  // Retrieve gameCode and clientUuid from local storage on mount
  useEffect(() => {
    const storedGameCode = localStorage.getItem('gameCode');
    const storedClientUuid = localStorage.getItem('clientUuid');

    if (storedGameCode && storedClientUuid) {
      // Logic to re-establish the game session can go here if needed
      console.log('Restored game session:', { storedGameCode, storedClientUuid });
    }
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleShareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my game!',
          text: `Join my game with this code: ${gameCode}`,
          url: window.location.href,
        });
        console.log('Share successful');
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      console.warn('Share not supported on this browser.');
    }
  };

  const currentGame = AVAILABLE_GAMES.find(game => game.id === gameType);
  const minPlayers = currentGame ? currentGame.minPlayers : 0;
  const isHost = players.find(player => player.isVIP)?.id === clientUuid;
  const isStartButtonEnabled = players.length >= minPlayers;

  return (
    <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-white font-bold text-3xl">{getGameDisplayName(gameType || '...')}</h2>
          <p className="text-gray-400 text-base">Min. {minPlayers} Players</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-mono font-bold text-6xl text-gray-200 bg-white/10 backdrop-blur-md p-2 rounded-lg shadow-lg">
            {gameCode}
          </p>
          <div className="my-4 border-b border-white/20 w-full" />
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handleShareCode}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Share room code"
            >
              <Share2 className="w-7 h-7 text-gray-400" />
            </button>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Copy room code"
            >
              {copied ? (
                <Check className="w-7 h-7 text-green-400" />
              ) : (
                <Copy className="w-7 h-7 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Players</h3>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{players.length}</span>
            </div>
          </div>

          <div className="space-y-2" key={players.map(p => p.id).join(',')}>
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out 
              ${isHost && isStartButtonEnabled ? 
                'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 
                'bg-gray-600 cursor-not-allowed text-gray-500'}`}
            onClick={() => {/* Add your start game logic here */}}
            disabled={!isHost || !isStartButtonEnabled}
          >
            {isHost ? 'Start Game' : 'Waiting for host'}
          </button>
        </div>
        <div className="w-full pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className={`${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
            <div className="flex items-center">
              <span className="text-gray-400">Waiting for players...</span>
              {players.length >= minPlayers ? (
                <Check className="w-6 h-6 text-green-400 ml-2" />
              ) : (
                <Loader className="slow-spin w-6 h-6 text-white ml-2" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <span className="text-indigo-300 font-semibold">
            {player.name[0].toUpperCase()}
          </span>
        </div>
        <span className="text-white font-medium">{player.name}</span>
      </div>
      {player.isVIP && (
        <Crown className="w-5 h-5 text-yellow-400" />
      )}
    </div>
  );
}
