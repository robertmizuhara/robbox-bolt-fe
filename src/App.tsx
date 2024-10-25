import React, { useState, useEffect } from 'react';
import { Users, Gamepad2 } from 'lucide-react';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GameForm } from './components/GameForm';
import { GameLobby } from './components/GameLobby';
import { joinGame, createGame } from './services/api';

interface GameSession {
  gameCode: string;
  clientUuid: string;
}

function App() {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showHostForm, setShowHostForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoinGame = async (roomCode: string, playerName: string) => {
    try {
      const response = await joinGame({
        game_code: roomCode,
        name: playerName
      });

      setGameSession({
        gameCode: roomCode,
        clientUuid: response.uuid
      });
      setError(null); // Clear any previous error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  };

  const handleHostGame = async (gameId: string, hostName: string) => {
    try {
      const response = await createGame({
        game_type: gameId,
        name: hostName
      });

      setGameSession({
        gameCode: response.game_code,
        clientUuid: response.uuid
      });
      setError(null); // Clear any previous error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  };

  const handleTransition = (action: 'join' | 'host' | 'back') => {
    setIsAnimating(true);
    setError(null);
    if (action === 'back') {
      setShowJoinForm(false);
      setShowHostForm(false);
    } else if (action === 'join') {
      setShowJoinForm(true);
    } else {
      setShowHostForm(true);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Automatically hide the error after a certain duration
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      <Header />
      
      {error && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-red-600 border border-red-700 rounded-lg transition-transform transform translate-y-full animate-slide-in"> {/* Fixed positioning for overlay */}
          <p className="text-white text-sm">{error}</p>
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <div className={`transition-all duration-200 transform ${isAnimating ? 'scale-98' : 'scale-100'}`}>
            {gameSession ? (
              <GameLobby {...gameSession} />
            ) : showJoinForm ? (
              <GameForm 
                onBack={() => handleTransition('back')}
                onJoin={handleJoinGame}
                mode="join" // Specify the mode for joining
              />
            ) : showHostForm ? (
              <GameForm
                onBack={() => handleTransition('back')}
                onHost={handleHostGame}
                mode="host" // Specify the mode for joining
              />
            ) : (
              <div className="flex flex-col gap-4">
                <GameCard
                  title="Join a Game"
                  description='Enter a room code to join a game session'
                  icon={Users}
                  variant="primary"
                  onClick={() => handleTransition('join')}
                />

                <GameCard
                  title="Host a Game"
                  description='Create a new room and invite your "friends"'
                  icon={Gamepad2}
                  variant="secondary"
                  onClick={() => handleTransition('host')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-gray-400">
          <p className="text-sm">
            © 2024 robbox.tv • Made by rob himself 💅
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
